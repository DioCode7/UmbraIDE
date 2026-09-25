//Imports
import { UmbraCoreBrute,UmbraNexusBrute} from "./Core.js";




//Variáveis
export let UmbraListeners = {
Add:AddNewUmbraListener,
Delete:DeleteUmbraListener,
Update:UpdateUmbraListener,

};

export let UmbraGlobalFunctionsCore = {
    Add:AddNewGlobalFunction,
    Delete:DeleteGlobalFunction,
    Get:GetGlobalFunction,
}


export let UmbraGlobalStorageCore = {
    Storaged:AddVarToStorage,
    Get:GetVarFromStorage,
    Delete:DeleteVarFromStorage,

};

function AddVarToStorage(Key,Value){
UmbraCoreBrute.UmbraLogic.UmbraGlobalStorage[Key] = Value;
};

function DeleteVarFromStorage(Key){
delete UmbraCoreBrute.UmbraLogic.UmbraGlobalStorage[Key];
};

function GetVarFromStorage(Key){
    console.warn('retornando:',UmbraCoreBrute.UmbraLogic.UmbraGlobalStorage[Key],'Para:',Key)
return UmbraCoreBrute.UmbraLogic.UmbraGlobalStorage[Key];
};


const UmbraViewportObserver = new IntersectionObserver((entries,UmbraViewportObserver) =>{
    entries.forEach(entry =>{
        if(entry.isIntersecting){
        UmbraViewportExecuter(entry.target.id);
       
        UmbraViewportObserver.unobserve(entry.target);
        }
    })
},{
     threshold: 0.2
})

function UmbraViewportExecuter(Id){
    let ListenerObj = UmbraCoreBrute.UmbraLogic.UmbraListeners[Id];
    if(ListenerObj.UmbraViewportLogic.Action){
        if(Array.isArray(ListenerObj.UmbraViewportLogic.Action)){
            for(let i = 0;i<ListenerObj.UmbraViewportLogic.Action.length;i++){
          if(ListenerObj.UmbraViewportLogic.Params[i]){
               ListenerObj.UmbraViewportLogic.Action[i](...ListenerObj.Params[i]);
          }else{
            ListenerObj.UmbraViewportLogic.Action[i]();
          }
        }
        }else{
            if(ListenerObj.UmbraViewportLogic.Params){
             ListenerObj.UmbraViewportLogic.Action(...ListenerObj.UmbraViewportLogic.Params);
            }else{
                ListenerObj.UmbraViewportLogic.Action();
            }
        }
    }
}


export const UmbraVirtualMethods = {
    Click:UmbraVirtualClick,
    InputSimulator:UmbraInputSimulator,
}

const BindingListeners = {
  'UmbraViewportLogic':UmbraViewportLogicRegister,
  'UmbraChange':UmbraChangeLogicRegister,
  'UmbraInput':UmbraInputLogicRegister,

};
//Funções


function CreateNewWindowLogic(WindowName){
 let Window = UmbraCoreBrute.UmbraDOM.UmbraWindows[WindowName];
 UmbraLogicCore(Window.document,Window);
};


function AddNewGlobalFunction(Id,Function){
UmbraCoreBrute.UmbraLogic.UmbraGlobalFunctions[Id] = Function;
};

function DeleteGlobalFunction(Id){
delete UmbraCoreBrute.UmbraLogic.UmbraGlobalFunctions[Id];
}

function GetGlobalFunction(Id){
return UmbraCoreBrute.UmbraLogic.UmbraGlobalFunctions[Id];
}






function AddNewUmbraListener(ListenerDOM,ListenerBluePrint,Window='Main'){

    
UmbraCoreBrute.UmbraLogic.UmbraListeners[ListenerDOM] = ListenerBluePrint;

if(typeof ListenerBluePrint == 'string'){
     if(UmbraCoreBrute.UmbraLogic.ListenersClasses[ListenerBluePrint]){
     if(!UmbraCoreBrute.UmbraLogic.ListenersClasses[ListenerBluePrint].includes(ListenerDOM)){
    UmbraCoreBrute.UmbraLogic.ListenersClasses[ListenerBluePrint].push(ListenerDOM);
     }
    }else{
       UmbraCoreBrute.UmbraLogic.ListenersClasses[ListenerBluePrint] = []; 
  UmbraCoreBrute.UmbraLogic.ListenersClasses[ListenerBluePrint].push(ListenerDOM);
    }
  ListenerBluePrint = UmbraCoreBrute.UmbraLogic.UmbraListeners[ListenerBluePrint];
}
ListenerBluePrint.Window = Window;
if(ListenerBluePrint.ListenerMerge){
    ListenerBluePrint = UmbraCoreBrute.UmbraDOM.UiModule.UmbraMerge(ListenerBluePrint,structuredClone(UmbraCoreBrute.UmbraLogic.UmbraListeners[ListenerBluePrint.ListenerMerge]));
   UmbraCoreBrute.UmbraLogic.UmbraListeners[ListenerDOM] = ListenerBluePrint;
}
for(let Node in ListenerBluePrint){
    if(BindingListeners[Node]){
        BindingListeners[Node](ListenerDOM,ListenerBluePrint,Window);
    }
};

if(ListenerBluePrint.Turned == true){
 UmbraTurnDispatcher(ListenerDOM,ListenerBluePrint);
};

}

