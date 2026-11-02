from fastapi import APIRouter, Request
from pydantic import BaseModel, EmailStr
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

import psycopg2
import secrets
from datetime import datetime, timedelta
from argon2 import PasswordHasher
import ServerInit
import os
import Schemas
import DatabaseConnect
import Security
import EmailConfig
import Tables
from Schemas import EmailSchema
from DatabaseConnect import insert,DatabaseQueryActions
from Tables import EmailVerification, Users
from EmailConfig import EmailVerificationGenerator, EmailVerificationEnv
from Security import BuildResponse
#Variáveis




#Funções

router = APIRouter(
    prefix="/SignInRoute",
    tags=["SignInRoute"]
)


async def PasswordVerification(Password:str,ConfirmPassword:str):
    Pb = False
    PbV = False

    if Password != ConfirmPassword:
     PbV = True
    if len(Password) >= 8:
     Pb = True
     print("Pb",Pb)
     print("PbV",PbV)
     if not PbV or not Pb:
        return False
     
    return True

@router.post("/SignInProtocol")
async def SignInProtocol(request: Request):
    # Extrair os dados do corpo da requisição
    data = await request.json()
    email = data.Email
    senha = data.Senha
    senha_confirm = data.SenhaConfirm
    username = data.UserName

    # Verificar Senha
    if not await PasswordVerification(senha, senha_confirm):
        return BuildResponse(400, "Password does not meet the requirements or does not match the confirmation.")
    
    return BuildResponse(200, "Usuário registrado com sucesso.")
