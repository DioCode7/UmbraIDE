from fastapi import APIRouter, Request
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from DatabaseConnect import DatabaseQueryActions,VerifyExist,CloudUpload
from Security import AuthResponses,BuildResponse,AuthFalseBuildResponses
import uuid
from Auth import VerifyUserToken


 
ResponsesCenter = {
    'ComunityType':{
        'code':{
            '200':['Click','200',['ComunityTypeDiv_Next0'],False,False,True],
            '400':['ShowInterface','400','Inline','InvalidComunityType','CheckBoxComunityType','ObjPosComboBoxType'],
              '500':['ShowInterface','500','PopUp','InternalServer','None']
            
        },
        'BuildType':'ShowInterface'
    },
    'ComunityFocus':{
        'code':{
            '200':['Click','200',['ComunityFocusDiv_Next2'],False,False,True],
            '400':['ShowInterface','400','Inline','InvalidComunityFocus','ComunityComboBoxFocus','ObjPosComboBoxFocus'],
              '500':['ShowInterface','500','PopUp','InternalServer','None']

        },
        'BuildType':'ShowInterface'
    },
    'ComunityName':{
     'code':{
         '200':['Click','200',['ComunityStatsDiv_Next1'],False,False,True],
            '401':['ShowInterface','400','Inline','ComunityNameInUse','ComunityInputName'],
            '402':['ShowInterface','400','Inline','ComunityNameMaxLength','ComunityInputName'],
            '400':['ShowInterface','400','Inline','ComunityNameMinLength','ComunityInputName'],
            '500':['ShowInterface','500','PopUp','InternalServer','None']
             
     },
     'BuildType':'ShowInterface'
    },
    'ComunityDesc':{
        'code':{
              '200':['Click','200',['ComunityStatsDiv_Next1'],False,False,True],
              '400':['ShowInterface','400','Inline','ComunityDescMaxLength','ComunityInputDesc']
        },
    },
    'ComunityLogo':{
        'code':{
            '200':['Click','200',['ComunityLogoSetDiv_Next3'],False,False,True],
            '400':['ShowInterface','400','Inline','ComunityLogoInvalid','ComunityCamIcon','ObjPosLogoComunity'],
        }
    },
    'ComunityEntry':{
        'code':{
            '200':[''],
            '400':['ShowInterface','400','Inline','ComunityEntryInvalid','ComunityEntryComboBox','ObjPosComunityEntry'],
            
        }
    },
      'ComunityVisibility':{
        'code':{
            '200':[''],
            '400':['ShowInterface','400','Inline','ComunityVisibilityInvalid','ComunityVisibilityComboBox','ObjPosComunityVisibility'],
            
        }
    },
      'ComunitySocialMedia':{
        'code':{
            '200':[''],
            '400':['ShowInterface','400','Inline','ComunitySocialMediaInvalid','ComunitySocialMediaSwitch','ObjPosComunitySocialMedia'],
            
        }
    }
}


router = APIRouter(
    prefix="/ComunityRoutes",
    tags=['ComunityRoutes'],
)




def VerifyComunityType(TypeStr) ->tuple[bool,list]:
     try:
       if TypeStr == 'Group' or TypeStr == 'Company':
          print('Comunidade Verificada')
          return True,[TypeStr,'200']
       else:
           print('Tipo De Comunidade Inválido:',TypeStr)
           return False,['Tipo De Comunidade Inválida','400']
     except Exception as e:
         print('Erro Ao Verificar Comunidade')
         return False, ['Erro Ao Verificar Comunidade','500']
     