function UmbraViewportLogicRegister(ListenerDOM,ListenerBluePrint,Window){
 let Win = UmbraCoreBrute.UmbraDOM.UiModule.UmbraMultiWindows.Get(Window);
    UmbraViewportObserver.observe(Win.document.getElementById(ListenerDOM));

};

async function UmbraBindingChangeDispatcher(event,Id,BluePrint,Window){
    if(typeof BluePrint == 'string'){
        BluePrint = UmbraCoreBrute.UmbraLogic.UmbraListeners[BluePrint];
        if(!BluePrint){
            return;
        }
    }
  if(BluePrint.UmbraChange?.ChangeFn){
   if(BluePrint.UmbraChange.ChangeFnParams){
       BluePrint.UmbraChange.ChangeFn(...BluePrint.UmbraChange.ChangeFnParams());
   }else{
    BluePrint.UmbraChange.ChangeFn();
   }
  }

  if(BluePrint.UmbraChange?.ChangeFetch && !BluePrint.UmbraChange?.ChangeFetch?.Deactive){
      
    let ListenerBluePrint = BluePrint.UmbraChange.ChangeFetch;
   let route = UmbraCoreBrute.UmbraNetwork.Routes[ListenerBluePrint.Route];

    if(ListenerBluePrint.AwaitFetch){
       ListenerBluePrint.Deactive = true;
    }
        if(route){
        let response = null; 
      if(ListenerBluePrint.Data.constructor.name === "AsyncFunction"){
 response = await UmbraCoreBrute.UmbraNetwork.Handlers.FetchFunction(
    route.Path,ListenerBluePrint.Method,await ListenerBluePrint.Data());
      }else if(ListenerBluePrint.Data.constructor.name === "Function"){  
 response = await UmbraCoreBrute.UmbraNetwork.Handlers.FetchFunction(
    route.Path,ListenerBluePrint.Method,ListenerBluePrint.Data());
      }  

       if(ListenerBluePrint.AwaitFetch){
       ListenerBluePrint.Deactive = false;
    }
 if(response){
    UmbraCoreBrute.UmbraNetwork.Handlers.ResponseProtocol(response);
    
    if(ListenerBluePrint.OnSuccess){
   if(ListenerBluePrint.OnSuccess.Fn){
    if(ListenerBluePrint.OnSuccess.FnParams){

    }else{
    ListenerBluePrint.OnSuccess.Fn();
    }
   }
    }
   }else{

   }

};
  }
};


function UmbraBindingInputDispatcher(event,Id,BluePrint,Window){
  if(BluePrint.UmbraInput?.InputFn){
   if(BluePrint.UmbraInput.InputFnParams){
       BluePrint.UmbraInput.InputFn(...BluePrint.UmbraInput.InputFnParams());
   }else{
    BluePrint.UmbraInput.InputFn();
   }
  }
};

function UmbraChangeLogicRegister(ListenerDOM,ListenerBluePrint){
    UmbraCoreBrute.UmbraLogic.UmbraChangeElements[ListenerDOM] = ListenerBluePrint;
};

function UmbraInputLogicRegister(ListenerDOM,ListenerBluePrint){
    UmbraCoreBrute.UmbraLogic.UmbraInputElements[ListenerDOM] = ListenerBluePrint;
};



function DeleteUmbraListener(ListenerDOM){
delete UmbraCoreBrute.UmbraLogic.UmbraListeners[ListenerDOM];
}
function UpdateUmbraListener(ListenerDOM,ListenerBluePrint){
UmbraCoreBrute.UmbraLogic.UmbraListeners[ListenerDOM] = {...UmbraCoreBrute.UmbraLogic.UmbraListeners[ListenerDOM],...ListenerBluePrint} 
}

