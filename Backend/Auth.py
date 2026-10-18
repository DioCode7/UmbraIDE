from datetime import datetime,timedelta,timezone
from jose import JWTError,jwt,ExpiredSignatureError
import secrets
import os
import re
from fastapi import APIRouter, Request
from dotenv import load_dotenv
from DatabaseConnect import DatabaseQueryActions
from Security import BuildResponse


load_dotenv()


SECRETJWTKEY = os.getenv("SecretKeyJWT")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_TIME = 60

def IsDate(date:str):
    try:  
        datetime.strptime(date, "%d/%m/%Y")
        return True
    except ValueError:
        return False
    

def IsCoin(CoinType:str,Value:float):
    if CoinType == 'R$':
      return bool(re.fullmatch(r"R\$\s?\d+(,\d{2})?", Value))
    return False    
    
def CurrencyToFloat(Type:str,Cost:str):
    return float(Cost.replace(Type,'').replace('.','').replace(',','.').strip())
    
def create_access_token(data : dict, Refresh:bool,expires_delta : timedelta | None = None):

    to_encode = data.copy()

    
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_TIME))

    if Refresh is True:
        expire = datetime.utcnow() + timedelta(days=7)

    to_encode.update({"exp":expire})

    EncodeJwt = jwt.encode(to_encode,SECRETJWTKEY,ALGORITHM)
    return EncodeJwt



def verify_access_token(token:str):
    try:
        Payload = jwt.decode(token,SECRETJWTKEY,algorithms=[ALGORITHM],options={"verify_exp": False})

        exp_time = Payload.get("exp")


        if exp_time is not None:
           
           timenow = datetime.now(timezone.utc)
           realexp = datetime.fromtimestamp(exp_time, tz=timezone.utc)

           if realexp < timenow:
              print("Token expirado!")
              print("Verificando Refresh Token...")
              userid = int(Payload.get('sub'))
              
              refresh_token_query = DatabaseQueryActions['Select']('One','RefreshTokens','user_id',userid)
              if refresh_token_query:
                refresh_token = refresh_token_query['token']
                PayloadRefresh = jwt.decode(refresh_token,SECRETJWTKEY,algorithms=[ALGORITHM],options={"verify_exp": False})

                exp_refresh = PayloadRefresh.get('exp')

                if exp_refresh is not None:
                    timenow_refresh = datetime.utcnow()
                    realexp_refresh = datetime.fromtimestamp(exp_refresh, tz=timezone.utc)
               
                    if realexp_refresh < timenow_refresh:
                        print('Refresh Token Invalido')
                        return None,[BuildResponse['Click']('400',['TokenErrorButton'],False,True,True)],None
                    else:
                       print('Refresh Token Valido!')
                       data_token = build_data_token(userid=Payload.get('sub'),Type='Access')
                       if data_token:
                            access_token = create_access_token(data=data_token[0],Refresh=False,expires_delta=None)
                            NewPayload =  Payload = jwt.decode(access_token,SECRETJWTKEY,algorithms=[ALGORITHM])
                            return NewPayload, [BuildResponse['AccessToken']('200','Storage',access_token)], access_token
                else:
                    print('Erro Ao Verificar Refresh Token')
                    return None,[BuildResponse['Click']('400',['TokenErrorButton'],False,True,True)],None    
              else:
                   print('Refresh Token Não Encontrado')
                   return None,[BuildResponse['Click']('400',['TokenErrorButton'],False,True,True)],None
           else:
                return Payload,None,None
        else:
            print('Erro Ao Verificar Token')
            return None,[BuildResponse['Click']('400',['TokenErrorButton'],False,True,True)],None 
    
      
    
    
    except ExpiredSignatureError as e:
            print("Refresh token expirado.")
            return None, [BuildResponse['Click']('400',['TokenErrorButton'],False,True,True)],None
    except JWTError as e:
      print("Token inválido!",str(e))
      return None,[BuildResponse['Click']('400',['TokenErrorButton'],False,True,True)],None
    except Exception as e:
        print('Erro Ao Decodificar Token',e)
        return None,[BuildResponse['Click']('400',['TokenErrorButton'],False,True,True)],None
    




def build_data_token(userid:str,Type:str):
   
   try:
   
    regist = DatabaseQueryActions['Select'](Method='One',Table='Usuarios',Where='email',WhereCondition=userid)

    id = regist.id

    if regist.id:
       
       data_token = {
          'sub':str(id),
          'type':Type,
          'iat': datetime.utcnow()
       }

       return data_token , regist.id
    else:
       print('nenhum registro encontrado')
       return None,None   
   except Exception as e:
      print('Erro Ao Buildar DataToken',e)
      return None,None
      



def VerifyUserToken(request : Request):
   
   try:
   
    token = request.headers.get('Authorization')

    if token and token.startswith("Bearer "):

       token = token.split(" ")[1]      
       payload , response,NewToken  = verify_access_token(token=token)
 
       return payload , response, NewToken
      
    else: 
       print('Token De Usuario Inválido')
       return None, [BuildResponse['Click']('400',['TokenErrorButton'],False,True,True)],None
       
   except Exception as e:
      print('Erro Ao Verificar Token Do Usuario:',e)   
      return None, None,None