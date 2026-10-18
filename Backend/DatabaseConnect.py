from sqlalchemy import create_engine, and_,or_,text,inspect
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import Column, Integer, String, Boolean, DateTime, inspect,select,update
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from Core import __CoreRoutes__
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import cloudinary
import cloudinary.uploader
import cloudinary.api

ph = PasswordHasher()




engine = ''
session = ''
SessionLocal = ''
Base = declarative_base()


CLOUDNARYKEY = os.getenv('CLOUDNARYKEY')
CLOUDNARYSECRET = os.getenv('CLOUDNARYSECRET')
CLOUDNARYNAME = os.getenv('CLOUDNARYNAME')

cloudinary.config(
   cloud_name = CLOUDNARYNAME,
   api_key = CLOUDNARYKEY,
   api_secret = CLOUDNARYSECRET,
   secure=True
)

def CloudUpload(Base64 :str):
   try:
      if Base64:
         print(Base64[:100]) 
         result = cloudinary.uploader.upload(Base64)
         print('Upload realizado com sucesso')
         return True,result['secure_url']
   except Exception as e:
         print('Erro ao fazer upload para a nuvem',e)
         return False,None



def InitDB():
    DATABASE_URL = __CoreRoutes__['Routes']['Database']['Config']['DatabaseUrl']

    if not DATABASE_URL:
        raise ValueError("DATABASE_URL não foi definido antes de chamar InitDB")

    global engine, session, SessionLocal

    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        echo=False
    )

    

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    #with engine.begin() as conn:
      # conn.execute(text(f'DROP TABLE itens CASCADE'))
       #conn.execute(text(f'DROP TABLE movestable CASCADE'))
       #conn.execute(text(f'DROP TABLE storagetable CASCADE'))
      
    Base.metadata.create_all(bind=engine)
    TestPassword = ph.hash("NexraTest")

    UpdateTables(engine)

    
    result = DatabaseQueryActions["Select"](Method='All', Table='Usuarios')

  

           
   
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    print("Tabelas no banco:", tables)
    for prop in result:
      print ('Tetsteeee',prop.id,prop.username,prop.email,prop.accesskey);




def RegistConfigsDB():
   try:

      Tables = __CoreRoutes__['Routes']['Database']['Config']['FixedTables']

      RegistDicts = __CoreRoutes__['Routes']['Database']['Config']['InsertDicts']

      print('FixedTables:',Tables)

   
      if isinstance(Tables,dict):

      
         if isinstance(RegistDicts,list):
           
            for Dict in RegistDicts:

               Table = Tables.get(Dict['Table'])
               print('Selected Table:',Table)
               RealTable = __CoreRoutes__['Routes']['Database']['Config']['Tables'].get(Table)
               
               DictList = Dict['Dict']
               with SessionLocal() as session:
                  count = session.query(Table).count()
                  if count == 0:
                     for Value in DictList:
                        DatabaseQueryActions['Insert']('Insert',Dict['Table'],Value)
                        print('Fixed Tables Registradas')
                  result = DatabaseQueryActions['Select']('All',Dict['Table'])
           
               
   except Exception as e:
      print('Erro Ao Inserir Dados nas tabelas fixas',e)

             

      



  
def UpdateOnDatabase(Method : str,Table:str,Fields:list,Values:dict):
   RealTable = __CoreRoutes__['Routes']['Database']['Config']['Tables'].get(Table)
    
   func = UpdateMethods.get(Method)

   if func:
      return func(RealTable,Fields,Values)
   else:
      print('Metodo de Update Invalido')


def UpdateWhereFunction(Table:str,Fields:list,Values:dict):

   try:

      with SessionLocal() as session:
         smtm = update(Table)

         Conditions = []

         for Field,Operator,Value in Fields:
            Collumn = getattr(Table,Field)

            if Operator == '==':
               
               Conditions.append(Collumn == Value)
            elif Operator == '>=':
               Conditions.append(Collumn >= Value) 
            elif Operator == '<=':
               Conditions.append(Collumn <= Value)
            elif Operator == '!=':
               Conditions.append(Collumn != Value)
            elif Operator == '>':
               Conditions.append(Collumn > Value)
            elif Operator == '<':
               Conditions.append(Collumn < Value)

         smtm = smtm.where(and_(*Conditions))

         smtm = smtm.values(**Values)

         session.execute(smtm)
         session.commit()
         print('UpdateWhere Executado')

         return True
   except Exception as e:
      print('Erro ao UpdateWhere: ',e)
      return False