export function UmbraLogicCore(Window=document,Win=window){


    
    Window.addEventListener('pointerdown',(event)=>{
    let EventTargetId = event.target.id;
    let WindowName = event.target.ownerDocument.defaultView;
    for(let Win in UmbraCoreBrute.UmbraDOM.UmbraWindowsData){
        if(Win == WindowName.name){
             UmbraCoreBrute.UmbraDOM.UmbraWindowsData[Win].Opened = true;

        }else{
              UmbraCoreBrute.UmbraDOM.UmbraWindowsData[Win].Opened = false;
        }
    }
    event.target.ownerDocument.defaultView.console.warn('Window',UmbraCoreBrute.UmbraDOM.UmbraWindowsData)
    if(UmbraCoreBrute.UmbraLogic.UmbraListeners[EventTargetId]){
       UmbraVirtualDispatcher(EventTargetId,WindowName);  
    }
    });
    Window.addEventListener('mouseover',(event)=>{
     let EventTargetId = event.target.id;
      let WindowName = event.target.ownerDocument.defaultView;
    for(let Win in UmbraCoreBrute.UmbraDOM.UmbraWindowsData){
        if(Win == WindowName.name){
             UmbraCoreBrute.UmbraDOM.UmbraWindowsData[Win].Opened = true;

        }else{
              UmbraCoreBrute.UmbraDOM.UmbraWindowsData[Win].Opened = false;
        }
    }
     if(UmbraCoreBrute.UmbraLogic.UmbraListeners[EventTargetId]){
        UmbraMouseEnterDispatcher(EventTargetId,WindowName);
     }
    });
    Window.addEventListener('mouseout',(event)=>{
     let EventTargetId = event.target.id;
     
     if(UmbraCoreBrute.UmbraLogic.UmbraListeners[EventTargetId]){
        UmbraMouseOutDispatcher(EventTargetId,event,event.target.ownerDocument.defaultView);
     }
    });
   Window.addEventListener('keydown',(event)=>{
     let WindowName = event.target.ownerDocument.defaultView;
    for(let Win in UmbraCoreBrute.UmbraDOM.UmbraWindowsData){
        if(Win == WindowName.name){
             UmbraCoreBrute.UmbraDOM.UmbraWindowsData[Win].Opened = true;

        }else{
              UmbraCoreBrute.UmbraDOM.UmbraWindowsData[Win].Opened = false;
        }
    }
     UmbraKeyboardVirtualDispatcher(event,WindowName)
    });

    
  Win.addEventListener('DOMContentLoaded',(event)=>{

let WindowState = JSON.parse(Win.sessionStorage.getItem('UmbraWindowState'));
     Win.console.warn('Recarregando2')
     let UmbraCoreBruteRef = UmbraCoreBrute;
  if(WindowState.Scene && UmbraCoreBruteRef.UmbraDOM.UiModule.UmbraScenes.Verify(WindowState.Scene)){
    UmbraCoreBruteRef.UmbraDOM.UiModule.UmbraScenes.TurnOffAll(Win.name);
    Win.console.warn('Recarregando666')
   UmbraCoreBruteRef.UmbraDOM.UiModule.UmbraScenes.Active(WindowState.Scene,null,false,{Name:Win.name,Title:'oi',Favicon:''});
  }
  });

  Win.addEventListener('beforeunload',(event)=>{

  Win.sessionStorage.setItem('UmbraWindowState',JSON.stringify({
    Scene:UmbraCoreBrute.UmbraDOM.UiModule.UmbraScenes.ActualScenes(Win.name)[0],
  }));


  });


    Win.console.warn('Events',Win,Window);

    Window.addEventListener('input',(event)=>{

        let EventTargetId = event.target.id;
         let WindowName = event.target.ownerDocument.defaultView;
    for(let Win in UmbraCoreBrute.UmbraDOM.UmbraWindowsData){
        if(Win == WindowName.name){
             UmbraCoreBrute.UmbraDOM.UmbraWindowsData[Win].Opened = true;

        }else{
              UmbraCoreBrute.UmbraDOM.UmbraWindowsData[Win].Opened = false;
        }
    }
         if(UmbraCoreBrute.UmbraLogic.UmbraListeners[EventTargetId]){
         UmbraBindingInputDispatcher(event,EventTargetId,UmbraCoreBrute.UmbraLogic.UmbraListeners[EventTargetId],WindowName);
         }
        });
            Window.addEventListener('change',(event)=>{
        let EventTargetId = event.target.id;
         if(UmbraCoreBrute.UmbraLogic.UmbraListeners[EventTargetId]){
         UmbraBindingChangeDispatcher(event,EventTargetId,UmbraCoreBrute.UmbraLogic.UmbraListeners[EventTargetId],event.target.ownerDocument.defaultView);
         }
        });

        

 /*       Win.addEventListener('focus',(event)=>{
  let EventTargetId = event.target.name;
  
  if(EventTargetId){
    for(let Window in UmbraCoreBrute.UmbraDOM.UmbraWindowsData){
        event.target.console.warn('Focus',UmbraCoreBrute.UmbraDOM.UmbraWindowsData[Window].Name,EventTargetId,UmbraCoreBrute.UmbraDOM.UmbraWindowsData);
        if(String(Window) == String(EventTargetId)){
         UmbraCoreBrute.UmbraDOM.UmbraWindowsData[Window].Opened = true;
       
        }
    }
    }
        })

         Win.addEventListener('blur',(event)=>{
         let EventTargetId = event.target.name;
 if(EventTargetId){
    for(let Window in UmbraCoreBrute.UmbraDOM.UmbraWindowsData){
        if(String(Window) == String(EventTargetId)){
              event.target.console.warn('Blur',UmbraCoreBrute.UmbraDOM.UmbraWindowsData[Window].Name,EventTargetId,UmbraCoreBrute.UmbraDOM.UmbraWindowsData);
         UmbraCoreBrute.UmbraDOM.UmbraWindowsData[Window].Opened = false;
    
        }
    }
    }
               
        })
    */
}

function UmbraInputSimulator(TargetId,Window='Main'){
let Listener = UmbraCoreBrute.UmbraLogic.UmbraListeners[TargetId];
if(Listener){
    UmbraBindingInputDispatcher(null,TargetId,Listener,Window);
}
};

function UmbraKeyboardVirtualDispatcher(event,Window){
 UmbraSmartInputsResolver(event,Window.name);
};

