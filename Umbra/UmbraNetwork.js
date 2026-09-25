//Imports
import { UmbraCoreBrute,UmbraNexusBrute} from "./Core.js";
//Vars

export let UmbraNetwork = {
  NewRoute:AddNewRoute,
  SetBackendPath:SetBackendPath,
  
};

let UmbraListenersStorage = UmbraCoreBrute.UmbraLogic.UmbraListeners;
let LogicModule = UmbraCoreBrute.UmbraLogic.LogicModule;

//Functions

function AddNewRoute(Path,Id){
  UmbraCoreBrute.UmbraNetwork.Routes[Id] = {};
  UmbraCoreBrute.UmbraNetwork.Routes[Id].Path = Path;
};

function SetBackendPath(Path){
  UmbraCoreBrute.BackendPath = Path;
};

function ResponseProtocol(response,Fetch){
  console.warn('Backend Response',response);
  if(Array.isArray(response)){
    for(let i = 0;i<response.length;i++){
   let InnerResponse = response[i];
   let ResponseType = InnerResponse.Type;
    if(ProtocolTypes[ResponseType]){
      ProtocolTypes[ResponseType](InnerResponse);
    }
    }
      UmbraCoreBrute.UmbraLogic.UmbraFetchsManager[Fetch.Id].ProtocolsComplete = true;
  }else{
    let ResponseType = response.Type;
    if(ProtocolTypes[ResponseType]){
      ProtocolTypes[ResponseType](response);
    }
      UmbraCoreBrute.UmbraLogic.UmbraFetchsManager[Fetch.Id].ProtocolsComplete = true;
  }


}

const ProtocolTypes = {
'ExecUmbraListener':ExecUmbraListenerProtocol,
'LocalStorage':LocalStorageProtocol,
'UmbraLocalStorage':UmbraLocalStorageProtocol,
}

function ExecUmbraListenerProtocol(response){
 let Listener = UmbraListenersStorage[response.Target];
 if(Listener){
  LogicModule.UmbraVirtualMethods.Click(response.Target);
 }
};

function LocalStorageProtocol(response){
  let Key = response.Key;
  let Value = response.Value;
  console.warn('Item Value ',Value,' Key ',Key)
  if(typeof Value == 'object' ||Array.isArray(Value)){
  localStorage.setItem(Key,JSON.stringify(Value));
  }else{
     localStorage.setItem(Key,Value);
  }
};


function UmbraLocalStorageProtocol(response){
  let Key = response.Key;
  let Value = response.Value;
  console.warn('UmbraExec LocalSto')
  console.warn('Umbra Item Value ',Value,' Key ',Key)
   UmbraCoreBrute.UmbraLogic.UmbraGlobalStorage[Key] = Value;
};


export async function FetchFunction(Url, Method = "GET", Data = null, Token = null,FetchId = null) {
  if (!Url) return;
  Url = UmbraCoreBrute.BackendPath+Url;
  console.error('Url:',Url);

  const options = {
    method: Method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (Token) {
    options.headers["Authorization"] = `Bearer ${Token}`;
  }

  if (Data && Method !== "GET" && Method !== "HEAD") {
    options.body = JSON.stringify(Data);
  }

  try {
    if(FetchId){
     // FetchDispatcher(CoreDate.Paths.FetchIdsTypes[FetchId],FetchId)
     };
    const response = await fetch(Url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro no Servidor ${response.status}: ${errorText}`);
    }
    


    
    let ResponseJson = await response.json();
   
  
    return ResponseJson; 
     
  } catch (err) {
    
    console.error("Erro no fetch", err);
    throw err;
  }
}

UmbraNexusBrute.Set(["UmbraNetwork","Handlers"],{FetchFunction:FetchFunction,ResponseProtocol:ResponseProtocol});