def InsertOnDataBase(Method : str,Table: str,Values: dict, Where=None,IndexConflict= None):
   
   RealTable = __CoreRoutes__['Routes']['Database']['Config']['Tables'].get(Table)
    
   func = InsertMethods.get(Method)

   if func:
      return func(RealTable,Values, Where,IndexConflict)

   else:
      print('Metodo de Insert Invalido')




def InsertFunction(Table,Values: dict,Where= None,IndexConflict = None):
   
  
     try:
      with SessionLocal() as Session:
        obj = Table(**Values)
        Session.add(obj)
        Session.commit()
        Session.refresh(obj)
 
        return obj

     except Exception as e:
       print('Erro ao executar insert: ',e)


def UpsertFunction(Table,Values: dict,Where=None,IndexConflict=None):
   try:
      with SessionLocal() as Session:
         cursor = insert(Table).values(Values)

         cursor = cursor.on_conflict_do_update(
            index_elements = [IndexConflict],
            set_ = {Key: cursor.excluded[Key] for Key in Values.keys()} 
         )

         Session.execute(cursor)
         Session.commit()

         result = DatabaseQueryActions["Select"](Method='All', Table='RefreshTokens')
         return None
        # for user in result :

           #print("Select depois do insert:", user.id, user.user_id, user.token)
   except Exception as e:
      print('Erro Ao usar Upsert: ',e)     
         

def SelectFromDataBase(Method:str,Table:str,Where=None,WhereCondition=None):
   
   try:
      
      realtable = __CoreRoutes__['Routes']['Database']['Config']['Tables'].get(Table)

      method = SelectMethods.get(Method)

      if method:
        result = method(realtable,Where,WhereCondition)
        return result
      else:
         print('Erro ao executar o metodo select')
   except Exception as e:
      print('Erro Ao Executar Select')         

   
def SelectAllFunction(Table:str,Where = None,WhereCondition = None):  

    try:

      with SessionLocal() as session:
         
         cursor = session.execute(select(Table))

         result = cursor.scalars().all()

         

         return result

    except Exception as e: 
       print('Select All Error:', e)   
       return 'Erro ao usar Select'
 


def SelectOneFunction(Table:str,Where:str,WhereCondition:str):
   
   try:
      
      column = getattr(Table,Where)
      
      with SessionLocal() as session:
         
         cursor = session.execute(select(Table).where(column == WhereCondition))

         result = cursor.scalar_one_or_none()

         return result
   except Exception as e:
      print('Select One Error:',e)     
      return 'Erro ao usar Select'
   
def UmbraSelectOneFunction(Table, Where,WhereCondition):

    try:

        with SessionLocal() as session:

            stmt = select(Table)

            Conditions = []

            for Field, Operator, Value in Where:

                Column = getattr(Table, Field)

                if Operator == '==':
                    Conditions.append(Column == Value)

                elif Operator == '>=':
                    Conditions.append(Column >= Value)

                elif Operator == '<=':
                    Conditions.append(Column <= Value)

                elif Operator == '!=':
                    Conditions.append(Column != Value)

                elif Operator == '>':
                    Conditions.append(Column > Value)

                elif Operator == '<':
                    Conditions.append(Column < Value)

            stmt = stmt.where(and_(*Conditions))

            cursor = session.execute(stmt)

            return cursor.scalar_one_or_none()

    except Exception as e:

        print('Select One Error:', e)

        return None
    
   
def UmbraSelectAllFunction(Table, Where,WhereCondition):

    try:

        with SessionLocal() as session:

            stmt = select(Table)

            Conditions = []

            for Field, Operator, Value in Where:

                Column = getattr(Table, Field)

                if Operator == '==':
                    Conditions.append(Column == Value)

                elif Operator == '>=':
                    Conditions.append(Column >= Value)

                elif Operator == '<=':
                    Conditions.append(Column <= Value)

                elif Operator == '!=':
                    Conditions.append(Column != Value)

                elif Operator == '>':
                    Conditions.append(Column > Value)

                elif Operator == '<':
                    Conditions.append(Column < Value)

            stmt = stmt.where(and_(*Conditions))

            cursor = session.execute(stmt)

            return cursor.scalars().all()

    except Exception as e:

        print('Select One Error:', e)

        return None

