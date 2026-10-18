# Imports




#Variáveis



__CoreRoutes__ = {
    'Routes':{
      'Security':{
          'Config':{
              'ResponsesConfig': {},
          }
      },
      'Database':{
         'Config':{
            'Tables':{},
            'DatabaseUrl':'',
            'InsertDicts':'',
            'FixedTables':{},
            'NexraTables':{}
         }
      }
    }
}


def SetConfig(Route : str,Config: str, ObjConfig : dict):

    try:

     __CoreRoutes__['Routes'][Route]['Config'][Config] = ObjConfig
     return {'Status':'Config Salva Com Sucesso'}

    except Exception as e:
       return {'Erro Ao Enviar Configuração:',e, 'Cod:',1}  



#Funções