function UmbraSmartInputsResolver(event,Window){
    let document = UmbraCoreBrute.UmbraDOM.UmbraWindows[Window];
    let ActiveElement = document.activeElement;
    if(Object.keys(UmbraCoreBrute.UmbraLogic.UmbraSmartInputs).includes(ActiveElement.id)){

let Input = document.getElementById(ActiveElement.id);
let SmartInput = ActiveElement.id;
console.error('SmartInput',Input,ActiveElement);

    if(UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[SmartInput].Prefix){
    UmbraSmartInputsPrefixResolver(event,UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[SmartInput],SmartInput);
    
}
  if(UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[SmartInput].Sufix){
    UmbraSmartInputsSufixResolver(event,UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[SmartInput],SmartInput);
    
}
 if(UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[SmartInput].Regex){
    UmbraSmartInputsRegexResolver(event,UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[SmartInput],SmartInput);
    
}
 if(UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[SmartInput].MaxCharacters){
    UmbraSmartInputsMaxCharactersResolver(event,UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[SmartInput],SmartInput);
    
}
if(UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[SmartInput].SmartComplete){
    UmbraSmartInputSmartCompleteResolver(event,UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[SmartInput],SmartInput);
    
}
}
};


let RegexNumbers = [
    '1','2','3','4','5','6','7','8','9','0',',','.',
]

let RegexNumbersSymbols=[
        '1','2','3','4','5','6','7','8','9','0',',','.','%'
]

let RegexSpecialKeys = [
    'Backspace',
    'Space',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    ','
];

function UmbraSmartInputsPrefixResolver(event,InputLogicBluePrint,InputId){
    let Input = document.getElementById(InputId);
 let InputValue = Input.value;

 if(!RegexSpecialKeys.includes(event.key)){
 if(InputValue.slice(0,InputLogicBluePrint.Prefix.length) != InputLogicBluePrint.Prefix){
    Input.value = InputLogicBluePrint.Prefix + InputValue;
 }
}

};


function UmbraSmartInputsSufixResolver(event,InputLogicBluePrint,InputId){
    let Input = document.getElementById(InputId);
 let InputValue = Input.value;

 if(InputLogicBluePrint.Regex){
    if(InputLogicBluePrint.Regex == 'Numbers'){
    if(!RegexNumbers.includes(event.key) && !RegexSpecialKeys.includes(event.key)){
       return;
    }
  }
   if(InputLogicBluePrint.Regex == 'NumbersSymbols'){
    if(!RegexNumbersSymbols.includes(event.key) && !RegexSpecialKeys.includes(event.key)){
        return;
    }
  }
 }
 if(!RegexSpecialKeys.includes(event.key)){
 if(InputValue.slice(-InputLogicBluePrint.Sufix.length,InputValue.length)
     != InputLogicBluePrint.Sufix){
    Input.value = InputValue + event.key + InputLogicBluePrint.Sufix;
    event.preventDefault();
 }
}

};


function UmbraSmartInputSmartCompleteResolver(event,InputLogicBluePrint,InputId){
    let Input = document.getElementById(InputId);
 let InputValue = Input.value;
 if(InputLogicBluePrint.MaxCharacters){
    if(InputValue.length >= InputLogicBluePrint.MaxCharacters){
        return;
    }
 }
 if(InputLogicBluePrint.SmartComplete.LengthSlice){
    if(InputValue.length >= InputLogicBluePrint.SmartComplete.LengthSlice){
        return;
    }
 }
  if(!RegexSpecialKeys.includes(event.key)){
 InputLogicBluePrint.SmartComplete.LastComplete++;
 }
 let LastComplete =  InputLogicBluePrint.SmartComplete.LastComplete;
 if(LastComplete >= InputLogicBluePrint.SmartComplete.Each && !RegexSpecialKeys.includes(event.key)){
  InputLogicBluePrint.SmartComplete.LastComplete = 0;
  let ValueStr = InputValue + event.key + InputLogicBluePrint.SmartComplete.Character;
  if(InputLogicBluePrint.MaxCharacters){
    if(ValueStr.length > InputLogicBluePrint.MaxCharacters){
        ValueStr = ValueStr.slice(0,InputLogicBluePrint.MaxCharacters);
    }
  } 
  if(InputLogicBluePrint.Regex){
  if(InputLogicBluePrint.Regex == 'Numbers' && (RegexNumbers.includes(event.key) || RegexSpecialKeys.includes(event.key))){
    Input.value = ValueStr;
  }else{
    InputLogicBluePrint.SmartComplete.LastComplete -= 1;
  }
  }else{
  Input.value = ValueStr;
  }
  event.preventDefault();
  
 }

 
   

};


function UmbraSmartInputsMaxCharactersResolver(event,InputLogicBluePrint,InputId){
    let Input = document.getElementById(InputId);
 let InputValue = Input.value;

   if(InputValue.length >= InputLogicBluePrint.MaxCharacters){
   if(!RegexSpecialKeys.includes(event.key)){
        event.preventDefault();
    }
   }
   if(InputValue.length > InputLogicBluePrint.MaxCharacters){
    Input.value = '';
   }


};




function UmbraSmartInputsRegexResolver(event,InputLogicBluePrint,InputId){
    let Input = document.getElementById(InputId);
 let InputValue = Input.value;

  if(InputLogicBluePrint.Regex == 'Numbers'){
    if(!RegexNumbers.includes(event.key) && !RegexSpecialKeys.includes(event.key)){
        event.preventDefault();
    }
  }
   if(InputLogicBluePrint.Regex == 'NumbersSymbols'){
    if(!RegexNumbersSymbols.includes(event.key) && !RegexSpecialKeys.includes(event.key)){
        event.preventDefault();
    }
  }

};