def VerifyComunityName(Name,Type) -> tuple[bool,list]:

    try:

        NameLength = len(Name)

        if NameLength < 3:
            print('Nome da comunidade invalidado por length menor')
            return False, ['Invalid Name, Length Minimun is 3','400']
        if NameLength > 16:
            print('Nome da comunidade invalidado por length maior')
            return False, ['Invalid Name, Length Maximum is 16','402']
        
        if Type == 'Company':
            result = VerifyExist(Table='ComunityRegist',Values=[("comunityname","==",Name),("comunitytype","==",Type)])

            if result is True :
                print('Comunity Name Valid!!')
                return True,['Comunity Name Valid','200']
            else:
                print('Comunity Name alredy exist')
                return False,['Comunity alredy exist','401']  
        elif Type == 'Group':
            print('Comunity Name Verify')
            return True,['Comunity Name Verify','200']    
            
    except Exception as e:
        print('Erro Ao Verificar Nome Da Comunidade',e)
        return False,['Server Error','500']    
    

def VerifyComunityDesc(Desc : str) -> tuple[bool,list]:

    try:
        LengthDesc = len(Desc)

        if LengthDesc > 35:
            print('Desc Invalida por muitos caracteres')
            return False,['Desc Invalid, Maximum is 35','400']

        print('Desc Validada')
        return True,['Sucess','200']      
    except Exception as e:
        print('Erro ao verificar Desc',e)
        return False,['Server Error','500']


def VerifyComunityFocus(Focus:str)->tuple[bool,list]:

    try:
       result = VerifyExist('ComunityFocusAuxiliar',[('focus','==',Focus)])
       if result is True:
           print('Focus Inválido')
           return False,['Invalid Focus','400']
       elif result is False:
           print('Focus Valid')
           return True,['Focus Valid','200']
    except Exception as e:
        print('Erro Ao Verificar Foco da comunidade',e)
        return False,['Server Error','500']      
def VerifyComunitySocialMedia(SocialMediaBool : bool)->tuple[bool,list]:

    try:
        if SocialMediaBool is True or SocialMediaBool is False: 
            print('Social Media Bool Verify')
            return True,['Social Media Bool Verify','200']
        else:
            print('Social Media Bool Invalid')
            return False,['Social Media Bool Invalid','400']       
    except Exception as e:
        print('Erro Ao Verificar SocialMediaBool',e)
        return False,['Server Error','500']
        
def VerifyComunityEntry(EntryType)->tuple[bool,list]:
    try:
         result = VerifyExist('ComunityConfigsAuxiliar',[('config','==',EntryType)])
         if result is True:
             print('EntryType Inválido')
             return False,['EntryType Invalid','400']
         elif result is False:
             print('EntryType Valid')
             return True,['EntryType Valid','200']
    except Exception as e:
        print('Erro Ao Verificar ComunityEntry',e)
        return False,['Server Error','500']  

       
def VerifyComunityVisibility(VisibilityType)->tuple[bool,list]:
    try:
         result = VerifyExist('ComunityConfigsAuxiliar',[('config','==',VisibilityType)])
         if result is True:
             print('VisibilityType Inválido')
             return False,['VisibilityType Invalid','400']
         elif result is False:
             print('VisibilityType Valid')
             return True,['VisibilityType Valid','200']
    except Exception as e:
        print('Erro Ao Verificar ComunityVisibility',e)
        return False,['Server Error','500']    


def VerifyComunityLogo(Logo:str)->tuple[bool,list]:
    try:
        LogoVerify = Logo[11:14]
        LogoVerify2 = Logo[11:15]      
        if LogoVerify.lower() == 'png' or LogoVerify.lower() == 'jpg' or LogoVerify2.lower() == 'jpeg':
            print('ComunityLogo Verificada')
            return True,['ComunityLogo Verify','200']
        else:
            print('Formato de logo errado')
            return False,['ComunityLogo Invalid','400']

    except Exception as e:
        print('Erro Ao Verificar Logo',e)
        return False,['Server Error','500']                               
    
