from fastapi import APIRouter, Request
from pydantic import BaseModel, EmailStr
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from email_validator import validate_email, EmailNotValidError
import psycopg2
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
from DatabaseConnect import insert
from Tables import EmailVerification, Usuarios
from EmailConfig import EmailVerificationGenerator, EmailVerificationEnv
from DatabaseConnect import DatabaseQueryActions
from Security import BuildResponse, AuthResponses,VerifyPassword
from Auth import create_access_token,verify_access_token,build_data_token

engine = DatabaseConnect.engine
Session = DatabaseConnect.session
app = ServerInit.app
HashPassword = Security.HashPassword
CreateModel = Schemas.CreateModel
Usuarios = Tables.Usuarios




router = APIRouter(
    prefix="/LoginRoutes",   # prefixo de rota: /users
    tags=["LoginRoutes"]     # aparece na documentação automática do FastAPI
)


 
ResponsesCenter = {
    'email':{
        'code':{
            '200':['200','None','None','None'],
            '400':['400','Inline','InvalidEmail','EmailInputSingIn'],
            '401':['401','Inline','ExistEmail','EmailInputSingIn'],
              '500':['500','PopUp','InternalServer','None']
            
        },
        'BuildType':'ShowInterface'
    },
    'password':{
        'code':{
            '200':['200','None','None','None'],
            '401':['401','Inline','ConfirmPassword','PasswordInputSingIn'],
            '400':['400','Inline','PasswordLength','PasswordInputSingIn'],
              '500':['500','PopUp','InternalServer','None']

        },
        'BuildType':'ShowInterface'
    },
    'username':{
     'code':{
         '200':['200','None','None','None'],
            '401':['401','Inline','UsedUsername','UsernameInputSingIn'],
            '400':['400','Inline','UsernameLength','UsernameInputSingIn'],
            '500':['500','PopUp','InternalServer','None']
             
     },
     'BuildType':'ShowInterface'
    }
}






@router.post("/EmailPost")
async def EmailVerificationFunction(request:Request ):
    
    Data = await request.json()

    Auth =await AuthSingInData(Data)


    AuthVerifyStatus , AuthVerifyBool = await AuthResponses(Auth,ResponsesCenter)
    
    if AuthVerifyBool is False:
        print(AuthVerifyStatus)
        return AuthVerifyStatus
    
   
         
  
    VerificationCode = EmailVerificationGenerator()


   
   

    Senha_Hash = HashPassword(Data.get('Senha'))

    email = Data.get('Email')
    ExpiraEm = datetime.now() + timedelta(minutes = 10)

    EmailVerificationEnv(email,VerificationCode)
   
    try:
     
     
     
     DatabaseQueryActions['Insert'](
      Method='Upsert',
      Table='EmailVerification',
      Values={
        'email': email,
        'verificationcode': VerificationCode,
        'expiraem': ExpiraEm
        },
        IndexConflict='email'
        )

     DatabaseQueryActions['Insert'](
         Method='Upsert',
         Table='Usuarios',
         Values={
             'email':email,
             'password':Senha_Hash,
             'verify':False,
             'username':Data.get('UserName')
         },
         IndexConflict='email',)

    
     response = BuildResponse['ShowInterface']('200','Div','VerificationCode','VerificationCode');

     print(response)

     return [response];


    except Exception as e:
     print('Erro: ',e)
     return {"status": "erro", "mensagem": 'Erro Ao Enviar Email'}

  


async def VerifyEmailSintax(email :str) -> tuple[bool,str]:
    try:
        valid = validate_email(email)
        email_valid = valid.email

        domain = email_valid.split('@')[-1]
        dns.resolver.resolve(domain, 'MX')

        Result = await VerifyExistingEmail(email_valid)

        if Result is False:
            realresult = True
            msg = ['Email available','200']
        else:
            realresult = False
            msg = ['Email Alredy Exist','401']
         
         
        return realresult, msg
    
    except (EmailNotValidError):
        return False, ["Email Sintax is wrong",'400']
    except(dns.resolver.NXDOMAIN):
        return False, ["Email Domain Invalid",'400']
    except Exception as e:
        print('Erro Ao Verificar Email:',e)
        return False, ["Erro Ao Verificar Email",'500']

async def VerifyExistingEmail(email : str) -> bool:
    try:
      
      email = DatabaseQueryActions["Select"](Method='One',Table='Usuarios',Where='email',WhereCondition=email)
      return bool(email and getattr(email,'verify',False))
    except Exception as e:
        print('Erro Ao Consultar Email: ', e)
        return True

async def VerifyPasswordSintax(password : str,password_confirm : str) -> tuple[bool,str]:
  
  if password and password_confirm:
      result = len(password) >= 8
  else:
      result = False
    

  if result is True:
      realresult = password == password_confirm

      if realresult is True:
          msg = ["Password Verify",'200']
      else:
          msg = ["Password and Password confirm is diferent",'401']

      return realresult , msg    
     
  else:
      msg = ["Password lenght is minimal eight",'400']    

      return result, msg