function DesactiveTurn(ListenerId,ListenerBluePrint){
      let Window = UmbraCoreBrute.UmbraDOM.UiModule.UmbraMultiWindows.GetActualWindow();
    for(let i=0;i<UmbraCoreBrute.UmbraLogic.ListenersClasses[ListenerId].length;i++){
        let Id = UmbraCoreBrute.UmbraLogic.ListenersClasses[ListenerId]?.[i];
       if(!Id){
        continue;
       }

        if(UmbraCoreBrute.UmbraDOM.Windows[Window.name].OverridesStyles[Id].Merged){
            if(Object.keys(UmbraCoreBrute.UmbraDOM.Windows[Window.name].OverridesStyles[Id].Merged).includes(Id+'Turned')){
let OverrideStyle = UmbraCoreBrute.UmbraDOM.UiModule.UmbraDismissMerge(UmbraCoreBrute.UmbraDOM.Windows[Window.name].OverridesStyles[Id],Id+'Turned');
UmbraCoreBrute.UmbraDOM.Windows[Window.name].OverridesStyles[Id] = OverrideStyle;
   UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(Id,OverrideStyle,'Overrides',false,false,Window.name);
            }else{
   UmbraCoreBrute.UmbraDOM.UiModule.UmbraDOM.ClearOverrides(Id);
     UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(Id,{},'Declared',true,false,Window.name);
            }
    }
    UmbraCoreBrute.UmbraDOM.Windows[Window.name].Blueprints[Id].Data.Active = false;
    }
}

async function UmbraTurnDispatcher(ListenerId,ListenerBluePrint){
  let Window = UmbraCoreBrute.UmbraDOM.UiModule.UmbraMultiWindows.GetActualWindow();
if(!Window.document.getElementById(ListenerId)){
    return;
}
if(ListenerBluePrint.Turn){
    if(ListenerBluePrint.TurnFlag?.() == false){
        return;
    }
    if(UmbraCoreBrute.UmbraDOM.Windows[Window.name].Blueprints[ListenerId].Data.Active == true){
        if(ListenerBluePrint.TurnedStyle){
         let OverrideStyle = 
       UmbraCoreBrute.UmbraDOM.UiModule.UmbraDismissMerge(UmbraCoreBrute.UmbraDOM.OverridesStyles[ListenerId],ListenerId+'Turned');
       UmbraCoreBrute.UmbraDOM.Windows[Window.name].OverridesStyles[ListenerId] = OverrideStyle;
       UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(ListenerId,OverrideStyle,'Overrides',false);
        }
         UmbraCoreBrute.UmbraDOM.Windows[Window.name].Blueprints[ListenerId].Data.Active = false;
    }else{
        if(ListenerBluePrint.DesactiveTurn){
          for(let i=0;i<ListenerBluePrint.DesactiveTurn.length;i++){
          
         let List = UmbraCoreBrute.UmbraLogic.UmbraListeners[ListenerBluePrint.DesactiveTurn[i]];
         
         if(List){
            
            DesactiveTurn(ListenerBluePrint.DesactiveTurn[i],List);
         }
          }
        };
        if(ListenerBluePrint.TurnedStyle){
            let OverrideStyle = 
       UmbraCoreBrute.UmbraDOM.UiModule.UmbraMerge(ListenerBluePrint.TurnedStyle,UmbraCoreBrute.UmbraDOM.Windows[Window.name].OverridesStyles[ListenerId],true,
        ListenerId+'Turned');
       UmbraCoreBrute.UmbraDOM.Windows[Window.name].OverridesStyles[ListenerId] = OverrideStyle;
       UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(ListenerId,OverrideStyle,'Overrides',false,false,Window.name);
        }
 UmbraCoreBrute.UmbraDOM.Windows[Window.name].Blueprints[ListenerId].Data.Active = true;
    }
};
if(ListenerBluePrint.TurnBinding){
    let BindingListener = UmbraCoreBrute.UmbraLogic.ListenersClasses[ListenerBluePrint.TurnBinding];
    if(BindingListener){
    for(let i = 0;i<BindingListener.length;i++){
        let actualElement = BindingListener[i];
        if(Window.document.getElementById(actualElement));
         if(UmbraCoreBrute.UmbraDOM.Windows[Window.name].Blueprints[ListenerId].Data.Active == true){
        if(ListenerBluePrint.TurnedStyle){
         let OverrideStyle = 
       UmbraCoreBrute.UmbraDOM.UiModule.UmbraDismissMerge(UmbraCoreBrute.UmbraDOM.Windows[Window.name].OverridesStyles[actualElement],actualElement+'Turned');
       UmbraCoreBrute.UmbraDOM.Windows[Window.name].OverridesStyles[actualElement] = OverrideStyle;
       UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(actualElement,OverrideStyle,'Overrides',false,false,Window.name);
        }
         UmbraCoreBrute.UmbraDOM.Blueprints[actualElement].Data.Active = false;
    }
    }
}
}

if(ListenerBluePrint.TurnBindingElement){
    TurnElementBindingResolver(ListenerBluePrint,ListenerId);
}
};

