from fastapi import APIRouter, Request
from pydantic import BaseModel, EmailStr
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from email_validator import validate_email, EmailNotValidError
import psycopg2
import re
import string
import random
from decimal import Decimal
import secrets
from datetime import datetime, timedelta
from argon2 import PasswordHasher
import dns.resolver
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import ServerInit
import os
import Schemas
import DatabaseConnect
import Security
import EmailConfig
import Tables
from Schemas import EmailSchema
from Tables import EmailVerification, Usuarios
from EmailConfig import EmailVerificationGenerator, EmailVerificationEnv
from DatabaseConnect import DatabaseQueryActions,CloudUpload
from Security import BuildResponse, AuthResponses,VerifyPassword
from Auth import create_access_token,verify_access_token,build_data_token,IsDate,IsCoin,CurrencyToFloat


router = APIRouter(
    prefix="/MovementsRoutes",   # prefixo de rota: /users
    tags=["MovementsRoutes"]     # aparece na documentação automática do FastAPI
)
MoveCodeTypeTranslation = {
      1:'ENT',
      2:'SAI',
}


CoinCheck = [1,2]
MoveTypeCheck = [1,2]

MoveTypeTranslation = {
      1:'Entry',
      2:'Exit',
}


FeeTypeCheck = [1,2,3,4]
CoinsTranslation = {
1:'R$',
2:'$',
}


def EntryResolver(move,item,storage,user):
      try:
            DatabaseQueryActions['Insert']('Insert','StorageTable',{
            'item_id':item.id,
            'user_id':user.id,
            'entry_id':move.id,
            'declared_quant':move.quant,
            'quant_remaining':move.quant,
            'un_value':move.un_value,
            })

            itemstorage = item.item_storage
           
            itensstorage = DatabaseQueryActions['Select']('UmbraAllWhere','StorageTable',[('user_id','==',user.id),('item_id','==',item.id)],None)
            storagevalue = Decimal('0')
            storageentrys = 0            
            for it in itensstorage:
                  print({'Value':it.un_value})
                  storageentrys+=it.declared_quant
                  storagevalue+=it.un_value*it.declared_quant
            averagecost = storagevalue / storageentrys      
            DatabaseQueryActions['Update']('UpdateWhere','Itens',[('id','==',item.id)],{'item_storage':itemstorage+move.quant,'item_cost':move.un_value,
                                                                                        'item_average_cost':averagecost,
                                                                                        'item_last_entry':move.declared_date})
            
            return True
      except Exception as e:
            print('Entry Move Error')
            print (e)
            return False


def ExitResolver(move,item,Storages,user):
      try:
            print('Executando Exit')
            actual_value = move.quant
            balanceTotal = 0
            Remaining = move.quant

            for storage in Storages:
                  StorageQuant = storage.quant_remaining
                  
                  if Remaining >= StorageQuant:
                        alterValue = 0
                        Remaining -= StorageQuant
                  else:
                        alterValue = StorageQuant - Remaining
                        Remaining -= StorageQuant 
                        

                  DatabaseQueryActions['Update']('UpdateWhere','StorageTable',[('id','==',storage.id)],{'quant_remaining':alterValue})
                  itemstorage = item.item_storage
                  itemsales = item.item_sales

                   

                  DatabaseQueryActions['Insert']('Insert','MoveStorageTable',{
                        'move_id':move.id,
                        'storage_id':storage.id,
                        'quant':StorageQuant - alterValue
                  })
                  balanceTotal += storage.un_value*(StorageQuant - alterValue)
                  if Remaining == 0:
                        break

            DatabaseQueryActions['Update']('UpdateWhere','MovesTable',[(('id','==',move.id))],{
                        'un_balance':(move.full_value/move.quant)-(balanceTotal/move.quant),
                        'full_balance':(move.full_value/move.quant)-balanceTotal
                  })
            
            item_average_balance = item.item_average_balance
            item_full_balance = item.item_full_balance

            allmoves = DatabaseQueryActions['Select']('UmbraAllWhere','MovesTable',[('item_id','==',item.id),('user_id','==',user.id),('type','==',2)])
            mValue = 0
            mQuant = 0
            for m in allmoves:
                  mQuant += m.quant
                  mValue += m.un_balance*m.quant
            item_average_balance = mValue/mQuant      
            DatabaseQueryActions['Update']('UpdateWhere','Itens',[('id','==',item.id)],{'item_storage':itemstorage-move.quant,
                                                                                              'item_sales':itemsales+move.quant,
                                                                                              'item_full_balance':item_full_balance+(move.full_value/move.quant)-balanceTotal,
                                                                                              'item_average_balance':item_average_balance,
                                                                                              'item_last_leave':move.declared_date})
            return True


                        
      except Exception as e:
            print('Exit Move Error')
            return False      


