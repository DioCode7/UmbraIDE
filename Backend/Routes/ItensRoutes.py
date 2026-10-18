from fastapi import APIRouter, Request
from pydantic import BaseModel, EmailStr
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from email_validator import validate_email, EmailNotValidError
import psycopg2
import re
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
from Auth import create_access_token,verify_access_token,build_data_token


router = APIRouter(
    prefix="/ItensRoutes",   # prefixo de rota: /users
    tags=["ItensRoutes"]     # aparece na documentação automática do FastAPI
)

async def VerifyItemName(ItemName:str)->bool:
      NameLenght = len(ItemName)
      if NameLenght >= 3:
            return True;
      else:
            return False;


async def VerifyItemCode(ItemCode:str)->bool:
      CodeLenght = len(ItemCode)
      if CodeLenght > 0 and CodeLenght < 11:
            return True;
      else:
            return False;


async def VerifyItemInitialStorage(ItemInitialStorage:str)->bool:
     return ItemInitialStorage.isdigit()

async def VerifyItemEntryDate(ItemEntryDate:str)->bool:
      print(ItemEntryDate)
      try:
        
        datetime.strptime(ItemEntryDate, "%d/%m/%Y")
        return True
      except ValueError:
        return False
      
             

async def VerifyItemDescription(ItemDescription:str)->bool:
      DescriptionLenght = len(ItemDescription);
      if DescriptionLenght < 366:
            return True;
      else:
            return False;

async def VerifyItemPhoto(ItemPhoto:str)->bool:
        PhotoVerify = ItemPhoto[11:14]
        PhotoVerify2 = ItemPhoto[11:15]      
        if PhotoVerify.lower() == 'png' or PhotoVerify.lower() == 'jpg' or PhotoVerify2.lower() == 'jpeg':
            return True
        else:
            return False


async def VerifyItemCost(ItemCost:str)->bool:
 return bool(re.fullmatch(r"R\$\s?\d+(,\d{2})?", ItemCost))

def CurrencyToFloat(Cost:str):
    return float(Cost.replace('R$','').replace('.','').replace(',','.').strip())

async def VerifyAccessKey(AccessKey:str):
     result = DatabaseQueryActions['Select']('One','Usuarios','accesskey',AccessKey)
     if result:
          return result.id
     else:
          return None

@router.post('/AddItem')
async def AddItemFunction(request:Request):
      Data = await request.json()
      try:
        ItemNameBool = await VerifyItemName(Data.get('ItemName'));
        ItemCodeBool = await VerifyItemCode(Data.get('ItemCode'));
        ItemDescription = await VerifyItemDescription(Data.get('ItemDescription'));
        ItemPhotoBool = Data.get('ItemPhoto')
        ItemPhoto = False
        UploadPhoto = False
        if ItemPhotoBool:
            ItemPhoto = await VerifyItemPhoto(Data.get('ItemPhoto'));
            UploadPhoto = True
        else:
            ItemPhoto = True
            UploadPhoto = False
        ItemCost = await VerifyItemCost(Data.get('ItemCost'));  


        Key = await VerifyAccessKey(Data.get('AccessKey'))

        VerifyObj = {
           'ItemName':ItemNameBool,
           'ItemCode':ItemCodeBool,
           'ItemDescription':ItemDescription,
           'ItemPhoto':ItemPhoto,
           'ItemCost':ItemCost,
           'AccessKey':Key,

      }  
        if ItemPhoto and UploadPhoto:
            PhotoBool,Photo = CloudUpload(Data.get('ItemPhoto'))
        else:
             Photo = None

        if(ItemNameBool and ItemCodeBool and ItemDescription and ItemPhoto and ItemCost and Key):
           Cost = Data.get('ItemCost')
           if Data.get('ItemCost') == '':
                Cost = 0;
           else:
              Cost = CurrencyToFloat(Cost)

           DatabaseQueryActions['Insert']('Insert','Itens',{
    'user_id':  Key,
    'item_name': Data.get('ItemName'),
    'item_code': Data.get('ItemCode'),
    'item_desc' :  Data.get('ItemDescription'),
   'item_storage' :  0,
    'item_cost' : Cost,
    'item_photo':Photo,
    'item_entry_date' : datetime.now().strftime("%d/%m/%Y"),
                })
           
           itemid = DatabaseQueryActions['Select']('One','Itens','item_name',Data.get('ItemName'))
           print('ItemId',itemid)
           if itemid:
                  DatabaseQueryActions['Insert']('Insert','Itens_Auxiliar',{
                     'item_id':itemid.id,
                     'item_full_cost':0,
                     'item_full_balance':0,
                     'item_average_balance':0,
                     'item_sales':0,
                     'item_average_cost':0
                  })

             

           Response = [
                BuildResponse['UmbraLocalStorage']('200','LastItemAdded',itemid)
                ,BuildResponse['ExecUmbraListener']('200','AddItemFinishPageListener',False,True,True)
                ]

           printtest = DatabaseQueryActions['Select']('All','Itens')
           print('Itens Table:',printtest)
           printtest2 = DatabaseQueryActions['Select']('All','ItensAuxiliar')
           print('ItensAuxiliar Table:',printtest2)




           return Response
        else:
              print(VerifyObj)
              return BuildResponse['ExecUmbraListener']('400','AddItemError',False,True,True);
      except Exception as e:
              print('Erro: ',e)
              return {"status": "erro", "mensagem": 'Add Item Error'}
 


@router.post('/GetItens')
async def GetItensFunction(request:Request):
      Data = await request.json()
      try:
          user = Data.get('AccessKey');
          print('User ID /////',user);
          userid = DatabaseQueryActions['Select']('One','Usuarios','accesskey',user)
          print('User ID /////',userid);
          if userid:
               itens = DatabaseQueryActions['Select']('AllWhere','Itens','user_id',userid.id)
               print('User Items /////',itens)
               return BuildResponse['UmbraLocalStorage']('200','User_Itens',itens)
      except Exception as e:
              print('Erro: ',e)
              return {"status": "erro", "mensagem": 'Get Item Error'}
      

@router.post('/GetStorage')
async def GetStorage(request:Request):
     Data = await request.json()
     try:
            user = DatabaseQueryActions('Select')['One','Usuarios','accesskey',Data.get('acesskey')]
            Item = DatabaseQueryActions('Select')['UmbraAllWhere','StorageTable',(['user_id','==',user.id])]     
     except Exception as e:
          print('Erro: ',e)
          return {"status": "erro", "mensagem": 'Get Storage Error'}     