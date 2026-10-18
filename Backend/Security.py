#Imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from email_validator import validate_email, EmailNotValidError
import psycopg2
import secrets
import dns.resolver
from datetime import datetime, timedelta
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import os
from Core import __CoreRoutes__
from DatabaseConnect import DatabaseQueryActions


# Variáveis


ph = PasswordHasher()



def HashPassword(Password : str):
    return ph.hash(Password)


def VerifyPassword(email:str,password:str):

   try:

     
         
         
   
      result = DatabaseQueryActions['Select'](Method='One',Table='Usuarios',Where='email',WhereCondition=email)

      if result:

         hashed_password = result.password

         try:
            ph.verify(hashed_password,password)

            return True
         except VerifyMismatchError:
            print('Senha Difere na verificação')
            return False


   except Exception as e:
      print('Erro Ao Verificar A Senha: ',e)
      return False
      

   
   

ObjResponses = __CoreRoutes__['Routes']['Security']['Config']['ResponsesConfig']



async def AuthResponses(Auth : list,ResponsesCenter: dict):
     
     RealResult = []
     
     if Auth[0] is False:
        print('Auth Failed:',Auth[1])

        for obj in Auth[1]:

         resp = ResponsesCenter[obj]['code'][Auth[1][obj][1]]

         method = ResponsesCenter[obj]['BuildType']
         
         Result = BuildResponse[method](*resp)
            
         RealResult.append(Result)
         BoolResult = False

     else:
        RealResult = {'Status: Ok'}
        BoolResult = True


     return RealResult , BoolResult


ResponsesProtocol = {

     500: lambda: print("Erro interno do servidor."),
    400: lambda: print("Requisição inválida."),
    300: lambda: print("Redirecionamento ou conflito."),
    200: lambda: print("Operação concluída com sucesso."),



}

        


def ServerResponsesControl(obj:dict):

    Status = obj.get('HttpStatus', 500)
    action = ResponsesProtocol.get(Status)
    if action:
        action()
    else:
        print(f"Status {Status} não possui ação registrada.")



def ShowInterfaceFunction(Code : str,FrontShow : str,FrontText : str,Model : str,EspObjStyle = None):
     
     try:
      
      print('ObjResponse: ',__CoreRoutes__['Routes']['Security']['Config']['ResponsesConfig'])
      obj = __CoreRoutes__['Routes']['Security']['Config']['ResponsesConfig'].get(Code)



      if not obj:
        print(f"[Aviso] Código {Code} não encontrado em ObjResponses.")
        obj = {'HttpStatus': 500} 
    
      ServerResponsesControl(obj)
     except Exception as e:
        print('Erro ao encontrar Status: ',e)
     
    

     Response = {
         'Type':'ShowInterface',
        'Code':Code,
        'FrontShow':FrontShow,
        'FrontText':FrontText,
        'Model':Model

     }

     if EspObjStyle != None:
        Response['EspObjStyle'] = EspObjStyle

     return Response

def ClickFunction(Code:str,ClickTarget:str,Delay:bool,ActiveFn:bool,Condition:bool):
   
   try:
      
         
      print('ObjResponse: ', __CoreRoutes__['Routes']['Security']['Config']['ResponsesConfig'])
      obj =  __CoreRoutes__['Routes']['Security']['Config']['ResponsesConfig'].get(Code)



      if not obj:
        print(f"[Aviso] Código {Code} não encontrado em ObjResponses.")
        obj = {'HttpStatus': 500} 
    
      ServerResponsesControl(obj)
   except Exception as e:
        print('Erro ao encontrar Status: ',e)


   Response = {
      "Type":"Click",
      'Code':Code,
      "ClickTarget":ClickTarget,
      "Delay":Delay,
      "ActiveFn":ActiveFn,
      "Condition":Condition,
   }

   return Response


def ExecFunction(Code:str,Target:str,Delay:bool,ActiveFn:bool,Condition:bool):
   
   try:
      
         
      print('ObjResponse: ', __CoreRoutes__['Routes']['Security']['Config']['ResponsesConfig'])
      obj =  __CoreRoutes__['Routes']['Security']['Config']['ResponsesConfig'].get(Code)



      if not obj:
        print(f"[Aviso] Código {Code} não encontrado em ObjResponses.")
        obj = {'HttpStatus': 500} 
    
      ServerResponsesControl(obj)
   except Exception as e:
        print('Erro ao encontrar Status: ',e)


   Response = {
      "Type":"ExecUmbraListener",
      'Code':Code,
      "Target":Target,
      "Delay":Delay,
      "ActiveFn":ActiveFn,
      "Condition":Condition,
   }

   return Response



def LocalStorageFunction(Code:str,Key:str,Value:bool):
   
   try:
      
         
      print('ObjResponse: ', __CoreRoutes__['Routes']['Security']['Config']['ResponsesConfig'])
      obj =  __CoreRoutes__['Routes']['Security']['Config']['ResponsesConfig'].get(Code)



      if not obj:
        print(f"[Aviso] Código {Code} não encontrado em ObjResponses.")
        obj = {'HttpStatus': 500} 
    
      ServerResponsesControl(obj)
   except Exception as e:
        print('Erro ao encontrar Status: ',e)


   Response = {
      "Type":"LocalStorage",
      'Key':Key,
      "Value":Value,
   }

   return Response



def UmbraLocalStorageFunction(Code:str,Key:str,Value:bool):
   
   try:
      
         
      print('ObjResponse: ', __CoreRoutes__['Routes']['Security']['Config']['ResponsesConfig'])
      obj =  __CoreRoutes__['Routes']['Security']['Config']['ResponsesConfig'].get(Code)



      if not obj:
        print(f"[Aviso] Código {Code} não encontrado em ObjResponses.")
        obj = {'HttpStatus': 500} 
    
      ServerResponsesControl(obj)
   except Exception as e:
        print('Erro ao encontrar Status: ',e)


   Response = {
      "Type":"UmbraLocalStorage",
      'Key':Key,
      "Value":Value,
   }

   return Response


      
def AccessTokenFunction(Code:str,Method:str,token:str):
    try:
      
      print('ObjResponse: ', __CoreRoutes__['Routes']['Security']['Config']['ResponsesConfig'])
      obj =  __CoreRoutes__['Routes']['Security']['Config']['ResponsesConfig'].get(Code)



      if not obj:
        print(f"[Aviso] Código {Code} não encontrado em ObjResponses.")
        obj = {'HttpStatus': 500} 
    
      ServerResponsesControl(obj)
    except Exception as e:
        print('Erro ao encontrar Status: ',e)

    response = {
       "Type":"AccessToken",
       "Code":Code,
       "Method":Method,
       "Token":token
    }    

    return response


BuildResponse = {

    'ShowInterface':ShowInterfaceFunction,
    'Click':ClickFunction,
    'ExecUmbraListener':ExecFunction,
    'AccessToken':AccessTokenFunction,
    'LocalStorage':LocalStorageFunction,
    'UmbraLocalStorage':UmbraLocalStorageFunction,
}


def AuthFalseBuildResponses(DictsCodes, responsesMethods, responsesParams):
    listresponse = []

    for i, Code in enumerate(DictsCodes):
        if Code[1] != '200':
            listresponse.append(BuildResponse[responsesMethods[i][0]](*responsesParams[i]))

    print('ListResponse:',listresponse)
    return listresponse