TypeOperations={
1:EntryResolver,
2:ExitResolver,
}







def FixUn(v:float,q:int,f:float):
      return f * q
def FixTotal(v:float,q:int,f:float):
      return f
def PercentTotal(v:float,q:int,f:float):
      return (v * q) * (f / 100)
def PercentUn(v:float,q:int,f:float):
      return (v * (f / 100)) * q
FeesTypes = {
      1:FixUn,
      2:FixTotal,
      3:PercentUn,
      4:PercentTotal,
}

def VerifyObservation(obs:str):
      lenght = len(obs)
      if lenght > 70:
            return False
      return True

def GenCode():
      return ''.join(
            random.choices(
                  string.ascii_uppercase + string.digits,
                  k=6
            )
      )


def ResolveCoin(value:float,coin:int,basecoin:int,multiplicator:float):
      if coin != basecoin:
            return value * multiplicator
      else:
            return value      


def ResolveFee(value:float,quant:int,f:any,dcoin:int,multiplicator:float):
      print('Resolvendo a tarifa')
      c = CoinsTranslation[f['coin']]
      fvalue = CurrencyToFloat(c,f['value'])
      rvalue = ResolveCoin(fvalue,f['coin'],dcoin,multiplicator)
      type = f['type']
      v = FeesTypes[type](value,quant,rvalue)
      return v

       
      

