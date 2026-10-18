# imports

from pydantic import BaseModel, EmailStr,create_model

class EmailSchema(BaseModel):
      Email:EmailStr
      Senha:str
      SenhaConfirm:str
      UserName:str


def CreateModel(Name,Dict):
    class Name:
            Dict

    return Name        
        