#Imports
from fastapi import APIRouter, Request
from pydantic import BaseModel, EmailStr
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

import psycopg2
import secrets
from datetime import datetime, timedelta
from argon2 import PasswordHasher
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
from DatabaseConnect import insert,DatabaseQueryActions
from Tables import EmailVerification, Usuarios
from EmailConfig import EmailVerificationGenerator, EmailVerificationEnv
from Security import BuildResponse
#Variáveis




#Funções

router = APIRouter(
    prefix="/AuthRoutes",
    tags=["AuthRoutes"]
)

def ResolveRecentUse(rc):
     if len(rc) >= 5:
          rc.pop(0)
          return rc
     else:
          return rc

@router.post('/AuthAccessKey')
async def AuthAccessKeyFunction(request:Request):
   Data = await request.json()
   print('Datatataatatata',Data)
   result = DatabaseQueryActions['Select']('One','Usuarios','accesskey',Data.get('AccessKey'))
   print('Resultado Da Busca',result)
   if result:
      
      configs = DatabaseQueryActions['Select']('One','UserConfigs','user_id',result.id)
      userdata = DatabaseQueryActions['Select']('One','UserData','user_id',result.id)
      if not configs:
            DatabaseQueryActions['Insert']('Insert','UserConfigs',{
            'user_id':  result.id,
                })
            configs = DatabaseQueryActions['Select']('One','UserConfigs','user_id',result.id)
      if not userdata:
          DatabaseQueryActions['Insert']('Insert','UserData',{
            'user_id':  result.id,
            'recent_use':[]
                })
          userdata = DatabaseQueryActions['Select']('One','UserData','user_id',result.id)       
      user = DatabaseQueryActions['Select']('One','Usuarios','accesskey',Data.get('AccessKey'))
      response = [BuildResponse['UmbraLocalStorage']('200','UserName',user.username),
                  BuildResponse['UmbraLocalStorage']('200','accesskey',user.accesskey),
                  BuildResponse['UmbraLocalStorage']('200','UserConfigs',configs),
                  BuildResponse['UmbraLocalStorage']('200','UserData',userdata),
          BuildResponse['ExecUmbraListener']('200','AccessKeyAuth',False,True,True),]
      
      return response

@router.post('/VerifyItemsManager')
async def VerifyItemsManager(request:Request):
       Data = await request.json()
       ack = Data.get('accesskey')
       user = DatabaseQueryActions['Select']('One','Usuarios','accesskey',ack)
       if user:
            userdata = DatabaseQueryActions['Select']('One','UserData','user_id',user.id)
            recentuse = userdata.recent_use
            if not recentuse:
                 recentuse = []
            recentuse = ResolveRecentUse(recentuse)
            include = False
            i = 0
            for rc in recentuse:
                 if rc == 'ItemManager':
                      
                      if not include:
                        recentuse.pop(i)
                        recentuse.append(rc)
                      include = True     
                      
                 i+=1     
            if not include:          
                recentuse.append('ItemManager')
            DatabaseQueryActions['Update']('UpdateWhere','UserData',[('user_id','==',user.id)],{'recent_use':recentuse})
            response = [BuildResponse['UmbraLocalStorage']('200','UserData',userdata),
          BuildResponse['ExecUmbraListener']('200','GoToItemsManager',False,True,True)
          ]
            return response
       

@router.post('/VerifyAddItem')
async def VerifyAddItems(request:Request):
       Data = await request.json()
       ack = Data.get('accesskey')
       user = DatabaseQueryActions['Select']('One','Usuarios','accesskey',ack)
       if user:
            userdata = DatabaseQueryActions['Select']('One','UserData','user_id',user.id)
            recentuse = userdata.recent_use
            if not recentuse:
                 recentuse = []
            recentuse = ResolveRecentUse(recentuse)
            include = False
            i = 0
            for rc in recentuse:
                 if rc == 'AddItem':
                     
                      if not include:
                        recentuse.pop(i)
                        recentuse.append(rc)
                      include = True     
                      include = True
                 i+=1     
            if not include:          
                recentuse.append('AddItem')
            DatabaseQueryActions['Update']('UpdateWhere','UserData',[('user_id','==',user.id)],{'recent_use':recentuse})
            response = [BuildResponse['UmbraLocalStorage']('200','UserData',userdata),
          BuildResponse['ExecUmbraListener']('200','GoToAddItem',False,True,True)
          ]
            return response       


@router.post('/VerifyMoves')
async def VerifyMoves(request:Request):
       Data = await request.json()
       ack = Data.get('accesskey')
       user = DatabaseQueryActions['Select']('One','Usuarios','accesskey',ack)
       if user:
            userdata = DatabaseQueryActions['Select']('One','UserData','user_id',user.id)
            recentuse = userdata.recent_use
            if not recentuse:
                 recentuse = []
            recentuse = ResolveRecentUse(recentuse)
            include = False
            i = 0
            for rc in recentuse:
                 if rc == 'Moves':
                     
                      if not include:
                        recentuse.pop(i)
                        recentuse.append(rc)
                      include = True
                 i+=1     
            if not include:          
                recentuse.append('Moves')
            DatabaseQueryActions['Update']('UpdateWhere','UserData',[('user_id','==',user.id)],{'recent_use':recentuse})
            response = [BuildResponse['UmbraLocalStorage']('200','UserData',userdata),
          BuildResponse['ExecUmbraListener']('200','GoToMoves',False,True,True)
          ]
            return response              