function TurnElementBindingResolver(ListenerBluePrint,ListenerId){
       let Window = UmbraCoreBrute.UmbraDOM.UiModule.UmbraMultiWindows.GetActualWindow().name;
        let actualElement = ListenerBluePrint.TurnBindingElement;
        if(UmbraCoreBrute.UmbraDOM.UiModule.UmbraMultiWindows.GetActualWindow().document.getElementById(actualElement));
         if(UmbraCoreBrute.UmbraDOM.Windows[Window].Blueprints[ListenerId].Data.Active == true){
        if(ListenerBluePrint.TurnedStyle){
         let OverrideStyle = 
       UmbraCoreBrute.UmbraDOM.UiModule.UmbraDismissMerge(UmbraCoreBrute.UmbraDOM.OverridesStyles[actualElement],actualElement+'Turned');
       UmbraCoreBrute.UmbraDOM.OverridesStyles[actualElement] = OverrideStyle;
       UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(actualElement,OverrideStyle,'Overrides',false,false,Window);
        }
         UmbraCoreBrute.UmbraDOM.Windows[Window].Blueprints[actualElement].Data.Active = false;
    }
}


function FnParamsResolver(Params,Id){
  if(typeof Params == 'string'){
    let params = UmbraGlobalFunctionsCore.Get(Params);
    return params(Id);
  }else if(typeof Params == 'function'){
    return Params(Id);
  }
};








