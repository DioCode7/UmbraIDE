#imports
from sqlalchemy.orm import declarative_base,relationship
from sqlalchemy import Column, Integer, String, Boolean,Numeric, DateTime, inspect,ForeignKey,UniqueConstraint,JSON
import ServerInit
import DatabaseConnect
from DatabaseConnect import RegistConfigsDB
from datetime import datetime, timedelta
from Core import SetConfig



engine = DatabaseConnect.engine

Base = DatabaseConnect.Base

inspect = inspect

class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    email = Column(String,unique=True,nullable=False)
    password = Column(String,unique=True,nullable=True)


class UserData(Base):
    __tablename__='userdata'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer,ForeignKey('users.id', ondelete='CASCADE'),nullable=False,unique=True)
    recent_use = Column(JSON)





class EmailVerification(Base):
    __tablename__='emailverification'
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=True)
    verificationcode = Column(String, nullable=True)
    criadoem = Column(DateTime, nullable=True,default = datetime.now())
    expiraem = Column(DateTime)


class RefreshTokens(Base):
    __tablename__='refreshtokens'
    id=Column(Integer,primary_key=True)
    token=Column(String,nullable=False,unique=True)
    user_id=Column(Integer,ForeignKey('users.id', ondelete='CASCADE'),nullable=False,unique=True)
    init=Column(DateTime,nullable=False)
    expire=Column(DateTime,nullable=False)
    revoked=Column(Boolean,default=False)



    



SetConfig('Database','Tables',
          {'Usuarios':Users,'UserData':UserData})

#SetConfig('Database','FixedTables',{ 'ComunityFocusAuxiliar':ComunityFocusAuxiliar,'ComunityTypeAuxiliar':ComunityTypeAuxiliar,'ComunityConfigsAuxiliar':ComunityConfigsAuxiliar,})

UsersTableModel = {
    'TableName':'users',
    'Columns':[
    {'ColumnName':'id','ColumnType':{'Type':'Integer','PrimaryKey':True}},
    {'ColumnName':'username','ColumnType':{'Type':'String','nullable':False}},
    {'ColumnName':'email','ColumnType':{'Type':'String','nullable':False,'unique':True}},
    {'ColumnName':'password','ColumnType':{'Type':'String','nullable':True,'unique':True}},
    ],
}


SetConfig('Database','NexraTables',{'Usuarios':UsersTableModel,})


