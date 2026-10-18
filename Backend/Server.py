from fastapi import FastAPI,requests,Request,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from pydantic import BaseModel, EmailStr
import psycopg2
import secrets
from datetime import datetime, timedelta
from argon2 import PasswordHasher
import ServerInit
import os
import Schemas
import DatabaseConnect
from DatabaseConnect import DatabaseQueryActions,RegistConfigsDB,SessionLocal,UpdateTables
import EmailConfig
import Tables 
import Security

from Core import SetConfig

engine = DatabaseConnect.engine
app = ServerInit.app
SecretKey = ServerInit.SecretKey
InitDB = DatabaseConnect.InitDB




obj_response = {
   
   '100':{
      'Class':'Error',
      'Type':'System',
      'HttpStatus':500,
      

   },

   '200':{
      'Class':'Sucess',
       'Type':'Operation',
          'HttpStatus':200,


   },

   '400':{
    'Class':'Error',
    'Type':'ClientError',
    'HttpStatus':400,
   },

   '500':{
      'Class':'Error',
      'Type':'System',
      'HttpStatus':500
   }

   
}



SetConfig("Security","ResponsesConfig",obj_response)



DATABASE_URL = os.getenv("DATABASE_URL")

SetConfig('Database','DatabaseUrl',DATABASE_URL)

InitDB()

RegistConfigsDB()





@app.middleware("http")
async def BlockMobileBrowser(request: Request, call_next):
    user_agent = request.headers.get("user-agent", "").lower()
    method = request.method
    client_secret = request.headers.get("x-app-auth")
    is_mobile = any(x in user_agent for x in ["mobile", "android", "iphone", "ipad", "ipod"])

    print(f"User-Agent recebido: {user_agent}")
    print(f"IsMobile: {is_mobile}")
    print(f"ClientSecret: {bool(client_secret)}")
    print(f"Method: {method}")


    if method == "OPTIONS":
        return await call_next(request)

    if is_mobile and client_secret != SecretKey and "googlebot" not in user_agent:
        print("🚫 BLOQUEADO — Mobile sem chave válida")
        request.state.AuthMobile = False
    else:   

     print("PASSOU")
     request.state.AuthMobile = True
    response = await call_next(request)
    return response


@app.get("/InitApp")
async def AuthMobileFunction(request:Request):
    return{'AuthMobile':getattr(request.state,"AuthMobile", False)}















def TemporaryUserRegister():
    DatabaseQueryActions['Insert'](Method='Upsert', Table='Users',
    Values={
            'email':"diomhwcode@gmail.com",
            'username':'Dio',
            'password':'LojaCode230606'
         },
         IndexConflict='email',)


TemporaryUserRegister();



#@app.get("/")
#def root():
 #   try:
  #      with engine.connect() as conn:
   #         result = conn.execute(text("SELECT NOW()"))
    #        return {"status": "ok", "data": [row[0] for row in result]}
    #except Exception as e:
     #   return {"status": "erro", "detalhe": str(e)}
    #return {"msg": "API online"}

#@app.get("/")
#def test_db():
 #   try:
  #      with engine.connect() as conn:
   #         result = conn.execute(text("SELECT NOW()"))
    #        return {"status": "ok", "data": [row[0] for row in result]}
    #except Exception as e:
     #   return {"status": "erro", "detalhe": str(e)}