@router.post('/Move')
async def Move(request:Request):
      Data = await request.json()
      try:
          ObservationBool = VerifyObservation(Data.get('obs'))
          DeclaredDateBool = IsDate(Data.get('date'))
          QuantBool = Data.get('quant') > 0

          ct = 'R$'
          UnValueBool = IsCoin(ct,Data.get('value'))
          CoinBool = Data.get('coin') in CoinCheck
          TypeBool = Data.get('type') in MoveTypeCheck 
          


          verify = [ObservationBool,DeclaredDateBool,QuantBool,UnValueBool,CoinBool,TypeBool]
          verifyobj = {
            'Obs':ObservationBool,
            'Date':DeclaredDateBool,
            'Quant':QuantBool,
            'ValueUn':UnValueBool,
            'Coin':CoinBool,
            'Type':TypeBool,
      }    
          print(verifyobj)

          if all(verify):
                user = DatabaseQueryActions['Select']('One','Usuarios','accesskey',Data.get('accesskey'))
                if not user:
                         return {
        "status": "erro",
        "mensagem": "No Access Key"
                             } 
              
                item = DatabaseQueryActions['Select']('UmbraOne','Itens',[('user_id','==',user.id),('item_code','==',Data.get('code'))],None)
                if item:
                      

                      feeslist = []
                      if Data.get('fees'):
                            for fee in Data.get('fees'):
                                  feetype = fee['type']
                                  feecoin = fee['coin']
                                  feevalue = fee['value']
                                  feename = fee['name']

                                  feetypebool = feetype in FeeTypeCheck
                                  feecoinbool = feecoin in CoinCheck
                                  ct2 = 'R$'
                                  feevaluebool = feevalue.isdigit()
                                  feenamebool = len(feename) < 50
                                  v = [feenamebool,feetypebool,feecoinbool,feevaluebool]

                                  vobj = {
                                        'feetype':feetypebool,
                                        'feecoin':feecoinbool,
                                        'feevalue':feevaluebool,
                                        'feename':feenamebool,
                                  }
                                  print(vobj)

                                  if all(v):
                                        feeslist.append(fee)


                        
                      UserConfigs = DatabaseQueryActions['Select']('One','UserConfigs','user_id',item.user_id)
                      DefaultCoin = UserConfigs.default_coin
                      DollarMultiplicator = UserConfigs.dollar_multiplicator
                      c = 'R$'
                      if DefaultCoin == 2:
                            c = '$'
                      ValueType = Data.get('valuetype')
                      value = CurrencyToFloat(c,Data.get('value'))
                      fullvalue = value * Data.get('quant')
                      if ValueType == 'Total':
                            value = value / Data.get('quant')
                            fullvalue = CurrencyToFloat(c,Data.get('value'))
                      
                      value = ResolveCoin(value,Data.get('coin'),DefaultCoin,DollarMultiplicator)
                      fullvalue = ResolveCoin(fullvalue,Data.get('coin'),DefaultCoin,DollarMultiplicator)
                      feesvalues = 0
                      for f in feeslist:
                             fvalue = ResolveFee(value,Data.get('quant'),f,DefaultCoin,DollarMultiplicator)
                             if fvalue:
                                   feesvalues += fvalue 
                                   f['realvalue'] = fvalue
                                   
                      realvalue = fullvalue + feesvalues


                      MoveCode = ''
                      MoveCode += MoveCodeTypeTranslation[Data.get('type')]
                      MoveCode += '-'+datetime.now().strftime("%Y%m%d")
                      MoveCode += '-'+GenCode()
                      Storages = []
                      if Data.get('type') == 2: 
                        AllStorage = DatabaseQueryActions['Select']('AllWhere','StorageTable','item_id',item.id)
                        
                        remaining = Data.get('quant')
                        for dict in AllStorage :
                                   dictquant = dict.quant_remaining
                                   if dictquant < remaining:
                                         Storages.append(dict)
                                         remaining -= dictquant
                                         continue
                                   else:
                                         Storages.append(dict)
                                         remaining = 0
                                         break
                        if remaining > 0:
                             print('Remanaig Problem')
                             return [BuildResponse['ExecUmbraListener']('200','ErrorMoveNotificationListener',False,True,True)]
                      Move = DatabaseQueryActions['Insert']('Insert','MovesTable',{
                            'item_id':item.id,
                            'user_id':user.id,
                            'date':datetime.now(),
                            'declared_date':Data.get('date'),
                            'quant':Data.get('quant'),
                            'coin':Data.get('coin'),
                            'type':Data.get('type'),
                            'un_value':value,
                            'full_value':realvalue,
                            'declared_value':fullvalue,
                            'Observation':Data.get('obs'),
                             'move_code':MoveCode

                      })

                     
                            

                      



                      
                      TypeOperations[Data.get('type')](Move,item,Storages,user)

                      moves = DatabaseQueryActions['Select']('AllWhere','MovesTable','user_id',user.id)
                      return [BuildResponse['UmbraLocalStorage']('200','moves',moves),BuildResponse['ExecUmbraListener']('200','SuccessMoveNotificationListener',False,True,True)]

                      
                else:
                      
                      print('Item Não Encontrado'); 
                      return [BuildResponse['ExecUmbraListener']('200','ErrorMoveNotificationListener',False,True,True)]     
          

      except Exception as e:
              print('Erro: ',e)
              return [BuildResponse['ExecUmbraListener']('200','ErrorMoveNotificationListener',False,True,True)]      
      





@router.post('/GetMoves')
async def GetMoves(request:Request):
      Data = await request.json()
      try:
            user = DatabaseQueryActions['Select']('One','Usuarios','accesskey',Data.get('accesskey'))
            if user:
                  moves = DatabaseQueryActions['Select']('AllWhere','MovesTable','user_id',user.id)
                  return BuildResponse['UmbraLocalStorage']('200','moves',moves)
      except Exception as e:
              print('Erro: ',e)
              return [BuildResponse['ExecUmbraListener']('200','ErrorGetMoveNotificationListener',False,True,True)]       