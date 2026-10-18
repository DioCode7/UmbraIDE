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
    prefix="/ConfigsRoutes",   # prefixo de rota: /users
    tags=["ConfigsRoutes"]     # aparece na documentação automática do FastAPI
)

DefaultCoinCheck = [1,2]
LanguageCheck = [0,1,2]
ThemeCheck = [0,1,2]


async def LanguageSetter(AccessKey:str,Value:int):
    User = DatabaseQueryActions['Select']('One','Usuarios','accesskey',AccessKey)
    
    if User and Value in LanguageCheck:
        DatabaseQueryActions['Update'](Method='UpdateWhere',
                                       Table='UserConfigs',
                                       Fields=[('user_id','==',User.id)],
                                       Values={'language':Value})


async def ThemeSetter(AccessKey:str,Value:int):
    User = DatabaseQueryActions['Select']('One','Usuarios','accesskey',AccessKey)
    
    if User and Value in ThemeCheck:
        DatabaseQueryActions['Update'](Method='UpdateWhere',
                                       Table='UserConfigs',
                                       Fields=[('user_id','==',User.id)],
                                       Values={'theme':Value})

async def DefaultCoinSetter(AccessKey:str,Value:str):
    User = DatabaseQueryActions['Select']('One','Usuarios','accesskey',AccessKey)
    
    if User and Value in DefaultCoinCheck:
        DatabaseQueryActions['Update'](Method='UpdateWhere',
                                       Table='UserConfigs',
                                       Fields=[('user_id','==',User.id)],
                                       Values={'default_coin':Value})
        
        
async def DollarMultiplicatorSetter(AccessKey:str,Value:str):
    User = DatabaseQueryActions['Select']('One','Usuarios','accesskey',AccessKey)
    newValue = float(Value.replace('R$','').replace('%','').replace('.','').replace(',','.').strip())
    if User and newValue:
        DatabaseQueryActions['Update'](Method='UpdateWhere',
                                       Table='UserConfigs',
                                       Fields=[('user_id','==',User.id)],
                                       Values={'dollar_multiplicator':newValue})
        

        
async def EntryMultiplicatorSetter(AccessKey:str,Value:str):
    User = DatabaseQueryActions['Select']('One','Usuarios','accesskey',AccessKey)
    newValue = float(Value.replace('R$','').replace('%','').replace('.','').replace(',','.').strip())
    if User and newValue:
        DatabaseQueryActions['Update'](Method='UpdateWhere',
                                       Table='UserConfigs',
                                       Fields=[('user_id','==',User.id)],
                                       Values={'entry_multiplicator':newValue})


        
async def LeaveMultiplicatorSetter(AccessKey:str,Value:str):
    User = DatabaseQueryActions['Select']('One','Usuarios','accesskey',AccessKey)
    newValue = float(Value.replace('R$','').replace('%','').replace('.','').replace(',','.').strip())
    if User and newValue:
        DatabaseQueryActions['Update'](Method='UpdateWhere',
                                       Table='UserConfigs',
                                       Fields=[('user_id','==',User.id)],
                                       Values={'leave_multiplicator':newValue})      

        
async def FinanceEmailsSetter(AccessKey:str,Value:bool):
    User = DatabaseQueryActions['Select']('One','Usuarios','accesskey',AccessKey)
    print('Finance Emails Update',Value)
    if User:
        DatabaseQueryActions['Update'](Method='UpdateWhere',
                                       Table='UserConfigs',
                                       Fields=[('user_id','==',User.id)],
                                       Values={'finance_emails':Value})                       

ConfigsDispactcher = {
    'default_coin':DefaultCoinSetter,
    'dollar_multiplicator':DollarMultiplicatorSetter,
    'entry_multiplicator':EntryMultiplicatorSetter,
    'leave_multiplicator':LeaveMultiplicatorSetter,
    'finance_emails':FinanceEmailsSetter,
    'language':LanguageSetter,
    'theme':ThemeSetter

}



@router.post('/SetConfig')
async def SetConfig(request:Request):
    Data = await request.json()
    try:
        for Config,Value in Data.items():
            if Config in ConfigsDispactcher:
                await ConfigsDispactcher[Config](Data.get('AccessKey'),Value)
        User = DatabaseQueryActions['Select']('One','Usuarios','accesskey',Data.get('AccessKey'))   
        data = DatabaseQueryActions['Select']('One','UserConfigs','user_id',User.id)     
        return[BuildResponse['UmbraLocalStorage']('200','UserConfigs',data),
               BuildResponse['ExecUmbraListener']('200','NewConfigsResolver',False,True,True)]     
    except Exception as e:
        print('Erro: ',e)
        return {"status": "erro", "mensagem": 'Set Config Error'}
    
@router.post('/GetConfig')
async def GetConfig(request:Request):
    Data = await request.json()
    try:
        User = DatabaseQueryActions['Select']('One','Usuarios','accesskey',Data.get('AccessKey'))      
        data = DatabaseQueryActions['Select']('One','UserConfigs','user_id',User.id)     
        return[BuildResponse['UmbraLocalStorage']('200','UserConfigs',data),
               BuildResponse['ExecUmbraListener']('200','NewConfigsResolver',False,True,True)]     
    except Exception as e:
        print('Erro: ',e)
        return {"status": "erro", "mensagem": 'Get Config Error'}