def SelectAllWhereFunction(Table:str,Where:str,WhereCondition:str):
   
   try:
      
      column = getattr(Table,Where)
      
      with SessionLocal() as session:
         
         cursor = session.execute(select(Table).where(column == WhereCondition))

         result = cursor.scalars().all()

         return result
   except Exception as e:
      print('Select All Where Error:',e)     
      return []
   



def FilterFromDataBase(Method:str,Table:str,Values:list,Logic:str = "AND"): 
   try:

      realtable = __CoreRoutes__['Routes']['Database']['Config']['Tables'].get(Table)

      method = FilterMethods.get(Method)
      return method(realtable,Values,Logic)
   except Exception as e:
      print('Erro Ao Filtrar:', e)  
      return False 



def FilterOneFunction(Table:str,Values:list,Logic : str):

   try:
     

     Conditions = []

     for field, operator,value in Values:
        
        Column = getattr(Table,field)
        
        if operator == '==':
           Conditions.append(Column == value)
        elif operator == '<=':
           Conditions.append(Column <= value)
        elif operator == '>=':
           Conditions.append(Column >= value)   
        elif operator == '!=':
           Conditions.append(Column != value)   
        elif operator == '<':
           Conditions.append(Column < value)
        elif operator == '>':
           Conditions.append(Column > value)        
     
        


     with SessionLocal() as session:
        
        if Logic.upper() == "AND":
         cursor = session.query(Table).filter(and_(*Conditions))
        elif Logic.upper() == "OR":
         cursor = session.query(Table).filter(or_(*Conditions))
        
        print(session.query(Table).filter(and_(*Conditions)))

        print(cursor.one())
        return cursor.first()
   except Exception as e:
     print('Erro Ao Filtrar One: ',e)
     return False
    
   
def VerifyExist(Table : str,Values : list) -> bool:
  try:
      realtable = __CoreRoutes__['Routes']['Database']['Config']['Tables'].get(Table)
   
      result = DatabaseQueryActions['Filter']('One',Table,Values,'AND')

      if result:
         print('VerifyExist Alredy Exist')
         return False
   
      else:
         print('VerifyExist Not Exist')
         return True
  except Exception as e:
      print('VerifyExist Error:',e)
      return False       




def DeleteFromDatabase(Method:str,Table:str,Column:str,Where = None):

   try:
      RealTable = __CoreRoutes__['Routes']['Database']['Config']['Tables'].get(Table)
      DeleteMethods[Method](RealTable,Column,Where)
   except Exception as e:
      print('Erro Ao Deletar Do Banco',e)

def DeleteAllFromDataBase(Table:str,Column:str,Where = None):

   try:
      with SessionLocal() as session:
         session.query(Table).delete()
         session.commit()
         print('Todos Os Dados Excluidos Com Sucesso')
   except Exception as e:      
         print('Erro Ao Excluir Todos Os Dados',e)
         

DatabaseQueryActions = {

    'Insert' : InsertOnDataBase,
    'Select' : SelectFromDataBase,
    'Filter' : FilterFromDataBase,
    'Update' : UpdateOnDatabase,
    'Delete' : DeleteFromDatabase

}


InsertMethods = {
    'Insert':InsertFunction,
    'Upsert':UpsertFunction,
}

SelectMethods = {
   'All':SelectAllFunction,
   'One':SelectOneFunction,
   'AllWhere':SelectAllWhereFunction,
   'UmbraOne':UmbraSelectOneFunction,
   'UmbraAllWhere':UmbraSelectAllFunction,
}

FilterMethods = {
   'One':FilterOneFunction,
}

UpdateMethods = {
   'UpdateWhere':UpdateWhereFunction
}

DeleteMethods = {
   'All':DeleteAllFromDataBase
}