async def verify_existing_username(username : str) -> bool:

    try:

           user = DatabaseQueryActions["Select"](
           Method="One",
           Table="Usuarios",
           Where="username",
           WhereCondition=username
          )

           return bool(user and getattr(user,'verify',False))

    except Exception as e:
        print('Erro Ao Verificar UserName: ',e)
        return True



async def VerifyUserName(username : str) -> tuple[bool,str]:

    try:

        if username:
          length = len(username) >= 3
        else:
            length = False
        if length is True:
            result = await verify_existing_username(username)

            if result is False:
                realresult = True
                msg = ["Username available",'200']
            else:
                realresult = False
                msg = ["Username alredy exist",'401']    
            
            

            return realresult,msg

        else:
            return False, ['username minimal lenght is three','400']            
    except Exception as e:
        print ('Erro:' ,e)
        return False, ['failed username verify','500']    

   





async def AuthSingInData(Data : dict):

    Email = Data.get('Email')
    Password = Data.get('Senha')
    UserName = Data.get('UserName')
    PasswordConfirm = Data.get('SenhaConfirm')
    
    EmailAuth , email_msg =await VerifyEmailSintax(Email)

    PasswordAuth, password_msg = await VerifyPasswordSintax(Password,PasswordConfirm)

    UserNameAuth, username_msg = await VerifyUserName(UserName)

    return [all([EmailAuth,PasswordAuth,UserNameAuth]), {
        'email':email_msg,'password':password_msg,'username':username_msg
    }]



@router.post('/VerifyAccount')
async def VerifyAccount(request: Request):

    try:

      Data = await request.json()

      email = Data.get('Email')
      verification_code = Data.get('verification_code')
      expiraem = datetime.now()

      result = DatabaseQueryActions['Filter'](Method='One',Table='EmailVerification'
                                   ,Values=[("email","==",email),("verificationcode","==",verification_code),
                                            ("expiraem",">=",expiraem)],Logic='AND')
      
      test = DatabaseQueryActions['Select'](Method='All',Table='EmailVerification')

      
      
    
      if result:
          print('Conta Verificada')

 
          insertresult = DatabaseQueryActions['Update'](Method='UpdateWhere',Table='Usuarios',Fields=[('email','==',email)],Values={'verify':True})

          if insertresult is True:
              return[BuildResponse["ShowInterface"]('200','Notification','VerifyAccount','SuccessNotification'),
                   BuildResponse["Click"]('200',['ButtonCloseVerificationCodeDiv','GoLogin'],True,False,True)]

          else:
              print('Erro No UpdateWhere:',insertresult)
              return[BuildResponse["ShowInterface"]('500','PopUp','InternalServer','InternalError')]
      else:
          print('Verificação invalida')    
          return[BuildResponse["ShowInterface"]('400','Notification','InvalidCode','ErrorNotification')]

    except Exception as e:
        print('Erro Ao Verificar Conta: ',e)
        return[BuildResponse["ShowInterface"]('500','PopUp','InternalServer','InternalError')]
       
        


@router.post('/Login')
async def LoginVerify(request:Request):

    Data = await request.json()

    try:

        email = Data.get('email')
        password = Data.get('password')
        password_result = VerifyPassword(email=email,password=password)

        if password_result:



            data_token = build_data_token(userid=email,Type='Access')

            data_token_refresh = build_data_token(userid=email,Type="Refresh")

            if data_token and data_token_refresh:

                refresh_token = create_access_token(data=data_token_refresh[0],Refresh=True,expires_delta=None)

                access_token = create_access_token(data=data_token[0],Refresh=False,expires_delta=None)

                DatabaseQueryActions['Insert'](Method='Upsert',Table='RefreshTokens',
                                               Values={
                                                   'token':refresh_token,
                                                   'user_id':data_token_refresh[1],
                                                   'init':datetime.utcnow(),
                                                   'expire':datetime.utcnow() + timedelta(days=7)
                                               },IndexConflict='user_id')
                

                
                


                print('Senha Correta')

                return [BuildResponse['ShowInterface']('200','Notification','LoginVerify','LoginVerify'),
                    BuildResponse['Click']('200',['ButtonConfirmLogin'],False,False,True),
                    BuildResponse['AccessToken']('200','Storage',access_token)]
            else:
                print('Erro Ao Buildar Token')
                return[BuildResponse["ShowInterface"]('500','PopUp','InternalServer','InternalError')]
                
            

           
        else:
            print('Senha Incorreta')    
            return[BuildResponse['ShowInterface']('400','Notification','LoginFailed','LoginFailed')]




    except Exception as e:

        print('Login Error: ',e)
        return[BuildResponse["ShowInterface"]('500','PopUp','InternalServer','InternalError')]
        