async function UmbraVirtualDispatcher(ListenerId,Window=window){
    Window = UmbraCoreBrute.UmbraDOM.UiModule.UmbraMultiWindows.GetActualWindow();
let ListenerBluePrint = UmbraCoreBrute.UmbraLogic.UmbraListeners[ListenerId];
let ListenerDOM = ListenerId;
if(typeof ListenerBluePrint == 'string'){
    if(UmbraCoreBrute.UmbraLogic.ListenersClasses[ListenerBluePrint]){
     if(!UmbraCoreBrute.UmbraLogic.ListenersClasses[ListenerBluePrint].includes(ListenerId)){
    UmbraCoreBrute.UmbraLogic.ListenersClasses[ListenerBluePrint].push(ListenerId);
     }
    }else{
       UmbraCoreBrute.UmbraLogic.ListenersClasses[ListenerBluePrint] = []; 
  UmbraCoreBrute.UmbraLogic.ListenersClasses[ListenerBluePrint].push(ListenerId);
    }
    ListenerBluePrint = UmbraCoreBrute.UmbraLogic.UmbraListeners[ListenerBluePrint];
}

 Window = UmbraCoreBrute.UmbraDOM.UmbraWindows[Window.name];



if(ListenerBluePrint.ListenerClass){
    ListenerBluePrint = UmbraCoreBrute.UmbraDOM.UiModule.UmbraMerge(
        structuredClone(ListenerBluePrint),UmbraCoreBrute.UmbraLogic.UmbraListeners[ListenerBluePrint.ListenerClass])
}
if(ListenerBluePrint.Turn){
   UmbraTurnDispatcher(ListenerId,ListenerBluePrint);
};


if(ListenerBluePrint.UseFn == true){

    if(ListenerBluePrint.NativeFn && (ListenerBluePrint.NativeFnCondition?.() == true 
        || !ListenerBluePrint.NativeFnCondition)){
     if(Array.isArray(ListenerBluePrint.NativeFn)){
        for(let i = 0;i<ListenerBluePrint.NativeFn.length;i++){
            if(ListenerBluePrint.NativeFnParams){
                let Params = FnParamsResolver(ListenerBluePrint.NativeFnParams,ListenerId);
                if(Params){
            if(Params[i]){
             ListenerBluePrint.NativeFn[i](...Params[i]);
            }
        }
        }else{
                ListenerBluePrint.NativeFn[i]();
            }
        }
    }else{
        if(typeof ListenerBluePrint.NativeFn == 'string'){
        let Fn = UmbraGlobalFunctionsCore.Get(ListenerBluePrint.NativeFn);
        if(Fn){
          if(ListenerBluePrint.NativeFnParams){
            let Params = FnParamsResolver(ListenerBluePrint.NativeFnParams,ListenerId);
            Fn(...Params);
          }else{
            Fn();
          }
        }
        }else{
     if(ListenerBluePrint.NativeFnParams){
        ListenerBluePrint.NativeFn(...FnParamsResolver(ListenerBluePrint.NativeFnParams,ListenerId));
     }else{
        ListenerBluePrint.NativeFn();
     }
    }
}
    }
}

if(ListenerBluePrint.UseFn == true){

    if(ListenerBluePrint.Fn && (ListenerBluePrint.FnCondition?.() == true 
        || !ListenerBluePrint.FnCondition)){
     if(Array.isArray(ListenerBluePrint.Fn)){
        for(let i = 0;i<ListenerBluePrint.Fn.length;i++){
            if(ListenerBluePrint.FnParams){
                let Params = FnParamsResolver(ListenerBluePrint.FnParams,ListenerId);
                if(Params){
            if(Params[i]){
             ListenerBluePrint.Fn[i](...Params[i]);
            }
        }
        }else{
                ListenerBluePrint.Fn[i]();
            }
        }
    }else{
        if(typeof ListenerBluePrint.Fn == 'string'){
        let Fn = UmbraGlobalFunctionsCore.Get(ListenerBluePrint.Fn);
        if(Fn){
          if(ListenerBluePrint.FnParams){
            let Params = FnParamsResolver(ListenerBluePrint.FnParams,ListenerId);
            Fn(...Params);
          }else{
            Fn();
          }
        }
        }else{
     if(ListenerBluePrint.FnParams){
        ListenerBluePrint.Fn(...FnParamsResolver(ListenerBluePrint.FnParams,ListenerId));
     }else{
        ListenerBluePrint.Fn();
     }
    }
}
    }
}
if(ListenerBluePrint.UmbraFetch && !ListenerBluePrint.UmbraFetch?.Deactive){
    
    let route = UmbraCoreBrute.UmbraNetwork.Routes[ListenerBluePrint.UmbraFetch.Route];
   
    if(ListenerBluePrint.UmbraFetch.AwaitFetch){
       ListenerBluePrint.UmbraFetch.Deactive = true;
    }

        if(route){

            UmbraCoreBrute.UmbraLogic.UmbraFetchsManager[ListenerBluePrint.UmbraFetch.Id] = {};
            UmbraCoreBrute.UmbraLogic.UmbraFetchsManager[ListenerBluePrint.UmbraFetch.Id].ProtocolsComplete = false;
        let response = null; 
      if(ListenerBluePrint.UmbraFetch.Data.constructor.name === "AsyncFunction"){
 response = await UmbraCoreBrute.UmbraNetwork.Handlers.FetchFunction(
    route.Path,ListenerBluePrint.UmbraFetch.Method,await ListenerBluePrint.UmbraFetch.Data());
      }else if(ListenerBluePrint.UmbraFetch.Data.constructor.name === "Function"){  
 response = await UmbraCoreBrute.UmbraNetwork.Handlers.FetchFunction(
    route.Path,ListenerBluePrint.UmbraFetch.Method,ListenerBluePrint.UmbraFetch.Data());
      }else if(typeof ListenerBluePrint.UmbraFetch.Data == 'string'){
        let fn = UmbraGlobalFunctionsCore.Get(ListenerBluePrint.UmbraFetch.Data);
         if(fn.constructor.name === "AsyncFunction"){
 response = await UmbraCoreBrute.UmbraNetwork.Handlers.FetchFunction(
    route.Path,ListenerBluePrint.UmbraFetch.Method,await fn());
      }else if(fn.constructor.name === "Function"){  
 response = await UmbraCoreBrute.UmbraNetwork.Handlers.FetchFunction(
    route.Path,ListenerBluePrint.UmbraFetch.Method,fn());
      }
      }  

       if(ListenerBluePrint.UmbraFetch.AwaitFetch){
       ListenerBluePrint.UmbraFetch.Deactive = false;
    }
 if(response){
    UmbraCoreBrute.UmbraNetwork.Handlers.ResponseProtocol(response,ListenerBluePrint.UmbraFetch);
    
    if(ListenerBluePrint.UmbraFetch.OnSuccess){
        let FetchManager = UmbraCoreBrute.UmbraLogic.UmbraFetchsManager[ListenerBluePrint.UmbraFetch.Id];
       await AwaitFlag(()=>FetchManager.ProtocolsComplete);
   if(ListenerBluePrint.UmbraFetch.OnSuccess.Fn){

    if(typeof ListenerBluePrint.UmbraFetch.OnSuccess.Fn == 'string'){
   let fn = UmbraGlobalFunctionsCore.Get(ListenerBluePrint.UmbraFetch.OnSuccess.Fn);
    if(ListenerBluePrint.UmbraFetch.OnSuccess.FnParams){

    }else{
    
   fn();
    }

    }
    else if(typeof ListenerBluePrint.UmbraFetch.OnSuccess.Fn == 'function'){
  if(ListenerBluePrint.UmbraFetch.OnSuccess.FnParams){

    }else{
    ListenerBluePrint.UmbraFetch.OnSuccess.Fn();
    }
    };
  
   }
    }
   }else{

   }

};
};
if(ListenerBluePrint.SceneTransition){
    let OldScene = ListenerBluePrint.SceneTransition.OldScene;
    let NewScene = ListenerBluePrint.SceneTransition.NewScene;
    let TransitionAnimation = ListenerBluePrint.SceneTransition.TransitionAnimation;
    let TransitionElement = ListenerBluePrint.SceneTransition.TransitionElement;
    let TransitionEntryAnimations = ListenerBluePrint.SceneTransition.OnEntryAnimations;

    UmbraCoreBrute.UmbraDOM.UiModule.UmbraScenes.Transition(OldScene,NewScene,TransitionAnimation,TransitionElement,null,TransitionEntryAnimations);
}
}

function UmbraVirtualClick(VirtualElementId,Class=false){
    if(UmbraCoreBrute.UmbraLogic.UmbraListeners[VirtualElementId]){
        if(!Class){
        UmbraVirtualDispatcher(VirtualElementId);
        }else{
            for(let i=0;i<UmbraCoreBrute.UmbraLogic.ListenersClasses[VirtualElementId].length;i++){
             UmbraVirtualDispatcher(UmbraCoreBrute.UmbraLogic.ListenersClasses[VirtualElementId][i]);
            };
        }
    }else{
        console.warn("Umbra Warn:",VirtualElementId," Is not a valid listener");
    }

}