ColumnsTypes = {
   'String':'VARCHAR(255)',
   'Integer':'INTEGER',
   'Boolean':'BOOLEAN',
   'DateTime':'TIMESTAMP',
}



def NexraTablesColumnsBuildType(ColumnType):


   TypeString = f''
   TypeList = []
   

   try:
      for Key,Value in ColumnType.items():

         if Key == 'Type':

            Type = ColumnsTypes[Value]
            TypeList.append(Type)
         if Key == 'ForeignKey':
            ForeignKey = f'REFERENCES {Value}'
            TypeList.append(ForeignKey)    
         if Key == 'unique':
            unique = f'UNIQUE'
            TypeList.append(unique)
         if Key == 'nullable':
            nullable = f'NOT NULL'
            TypeList.append(nullable)
         if Key == 'default':
            nullable = f'DEFAULT {Value}'
            TypeList.append(nullable)      
   
      
      TypeString = ' '.join(TypeList)
      print('NexraSQL:TypeString:',TypeString)
      return TypeString
   except Exception as e:
      print('NexraSQL:Erro Ao Buildar Tipo De Coluna:',e)
      return None






def UpdateTables(Engine):

   try:
      with Engine.begin() as conn:

         NexraTables = __CoreRoutes__['Routes']['Database']['Config']['NexraTables']

         #conn.execute(text(f"ALTER TABLE comunitysregist DROP COLUMN comunityuniqueid CASCADE"))


         for TableKey,Table in __CoreRoutes__['Routes']['Database']['Config']['Tables'].items():
            print('Table:',Table)
            print('NexraTables:',NexraTables)

            

                

               
                  

            for NexraTableKey,NexraTable in NexraTables.items():
               print('NexraTable:',NexraTable)
               NexraTableName = NexraTable.get('TableName').lower()
               TableName=TableKey.lower()

               print('Nexra Table Name:',NexraTableName)
               print('Table Name:',TableName) 
               if(TableName == NexraTableName):
            
                  print('NexraSQL Table:',Table)

                  for Column in NexraTable.get('Columns'):
                     print('NexraSQL Column:',Column)
                     result = conn.execute(text(
                        """
                        SELECT column_name FROM information_schema.columns where
                        table_name = :Table and column_name = :ColumnName"""

                     ),{"Table" : NexraTableName,"ColumnName":Column.get('ColumnName')}
                     ).fetchone()

                     if result is None:
                        print(f"Adicionando Coluna '{Column}' a tabela '{Table}'")

                        
                        ColumnType = NexraTablesColumnsBuildType(Column.get('ColumnType'))

                        conn.execute(text(f"ALTER TABLE {NexraTableName} ADD COLUMN {Column.get('ColumnName')} {ColumnType};"))

                       
                     else:
                        print(f'Coluna "{Column}" ja existe na tabela "{Table}"')
                    
                  inspector = inspect(engine)
                  columns = inspector.get_columns(TableKey.lower())

                  unique_columns = set()
                  

                  for constraint in inspector.get_unique_constraints(TableKey.lower()):
                     unique_columns.update(constraint['column_names'])
                  
                  for column in columns:
                     print('Coluna Deletada Vericadadadadaaddad',column['name']);
                     ModelColumns = NexraTable.get('Columns')
                     Model = set()
                     for Col in ModelColumns:
                        Model.add(Col["ColumnName"])
                     print('Model',Model)
                     print ('Column Name',column['name'])   
                     if column['name'] not in Model:
                           conn.execute(text(f"ALTER TABLE {NexraTableName} DROP COLUMN {column['name']} CASCADE"))
                           print('Coluna Deletada',column['name'])
                     if column['name'] not in unique_columns and Col['ColumnType']['unique'] is True:
                           conn.execute(text(f"ALTER TABLE {NexraTableName} ADD CONSTRAINT uq_{NexraTableName}_{column['name']} UNIQUE ({column['name']})")) 
                     if column['name'] in unique_columns and Col['ColumnType']['unique'] is False:    
                        for const in inspector.get_unique_constraints(TableKey.lower()):   
                           if column['name'] in const['column_names']:
                              conn.execute(text(f"ALTER TABLE {NexraTableName} DROP CONSTRAINT {const['name']}")) 
   except Exception as e:
      print('NexraSQL Error:',e)            