async def VerificationComunityData(ObjVerify:dict) -> list:

    print('ObjVerify:',ObjVerify)
    print('Step:',ObjVerify['Step'])

    if ObjVerify['Step'] == 1:

        ComunityTypeBool,ComunityType = VerifyComunityType(ObjVerify['ComunityType'])

        response = ResponsesCenter['ComunityType']['code'][ComunityType[1]]

        IndiceRemove = [0]

        response_params = [valor for i,valor in enumerate(response) if i not in IndiceRemove]

        return[BuildResponse[response[0]](*response_params)]

    if ObjVerify['Step'] == 2:
        ComunityNameBool,ComunityName = VerifyComunityName(ObjVerify['ComunityName'],ObjVerify['ComunityType'])
        ComunityDescBool,ComunityDesc = VerifyComunityDesc(ObjVerify['ComunityDesc'])

        if all([ComunityDescBool,ComunityNameBool]):
           

            response = ResponsesCenter['ComunityName']['code'][ComunityName[1]]

            IndiceRemove = [0]

            response_params = [valor for i,valor in enumerate(response) if i not in IndiceRemove]

            return[BuildResponse[response[0]](*response_params)]
        else:
            response = ResponsesCenter['ComunityName']['code'][ComunityName[1]]
            IndiceRemove = [0]
            response_params = [valor for i,valor in enumerate(response) if i not in IndiceRemove]
            response2 = ResponsesCenter['ComunityDesc']['code'][ComunityDesc[1]]
            response_params2 = [valor for i,valor in enumerate(response2) if i not in IndiceRemove]
            if ComunityDesc[1] != '200' and ComunityName[1] != '200':
                return[BuildResponse[response[0]](*response_params),BuildResponse[response2[0]](*response_params2),]
            elif ComunityDesc[1] != '200' and ComunityName[1] == '200':
                  return[BuildResponse[response2[0]](*response_params2),]
            elif ComunityDesc[1] == '200' and ComunityName[1] != '200':
                return[BuildResponse[response[0]](*response_params)]


    if ObjVerify['Step'] == 3:
        ComunityFocusBool,ComunityFocus = VerifyComunityFocus(ObjVerify['ComunityFocus'])


        response = ResponsesCenter['ComunityFocus']['code'][ComunityFocus[1]]

        IndiceRemove = [0]

        response_params = [valor for i,valor in enumerate(response) if i not in IndiceRemove]

        return[BuildResponse[response[0]](*response_params)]
     
 

    if ObjVerify['Step'] == 4:
        ComunityLogoBool,ComunityLogo = VerifyComunityLogo(ObjVerify['ComunityLogo'])
        response = ResponsesCenter['ComunityLogo']['code'][ComunityLogo[1]]
        IndiceRemove = [0]
        response_params = [valor for i,valor in enumerate(response) if i not in IndiceRemove]
        return[BuildResponse[response[0]](*response_params)]



    if ObjVerify['Step'] == 5:
        ComunitySocialMediaBool,ComunitySocialMedia = VerifyComunitySocialMedia(ObjVerify['SocialMediaBool'])
        ComunityEntryBool,ComunityEntry = VerifyComunityEntry(ObjVerify['EntryType'])
        ComunityVisibilityBool,ComunityVisibility = VerifyComunityVisibility(ObjVerify['VisibilityType'])
        ComunityLogoBool,ComunityLogo = VerifyComunityLogo(ObjVerify['ComunityLogo'])
        ComunityFocusBool,ComunityFocus = VerifyComunityFocus(ObjVerify['ComunityFocus'])
        ComunityNameBool,ComunityName = VerifyComunityName(ObjVerify['ComunityName'],ObjVerify['ComunityType'])
        ComunityDescBool,ComunityDesc = VerifyComunityDesc(ObjVerify['ComunityDesc'])
        ComunityTypeBool,ComunityType = VerifyComunityType(ObjVerify['ComunityType'])

        if all([ComunityDescBool,ComunityFocusBool,ComunityLogoBool,ComunityNameBool,ComunityTypeBool]):
            print('Requisitos Anteriores Válidos')
            if all([ComunityEntryBool,ComunitySocialMediaBool,ComunityVisibilityBool]):
                   print('Wizard Concluido!')

                   comunity_id = str(uuid.uuid4())
                   comunitylogobool,comunitylogo = CloudUpload(ObjVerify['ComunityLogo'])
                   if comunitylogobool is not True:
                       return None
                   admin_id = int(ObjVerify['TokenPayLoad']['sub'])
                   comunity_focus_query = DatabaseQueryActions['Select']('One','ComunityFocusAuxiliar','focus',ObjVerify['ComunityFocus'])
                   comunity_focus = comunity_focus_query.id
                   comunity_type_query = DatabaseQueryActions['Select']('One','ComunityTypeAuxiliar','type',ObjVerify['ComunityType'])
                   comunity_type = comunity_type_query.id
                   DatabaseQueryActions['Insert']('Insert','ComunitysRegist',
                                                  {'admin_id':admin_id,
                                                   'comunityidunique':comunity_id,
                                                   'comunitytype':comunity_type,
                                                   'comunityfocus':comunity_focus,
                                                   'comunityname':ObjVerify['ComunityName'],
                                                   'comunitydesc':ObjVerify['ComunityDesc'],
                                                   'comunitylogo':comunitylogo,
                                                   
                                                
                                                   })
                   
                 
                   
                   comunity_configs_query = DatabaseQueryActions['Select']('One','ComunitysRegist','comunityidunique',comunity_id)
                   comunity_configs_id = comunity_configs_query.id

                   comunity_visibilitytype_query = comunity_configs_query = DatabaseQueryActions['Select'](
                       'One','ComunityConfigsAuxiliar','config',ObjVerify['VisibilityType'])
                   comunity_visibilitytype = comunity_visibilitytype_query.id
                   comunity_entrytype_query =  DatabaseQueryActions['Select'](
                       'One','ComunityConfigsAuxiliar','config',ObjVerify['EntryType'])
                   comunity_entrytype = comunity_entrytype_query.id
                   DatabaseQueryActions['Insert']('Insert','ComunitySettings',{
                       'comunity_id':comunity_configs_id,
                       'socialmediabool':ObjVerify['SocialMediaBool'],
                       'visibilitytype':comunity_visibilitytype,
                       'entrytype':comunity_entrytype
                   })


                   

                   return[BuildResponse['Click']('200',['ComunityMainPageButton'],False,None,True)]
            else:
                response = ResponsesCenter['ComunityEntry']['code'][ComunityEntry[1]]
                IndiceRemove = [0]
                response_params = [valor for i,valor in enumerate(response) if i not in IndiceRemove]
                response2 = ResponsesCenter['ComunityVisibility']['code'][ComunityVisibility[1]]
                response_params2 = [valor for i,valor in enumerate(response2) if i not in IndiceRemove]
                response3 = ResponsesCenter['ComunitySocialMedia']['code'][ComunitySocialMedia[1]]
                response_params3 = [valor for i,valor in enumerate(response3) if i not in IndiceRemove]

                list_codes = [ComunityEntry,ComunitySocialMedia,ComunityVisibility]
                list_responses = [response,response3,response2]
                list_params = [response_params,response_params3,response_params2]
                
               


                return AuthFalseBuildResponses(list_codes,list_responses,list_params)
        
          




        else:
            return [BuildResponse['ShowInterface']('400','PopUp','ComunityCreationError','ComunityCreationError'),
                     BuildResponse['Click']('400',['BackComunityCreateButton'],False,True,True)] 
             



@router.post('/CreateComunity')
async def CreateComunityRegister(request : Request):

    Result,Response,NewToken = VerifyUserToken(request)
    try:

        Data = await request.json()

        if Result is not None:
            Data['TokenPayLoad'] = Result
        else:
            return Response    
        response = await VerificationComunityData(Data)

        if NewToken is not None:
            response.append(Response)

        return response
    except Exception as e:
        print('Error Comunity:',e)


    