function UmbraMouseEnterDispatcher(ElementId,Window){
    Window = UmbraCoreBrute.UmbraDOM.UiModule.UmbraMultiWindows.GetActualWindow();
let ListenerBluePrint = UmbraCoreBrute.UmbraLogic.UmbraListeners[ElementId];
if(typeof ListenerBluePrint == 'string'){
    ListenerBluePrint = UmbraCoreBrute.UmbraLogic.UmbraListeners[ListenerBluePrint];
}
if(ListenerBluePrint.UmbraHover){
    if(ListenerBluePrint.UmbraHover.Style){
let Style = UmbraCoreBrute.UmbraDOM.UiModule.UmbraMerge( ListenerBluePrint.UmbraHover.Style,UmbraCoreBrute.UmbraDOM.Windows[Window.name].OverridesStyles[ElementId]
   ,true,ElementId+'Hover');
UmbraCoreBrute.UmbraDOM.Windows[Window.name].OverridesStyles[ElementId] = Style;
UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(ElementId,Style,'Overrides',false,false,Window.name);
    }
    if(ListenerBluePrint.UmbraHover.On){
        if(ListenerBluePrint.UmbraHover.On.Fn){
            if(ListenerBluePrint.UmbraHover.On.FnParams){
               ListenerBluePrint.UmbraHover.On.Fn(...ListenerBluePrint.UmbraHover.On.FnParams()); 
            }else{
      ListenerBluePrint.UmbraHover.On.Fn();
            }
        }
    }
};

}
function UmbraMouseOutDispatcher(ElementId,event,Window){
        Window = UmbraCoreBrute.UmbraDOM.UiModule.UmbraMultiWindows.GetActualWindow();
let ListenerBluePrint = UmbraCoreBrute.UmbraLogic.UmbraListeners[ElementId];
if(typeof ListenerBluePrint == 'string'){
    ListenerBluePrint = UmbraCoreBrute.UmbraLogic.UmbraListeners[ListenerBluePrint];
}


if(ListenerBluePrint.UmbraHover){
    if(ListenerBluePrint.UmbraHover.Style){
  let DismissMerge = UmbraCoreBrute.UmbraDOM.UiModule.UmbraDismissMerge(UmbraCoreBrute.UmbraDOM.OverridesStyles[ElementId],ElementId+'Hover');
     UmbraCoreBrute.UmbraDOM.Windows[Window.name].OverridesStyles[ElementId] = DismissMerge;
 UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(ElementId, UmbraCoreBrute.UmbraDOM.Windows[Window.name].DeclaredStyles[ElementId],'Declared',true,false,Window.name);
    }


        if(ListenerBluePrint.UmbraHover.Out){
            if(ListenerBluePrint.UmbraHover.Out.LinkOut){
                let elements = UmbraCoreBrute.UmbraLogic.ListenersClasses[ListenerBluePrint.UmbraHover.Out.LinkOut];
                for(let i = 0;i<elements.length;i++){
                UmbraMouseOutDispatcher(elements[i],event,Window);
            }
        }
         let AllChilds = UmbraCoreBrute.UmbraDOM.UiModule.UmbraDOM.GetAllChilds(ElementId);
         if((!AllChilds.includes(event.relatedTarget.id) && event.relatedTarget.id != ElementId) || !ListenerBluePrint.UmbraHover.Out.OnChilds){
        if(ListenerBluePrint.UmbraHover.Out.Fn){
            if(ListenerBluePrint.UmbraHover.Out.FnParams){
               ListenerBluePrint.UmbraHover.Out.Fn(...ListenerBluePrint.UmbraHover.Out.FnParams()); 
            }else{
      ListenerBluePrint.UmbraHover.Out.Fn();
            }
        }
    }
}
};

}



export async function AwaitFlag(Flag){

   return new Promise(resolve =>{

   let interval = setInterval(() => {
    console.error('Flag:',Flag(),);
    if(Flag()){
     clearInterval(interval);
     resolve();

    }
    
   },10);

   });



}

export function DisplayImageOnDiv(InputFile,DivDisplay,Window='Main'){

   let document = UmbraCoreBrute.UmbraDOM.UiModule.UmbraMultiWindows.Get(Window).document;
  const InputFileDOM = document.getElementById(InputFile);
  const DivDisplayDOM = document.getElementById(DivDisplay);

  const File = InputFileDOM.files[0];
  if (!File) return; 

  const Reader = new FileReader();

  Reader.onload = e => {
    DivDisplayDOM.style.backgroundImage = `url("${e.target.result}")`;
    DivDisplayDOM.style.backgroundSize = 'contain';      
    DivDisplayDOM.style.backgroundPosition = 'center';
  };

  Reader.readAsDataURL(File);
  
};

export async function GetUploadFile(InputFile){
  const input = document.getElementById(InputFile);
  const file = input.files[0];
  console.warn('Fileeeee',file);
  if (!file) return null;

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });


  
}


UmbraLogicCore(document,window);
UmbraNexusBrute.Set(['UmbraLogic','LogicModule'],{UmbraListeners:UmbraListeners,UmbraLogicCore:UmbraLogicCore,UmbraAwaitFlag:AwaitFlag,
    UmbraVirtualMethods:UmbraVirtualMethods,GetUploadFile:GetUploadFile,DisplayImageOnDiv:DisplayImageOnDiv,UmbraTurnDispatcher:UmbraTurnDispatcher,
UmbraGlobalStorage:UmbraGlobalStorageCore});
