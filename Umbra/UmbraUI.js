//Imports

import { UmbraCoreBrute, UmbraNexusBrute } from "./Core.js";
import { UmbraWindows } from "./Umbra.js";
import { AwaitFlag} from "./UmbraLogic.js";

//Variáveis

let UmbraUI = UmbraCoreBrute.UmbraDOM.UiModule;
let UmbraListenersStorage = UmbraCoreBrute.UmbraLogic.UmbraListeners;
let UmbraBlueprintsStorage = UmbraCoreBrute.UmbraDOM.BluePrints;
let UmbraPresetsStorage = UmbraCoreBrute.UmbraDOM.UmbraPresets;
let UmbraClassesStorage = UmbraCoreBrute.UmbraDOM.UmbraClasses;
let UmbraDeclaredStylesStorage = UmbraCoreBrute.UmbraDOM.DeclaredStyles;
let UmbraOverridesStorage = UmbraCoreBrute.UmbraDOM.OverridesStyles;

//Funções
export let UmbraReactiveTextCore = {
Add:AddReactiveText,
Delete:DeleteReactiveText,
Get:GetReactiveText,
};

export let UmbraMultiWindows = {
    Get:GetWindow,
    Create:UmbraNewWindow,
    GetActualWindow:GetActualWindow,
    Exist:WindowExistCheck,

}

export let UmbraPopUpsControl={
 Add:AddUmbraPopUp,
 Active:ActiveUmbraPopUp,
 Disable:DisableUmbraPopUp,
 Delete:DeleteUmbraPopUp,
};

export let UmbraOverlaysControl = {
    Active:ActiveUmbraOverlay,
    Delete:DeleteUmbraOverlay,
    Add:AddUmbraOverlay,
    Disable:DisableUmbraOverlay,
}

export let UmbraPresetsCore = {
 Create:UmbraCreatePreset,
 Delete:UmbraDeletePreset,


};

export let UmbraClassesCore = {
 Create:UmbraCreateClass,
 Delete:UmbraDeleteClass,


};

export let UmbraAnimationsCore = {
    New:UmbraNewAnimation,
    Delete:UmbraDeleteAnimation,
    TurnOff:UmbraTurnOffAnimation,
    Active:UmbraActiveAnimation,
    GroupActive:UmbraGroupAnimationsActive,
}


export let UmbraScenesBrute = {
    New:UmbraNewScene,
    Active:ActiveUmbraScene,
    Verify:VerifyUmbraScene,
    TurnOff:TurnOfUmbraScene,
    TurnOffAll:TurnOffAllUmbraScene,
    Delete:DeleteUmbraScene,
    Transition:TransitionUmbraScene,
    ActualScenes:CheckActualScenes,

};

export let UmbraDOM = {
  Delete:UmbraDeleteComponenent,
  ClearChilds:UmbraClearChilds,
  GetChilds:UmbraGetChilds,
  GetAllChilds:UmbraGetAllChilds,
  ClearOverrides:UmbraClearOverrides,
  UpdateActiveDOM:UmbraUpdateActiveDOM,
  GetParent:UmbraGetParent

};


function AddUmbraOverlay(Id,BluePrint){
UmbraCoreBrute.UmbraDOM.UmbraOverlays[Id] = BluePrint;
};

async function DisableUmbraOverlay(Id){
let Overlay = UmbraCoreBrute.UmbraDOM.UmbraOverlays[Id];
if(Overlay){
    let Animation = null;
    if(Overlay.LeaveAnimation){
     UmbraActiveAnimation(Overlay.LeaveAnimation,Overlay.Overlay.Id);
 Animation = UmbraCoreBrute.UmbraDOM.AnimationsNexus[Overlay.LeaveAnimation];
    }
   
    if(Animation){
   await UmbraCoreBrute.UmbraLogic.LogicModule.UmbraAwaitFlag(()=>UmbraCoreBrute.UmbraDOM.AnimationsFlags[Animation.AwaitFlag]);
    }
   UmbraDOM.Delete(Overlay.Overlay.Id);
}
};

function DeleteUmbraOverlay(Id){
delete UmbraCoreBrute.UmbraDOM.UmbraOverlays[Id];
};

function ActiveUmbraOverlay(Id){
    let document = GetActualWindow().document;
let Continue = OverlayRender(Id);
if(Continue){
 let BluePrint = UmbraCoreBrute.UmbraDOM.UmbraOverlays[Id];
if(BluePrint.EntryAnimation){
    UmbraAnimationsCore.Active(BluePrint.EntryAnimation,BluePrint.Overlay.Id);
}
if(BluePrint.Includes){
    for(let i = 0;i<BluePrint.Includes.length;i++){
 document.getElementById(BluePrint.Overlay.Id).appendChild(document.getElementById(BluePrint.Includes[i]));
    }
};
}
};

function OverlayRender(Id){
    let BluePrint = UmbraCoreBrute.UmbraDOM.UmbraOverlays[Id];
    if(BluePrint){
     if(BluePrint.Overlay){
       UmbraMainRender(UmbraScenesBrute.ActualScenes()[0]+'Container',{Overlay:BluePrint.Overlay});
        return true;
     };
    }
    return false;
};

function AddUmbraPopUp(Id,BluePrint){
UmbraCoreBrute.UmbraDOM.UmbraPopUps[Id] = BluePrint;
};

function DeleteUmbraPopUp(Id){
delete UmbraCoreBrute.UmbraDOM.UmbraPopUps[Id];
};

async function DisableUmbraPopUp(Id){
let PopUp = UmbraCoreBrute.UmbraDOM.UmbraPopUps[Id];
if(PopUp){
    let Animation = null;
    if(PopUp.LeaveAnimation){
     UmbraActiveAnimation(PopUp.LeaveAnimation,PopUp.PopUp.Id);
 Animation = UmbraCoreBrute.UmbraDOM.AnimationsNexus[PopUp.LeaveAnimation];
    };
  
    if(Animation){
   await UmbraCoreBrute.UmbraLogic.LogicModule.UmbraAwaitFlag(()=>UmbraCoreBrute.UmbraDOM.AnimationsFlags[Animation.AwaitFlag]);
    };
   UmbraDOM.Delete(PopUp.PopUp.Id);
    if(PopUp.Overlay){
    DisableUmbraOverlay(Id+'Overlay');
   };
   
}
};

function ActiveUmbraPopUp(Id){
let Continue = RenderPopUp(Id);
if(Continue){
let PopUp =  UmbraCoreBrute.UmbraDOM.UmbraPopUps[Id];
if(PopUp.EntryAnimation){
    UmbraAnimationsCore.Active(PopUp.EntryAnimation,PopUp.PopUp.Id);
}
if(PopUp.Overlay){
    let Overlay = {
   
       ...PopUp.Overlay,
    Includes:[PopUp.PopUp.Id],
    };
    UmbraOverlaysControl.Add(Id+'Overlay',Overlay);
    UmbraOverlaysControl.Active(Id+'Overlay');
}
}

};


function RenderPopUp(Id){
let PopUp = UmbraCoreBrute.UmbraDOM.UmbraPopUps[Id];
if(PopUp){
if(PopUp.PopUp){
UmbraMainRender(UmbraScenesBrute.ActualScenes()[0]+'Container',{PopUp:PopUp.PopUp});

return true;
}
}
return false;
}
function AddReactiveText(Id,Text){
UmbraCoreBrute.UmbraDOM.UmbraReactiveText[Id] = Text;
}

function DeleteReactiveText(Id){
delete UmbraCoreBrute.UmbraDOM.UmbraReactiveText[Id];
}

function GetReactiveText(Id){
return UmbraCoreBrute.UmbraDOM.UmbraReactiveText[Id];
};
function UmbraGetParent(Id){
  let ParentTree =  UmbraCoreBrute.UmbraDOM.DeclaredStyles[Id].ParentTree;
 
  return ParentTree[ParentTree.length-2];

};

function UmbraCreatePreset(Id,BluePrint){
UmbraCoreBrute.UmbraDOM.UmbraPresets[Id] = BluePrint;
};

function UmbraDeletePreset(Id){
    if(UmbraCoreBrute.UmbraDOM.UmbraPresets[Id]){
        delete UmbraCoreBrute.UmbraDOM.UmbraPresets[Id];
    }
}


function UmbraCreateClass(Id,Style){
    let FinalStyle = structuredClone(Style);

    if(Style.UmbraMerge){
    for(let i = 0;i<=Style.UmbraMerge.length;i++){
        let ActualClass = Style.UmbraMerge[i];
        if(UmbraCoreBrute.UmbraDOM.UmbraClasses[ActualClass]){
            FinalStyle = UmbraMergePreset(FinalStyle,structuredClone(UmbraClassesStorage[ActualClass]),true,Id,ActualClass);
        }
    }
    }

UmbraCoreBrute.UmbraDOM.UmbraClasses[Id] = FinalStyle;
};

function UmbraDeleteClass(Id){
    if(UmbraCoreBrute.UmbraDOM.UmbraClasses[Id]){
        delete UmbraCoreBrute.UmbraDOM.UmbraClasses[Id];
    }
}

function UmbraClearChilds(Id,All = false){
    let ComponentChilds = UmbraDOM.GetChilds(Id);
    if(ComponentChilds){
     for(let i = 0;i<ComponentChilds.length;i++){
        UmbraDeleteComponenent(ComponentChilds[i],All);
     }
    }
}

function UmbraGetAllChilds(ParentId){
     let ActualTree = UmbraCoreBrute.UmbraDOM.UmbraTree;
    
  let ParentTree = UmbraCoreBrute.UmbraDOM.DeclaredStyles[ParentId].ParentTree;

  let DirectChilds = [];
  function LoopChilds(ParentId,ParentTree,ActualTree){
    if(ParentTree){
  for(let i = 0;i<ParentTree.length;i++){
    if(ParentTree[i] == ParentId){
    if(ActualTree[ParentId]){
        DirectChilds = [...DirectChilds,...Object.keys(ActualTree[ParentId])];
        if(Object.keys(ActualTree[ParentId]).length > 0){
        for(let i = 0;i<Object.keys(ActualTree[ParentId]).length;i++){
         LoopChilds(Object.keys(ActualTree[ParentId])[i],
         UmbraCoreBrute.UmbraDOM.DeclaredStyles[Object.keys(ActualTree[ParentId])[i]].ParentTree,
        UmbraCoreBrute.UmbraDOM.UmbraTree);
        };
    }
    }
    }else{
     if(ActualTree[ParentTree[i]]){
        ActualTree = ActualTree[ParentTree[i]];
     }
    }
  }
}
}
LoopChilds(ParentId,ParentTree,ActualTree);
  console.error('All Childs',DirectChilds);
    console.error('UmbraTree',UmbraCoreBrute.UmbraDOM.UmbraTree);
      console.error('ParentTree', UmbraCoreBrute.UmbraDOM.DeclaredStyles['Body']);
  return DirectChilds;
}

function UmbraGetChilds(ParentId){
  let ActualTree = UmbraCoreBrute.UmbraDOM.UmbraTree;

  let ParentTree =  UmbraCoreBrute.UmbraDOM.DeclaredStyles[ParentId]?.ParentTree;
   if(!ParentTree){
    return;
   }
  let DirectChilds = null;
  for(let i = 0;i<ParentTree.length;i++){
    if(ParentTree[i] == ParentId){
    if(ActualTree[ParentId]){
        DirectChilds = Object.keys(ActualTree[ParentId]);
    }
    }else{
     if(ActualTree[ParentTree[i]]){
        ActualTree = ActualTree[ParentTree[i]];
     }
    }
  }
    console.error('Childs:  ',ParentId,'  ',DirectChilds);
  return DirectChilds;

}


function WindowExistCheck(Id){
    let Window = UmbraWindows.Get(Id);
    if(Window){
        if(Window.closed()){
            return true;
        }
    }
    return false;
}


function UmbraDeleteComponenent(Id,RenderDelete = false,Window=GetActualWindow().name){

    let document = UmbraMultiWindows.Get(Window).document;
/*
    if(UmbraCoreBrute.UmbraDOM.DeclaredStyles[Id]?.ParentTree){
       let ParentTree = UmbraCoreBrute.UmbraDOM.DeclaredStyles[Id].ParentTree;
       let ActualTree = UmbraCoreBrute.UmbraDOM.UmbraTree;
       for(let i = 0;i<ParentTree.length;i++){
        if(ParentTree[i] == Id){
        if(ActualTree[ParentTree[i]]){
            delete ActualTree[ParentTree[i]];
        }
    }else{
        if(ActualTree[ParentTree[i]]){
            ActualTree = ActualTree[ParentTree[i]];
        }
    }
       }
    }
    */
   if(!RenderDelete){
    let ComponentChilds = UmbraDOM.GetChilds(Id);
     if(ComponentChilds){
     for(let i = 0;i<ComponentChilds.length;i++){
        UmbraDeleteComponenent(ComponentChilds[i],false,Window);
     }
    }

   

    
}
        if(document.getElementById(Id)){
        document.getElementById(Id).remove();
      
    }
    let newActiveElements = [];
   for(let i = 0;i<UmbraCoreBrute.UmbraDOM.Windows[Window].ActiveElements.length;i++){

    if(UmbraCoreBrute.UmbraDOM.Windows[Window].ActiveElements[i] != Id){

        newActiveElements.push(structuredClone(UmbraCoreBrute.UmbraDOM.Windows[Window].ActiveElements[i]));

    }

   }
   UmbraCoreBrute.UmbraDOM.Windows[Window].ActiveElements = structuredClone(newActiveElements);


}

function UmbraNewScene(SceneID,PageBind = null,ContainerStyle = null){

    UmbraCoreBrute.ScenesNexus[SceneID] = {
        Active:false,
    };

    if(ContainerStyle != null){
        UmbraCoreBrute.ScenesNexus[SceneID].ContainerStyle = ContainerStyle;
    }

    if(PageBind != null){
      UmbraCoreBrute.ScenesNexus[SceneID].PageBindBluePrint = PageBind;
    }


    

    

}

function GetActualWindow(){
 let ActualWindow = window;
 for(let Win in UmbraCoreBrute.UmbraDOM.UmbraWindowsData){
  if(UmbraCoreBrute.UmbraDOM.UmbraWindowsData[Win].Opened){
    ActualWindow = UmbraCoreBrute.UmbraDOM.UmbraWindowsData[Win].Window;
  }
 }

 return ActualWindow;
};


function CheckActualScenes(Window='Main'){
   let Scenes = UmbraCoreBrute.UmbraDOM.Windows[Window].Scenes;
   let ActiveScenes = [];
   for(let i=0;i<Scenes.length;i++){
    ActiveScenes.push(Scenes[i]);
   };
   GetActualWindow().console.warn('Scenes',ActiveScenes);
   return ActiveScenes;
};

async function TransitionUmbraScene(OldSceneId,NewSceneId,TransitionAnimation = null,TransitionElement=null,ContainerStyle = null,EntryAnimations=null){
    if(TransitionAnimation != null){
        if(!UmbraCoreBrute.UmbraDOM.AnimationsNexus[TransitionAnimation.In].AwaitFlag){
       UmbraCoreBrute.UmbraDOM.AnimationsNexus[TransitionAnimation.In].AwaitFlag =  NewSceneId+'AwaitFlagTransitionIn';;
       UmbraCoreBrute.UmbraDOM.AnimationsFlags[TransitionAnimation.In.AwaitFlag] = false;
        }
        if(TransitionElement != null){
            if(!UmbraCoreBrute.UmbraDOM.AnimationsNexus[TransitionElement.OutAnimation].AwaitFlag){
            UmbraCoreBrute.UmbraDOM.AnimationsNexus[TransitionElement.OutAnimation].AwaitFlag =  NewSceneId+'AwaitFlagTransitionOutElement';;
       UmbraCoreBrute.UmbraDOM.AnimationsFlags[TransitionElement.OutAnimation.AwaitFlag] = false;
            }
        }
         if(!UmbraCoreBrute.UmbraDOM.AnimationsNexus[TransitionAnimation.Out].AwaitFlag){
       UmbraCoreBrute.UmbraDOM.AnimationsNexus[TransitionAnimation.Out].AwaitFlag =  OldSceneId+'AwaitFlagTransitionOut';
       UmbraCoreBrute.UmbraDOM.AnimationsFlags[TransitionAnimation.Out.AwaitFlag] = false;
         }
       let InFlag =  UmbraCoreBrute.UmbraDOM.AnimationsNexus[TransitionAnimation.In].AwaitFlag;
       let OutFlag =  UmbraCoreBrute.UmbraDOM.AnimationsNexus[TransitionAnimation.Out].AwaitFlag;
       let ElementOutFlag = UmbraCoreBrute.UmbraDOM.AnimationsNexus[TransitionElement.OutAnimation].AwaitFlag;
       let AnimationTarget = OldSceneId+'Container';
       if(TransitionAnimation.NewElement){
        if(!document.getElementById(TransitionAnimation.NewElement.Id)){
       UmbraMainRender('Document',{'NewElement':TransitionAnimation.NewElement});
        }
       AnimationTarget = TransitionAnimation.NewElement.Id;
       
       }
       if(TransitionElement != null){
        if(!document.getElementById(TransitionElement.Id)){
     UmbraMainRender('Document',{'NewElement':TransitionElement});
        }
          if(TransitionElement.InAnimation){
             UmbraAnimationsCore.Active(TransitionElement.InAnimation,TransitionElement.Id);
          }
       }
       
       UmbraAnimationsCore.Active(TransitionAnimation.Out,AnimationTarget);
       await UmbraCoreBrute.UmbraLogic.LogicModule.UmbraAwaitFlag(()=>UmbraCoreBrute.UmbraDOM.AnimationsFlags[OutFlag]);   
       TurnOfUmbraScene(OldSceneId);

              UmbraCoreBrute.UmbraDOM.AnimationsFlags[TransitionAnimation.Out.AwaitFlag] = false;
        
            if(TransitionElement != null){
          if(TransitionElement.OutAnimation){
             UmbraAnimationsCore.Active(TransitionElement.OutAnimation,TransitionElement.Id);
              await UmbraCoreBrute.UmbraLogic.LogicModule.UmbraAwaitFlag(()=>UmbraCoreBrute.UmbraDOM.AnimationsFlags[ElementOutFlag]);   
            UmbraDOM.Delete(TransitionElement.Id);   

          }else{  
          UmbraDOM.Delete(TransitionElement.Id);
          }
       }
       
        UmbraAnimationsCore.Active(TransitionAnimation.In,AnimationTarget);
         ActiveUmbraScene(NewSceneId,ContainerStyle);
       await UmbraCoreBrute.UmbraLogic.LogicModule.UmbraAwaitFlag(()=>UmbraCoreBrute.UmbraDOM.AnimationsFlags[InFlag]);   
    UmbraCoreBrute.UmbraDOM.AnimationsFlags[TransitionAnimation.In.AwaitFlag] = false;
    if(EntryAnimations != null){
        EntryAnimationsFunction(EntryAnimations);
    }
     if(TransitionAnimation.NewElement){
        UmbraDOM.Delete(TransitionAnimation.NewElement.Id);
       
       }
    }else{
    TurnOfUmbraScene(OldSceneId);
    ActiveUmbraScene(NewSceneId,ContainerStyle);
    }

}

function EntryAnimationsFunction(EntryAnimations){
    
  for(let Group in EntryAnimations){
    UmbraGroupAnimationsActive(EntryAnimations[Group].Animation,EntryAnimations[Group].Elements);
  }
}

function UmbraGroupAnimationsActive(Animation,Group){
  for(let i = 0;i<Group.length;i++){
    UmbraAnimationsCore.Active(Animation,Group[i]);
  }
}



function ActiveUmbraScene(SceneID,ContainerStyle = null,Blank=false,Window={Name:GetActualWindow().name,Title:window.document.title,Favicon:''}){
  
    if(!Blank){
    if(UmbraCoreBrute.ScenesNexus[SceneID]){
   let document = GetActualWindow().document;
   if(!document){
    document = window.document;
   }
    UmbraCoreBrute.ScenesNexus[SceneID].Active = true;
  

      UmbraCoreBrute.ScenesNexus[SceneID].Window = Window.Name;
   document.body.scroll(0,0);
  let SceneContainerStyle = {
        position:'absolute',
        width:'100%',
        height:'100%',
        left:'0px',
        top:'0px',
        backgroundColor:'rgba(255, 0, 0, 0)',
        };

          if(ContainerStyle != null){
        SceneContainerStyle = ContainerStyle;
    }

    if(UmbraCoreBrute.ScenesNexus[SceneID].ContainerStyle){
        SceneContainerStyle = UmbraCoreBrute.ScenesNexus[SceneID].ContainerStyle;
    }

    let SceneContainer = {
        Id:SceneID + 'Container',
        Type:'div',
        Style:SceneContainerStyle
    };

     UmbraMainRender('Body',{'Container':SceneContainer},false,Window.Name);

  

   

    if(UmbraCoreBrute.ScenesNexus[SceneID].PageBindBluePrint){
        UmbraMainRender(SceneID + 'Container',UmbraCoreBrute.ScenesNexus[SceneID].PageBindBluePrint.MainContainers,false,Window.Name);
    }




    }else{
        console.warn("Umbra:Active Scene Need use of a Existing Scene!");
    }

    }else{
        UmbraNewWindow(Window.Name,Window.Title,Window.Favicon);
        let NewWindow = UmbraCoreBrute.UmbraDOM.UmbraWindows[Window.Name];
        NewWindow.console.warn('Test',Window)
        UmbraCoreBrute.ScenesNexus[SceneID].Active = true;
         UmbraCoreBrute.ScenesNexus[SceneID].Window = Window.Name;
   NewWindow.document.body.scroll(0,0);
  let SceneContainerStyle = {
        position:'absolute',
        width:'100%',
        height:'100%',
        left:'0px',
        top:'0px',
        backgroundColor:'rgba(255, 0, 0, 0)',
        };

          if(ContainerStyle != null){
        SceneContainerStyle = ContainerStyle;
    }

    if(UmbraCoreBrute.ScenesNexus[SceneID].ContainerStyle){
        SceneContainerStyle = UmbraCoreBrute.ScenesNexus[SceneID].ContainerStyle;
    }

    let SceneContainer = {
        Id:SceneID + 'Container',
        Type:'div',
        Style:SceneContainerStyle
    };

    UmbraMainRender('Body',{'Container':SceneContainer},false,Window.Name);

  

   

    if(UmbraCoreBrute.ScenesNexus[SceneID].PageBindBluePrint){
        UmbraMainRender(SceneID + 'Container',UmbraCoreBrute.ScenesNexus[SceneID].PageBindBluePrint.MainContainers,false,Window.Name);
    }




    }
     UmbraCoreBrute.UmbraDOM.Windows[Window.Name].Scenes.push(SceneID);
};


function UmbraNewWindow(WindowName,Title=window.document.title,favicon){
  let NewWindow = window.open('Umbra/UmbraWindow.html',WindowName);
  
       UmbraCoreBrute.UmbraDOM.UmbraWindows[WindowName] = NewWindow;
       UmbraCoreBrute.UmbraDOM.UmbraWindowsData[WindowName] = {
        Window:NewWindow,
        Title:Title,
        Name:WindowName,
       };
       UmbraCoreBrute.UmbraDOM.Windows[WindowName] = {
        Blueprints:{},
ActiveAnimations:{},
Scenes:[],
ComputedStyles:{},
DeclaredStyles:{},
OverridesStyles:{},
ActiveElements:[],
       };

   

       //UmbraCoreBrute.UmbraLogic.LogicModule.UmbraLogicCore(NewWindow.document,NewWindow);
       
 
       UmbraAnimationLoop(NewWindow);
       NewWindow.document.title = Title;
       let Favicon = NewWindow.document.createElement('link');

       Favicon.rel = "icon";
       NewWindow.document.head.appendChild(Favicon);
       Favicon.href = favicon;
       Favicon.type = "image/x-icon";
}

function GetWindow(Id){
    let win = UmbraCoreBrute.UmbraDOM.UmbraWindows[Id];
    if(!win){
        win = window;
    }
    return win;
}

function TurnOfUmbraScene(SceneID,Window){
     if(UmbraCoreBrute.ScenesNexus[SceneID]){
    UmbraCoreBrute.ScenesNexus[SceneID].Active = false;
     let Win = UmbraMultiWindows.Get(Window);
     Win.console.warn('Janelaaaa',Window)
    let SceneContainer = Win.document.getElementById(SceneID + 'Container');
    let ActualStyle =  UmbraCoreBrute.UmbraDOM.DeclaredStyles[SceneID + 'Container'].Style;
    if(SceneContainer){
    UmbraDOM.Delete(SceneContainer.id,false,Window);
    }
    UmbraCoreBrute.UmbraDOM.DeclaredStyles[SceneID + 'Container'] = {};
    UmbraCoreBrute.UmbraDOM.DeclaredStyles[SceneID + 'Container'].Style = ActualStyle ;




    }else{
        console.warn("Umbra:TurnOf Scene Need use of a Existing Scene!");
    }
};

function TurnOffAllUmbraScene(Window=GetActualWindow().name){
    for(let i=0;i<UmbraCoreBrute.UmbraDOM.Windows[Window].Scenes.length;i++){
        let scene = UmbraCoreBrute.UmbraDOM.Windows[Window].Scenes[i];
        TurnOfUmbraScene(scene,Window);
        UmbraCoreBrute.UmbraDOM.Windows[Window].Scenes.shift();
    };
};

function DeleteUmbraScene(SceneID){
  delete UmbraCoreBrute.ScenesNexus[SceneID];
};

function VerifyUmbraScene(SceneID){
    let Bool = false;

    if(Object.keys(UmbraCoreBrute.ScenesNexus).includes(SceneID)){
        Bool = true;
    };

    return Bool;
}

 let ClientTheme = UmbraCoreBrute.ClientTheme;

export async function UmbraMainRender(MainParent,BluePrint,Sync=false,Window=null){
    for(let Child in BluePrint){
            UmbraCoreBrute.UmbraDOM.ActiveElements.push(BluePrint[Child].Id);
            if(Window == null){
             UmbraCoreBrute.UmbraDOM.Windows['Main'].ActiveElements.push(BluePrint[Child].Id);
            }else{
               UmbraCoreBrute.UmbraDOM.Windows[Window].ActiveElements.push(BluePrint[Child].Id);  
            }
        if(!BluePrint[Child].Style){
        BluePrint[Child].Style = {};
        }

        if(!BluePrint[Child].Data){
        BluePrint[Child].Data = {};
        }
 

        if(BluePrint[Child].Preset){
            let Preset = structuredClone(UmbraPresetsStorage[BluePrint[Child].Preset]);
             if(BluePrint[Child].PresetConfig){
             Preset = PresetConfigResolve(structuredClone(UmbraPresetsStorage[BluePrint[Child].Preset]),BluePrint[Child].PresetConfig,BluePrint[Child]);
             }
        BluePrint[Child] = UmbraMergePreset(BluePrint[Child],Preset);
       
        }

       UmbraCoreBrute.UmbraDOM.BluePrints[BluePrint[Child].Id] = BluePrint[Child];
       
        if(BluePrint[Child].Method){
              BluePrint[Child].Method.BluePrint.Parent = MainParent;
            for(let Node in BluePrint[Child].Method.BluePrint){
                if(typeof BluePrint[Child].Method.BluePrint[Node] == 'object' && !BluePrint[Child].Method.BluePrint[Node].Parent){
                  BluePrint[Child].Method.BluePrint[Node].Parent = MainParent;
                }
            }
            if(Window != null){
        UmbraRenderMethods[BluePrint[Child].Method.Type](BluePrint[Child].Method.BluePrint,Window);
            }else{
                  UmbraRenderMethods[BluePrint[Child].Method.Type](BluePrint[Child].Method.BluePrint,'Main');
            }
        }else{
            let ChildDOM;
            if(Sync){
                if(Window){
                     ChildDOM = UmbraCoreBrute.UmbraDOM.UmbraWindows[Window].document.getElementById(BluePrint[Child].Id)
                }else{

                     if(Window){
                    ChildDOM = UmbraCoreBrute.UmbraDOM.UmbraWindows[Window].document.getElementById(BluePrint[Child].Id);     
                     }else{
                ChildDOM = document.getElementById(BluePrint[Child].Id);
                     }
                }
            }else{
      ChildDOM = document.createElement(BluePrint[Child].Type);
            }
  
        if(BluePrint[Child].Type == 'input' || BluePrint[Child].Type == 'textarea'){
            if(BluePrint[Child].InputValue){
                if(typeof BluePrint[Child].InputValue == 'object'){
                    if(BluePrint[Child].InputValue.UmbraReactiveText){
                        let text = UmbraReactiveTextCore.Get(BluePrint[Child].InputValue.UmbraReactiveText)?.();
                        if(text){
                         ChildDOM.value = text;  
                        }
                        
                    }
                    else if(BluePrint[Child].InputValue.Translation){
                         let Traduc = BluePrint[Child].InputValue.Translation[UmbraCoreBrute.ClientLanguage()];
                ChildDOM.value = Traduc;
                    }
                }else{
                ChildDOM.value = BluePrint[Child].InputValue;
                }
            }
            if(BluePrint[Child].Prefix){
                if(UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id]){
   UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id].Prefix = BluePrint[Child].Prefix;
                }else{
                   UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id] = {};
                     UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id].Prefix = BluePrint[Child].Prefix;
                }
            }

             if(BluePrint[Child].Sufix){
                if(UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id]){
   UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id].Sufix = BluePrint[Child].Sufix;
                }else{
                   UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id] = {};
                     UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id].Sufix= BluePrint[Child].Sufix;
                }
            }
              if(BluePrint[Child].SmartComplete){
                if(UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id]){
   UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id].SmartComplete = BluePrint[Child].SmartComplete;
    UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id].SmartComplete.LastComplete = 0;
                }else{
                   UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id] = {};
                     UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id].SmartComplete = BluePrint[Child].SmartComplete;
                       UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id].SmartComplete.LastComplete = 0;
                }
            }
            if(BluePrint[Child].Regex){
              if(UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id]){
   UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id].Regex = BluePrint[Child].Regex;
                }else{
                   UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id] = {};
                     UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id].Regex = BluePrint[Child].Regex;
                }
            };
              if(BluePrint[Child].MaxCharacters){
              if(UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id]){
   UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id].MaxCharacters = BluePrint[Child].MaxCharacters;
                }else{
                   UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id] = {};
                     UmbraCoreBrute.UmbraLogic.UmbraSmartInputs[BluePrint[Child].Id].MaxCharacters = BluePrint[Child].MaxCharacters;
                }
            };
            if(BluePrint[Child].AutoComplete){
                ChildDOM.autocomplete = BluePrint[Child].AutoComplete;
            }
            if(BluePrint[Child].PlaceHolder){
                if(typeof BluePrint[Child].PlaceHolder == 'object'){
  if(BluePrint[Child].PlaceHolder.Translation){
                let Traduc = BluePrint[Child].PlaceHolder.Translation[UmbraCoreBrute.ClientLanguage()];
                ChildDOM.placeholder = Traduc;
                }
                }else{
             ChildDOM.placeholder = BluePrint[Child].PlaceHolder;
                }
            };
            if(BluePrint[Child].InputType){
                ChildDOM.type = BluePrint[Child].InputType;
            }
             if(BluePrint[Child].Accept){
                ChildDOM.accept = BluePrint[Child].Accept;
            }

        }
        ChildDOM.id = BluePrint[Child].Id;
        if(Window){
    if(MainParent == 'Body'){
UmbraCoreBrute.UmbraDOM.UmbraWindows[Window].document.body.appendChild(ChildDOM);
       }
       if(MainParent == 'Document'){
UmbraCoreBrute.UmbraDOM.UmbraWindows[Window].document.documentElement.appendChild(ChildDOM);
       }
       if(MainParent != 'Document' && MainParent != 'Body'){
       
        UmbraCoreBrute.UmbraDOM.UmbraWindows[Window].document.getElementById(MainParent).appendChild(ChildDOM);
    }
        }else{
       if(MainParent == 'Body'){
document.body.appendChild(ChildDOM);
       }
       if(MainParent == 'Document'){
document.documentElement.appendChild(ChildDOM);
       }
       if(MainParent != 'Document' && MainParent != 'Body'){
       
        document.getElementById(MainParent).appendChild(ChildDOM);
    }
}
        if(BluePrint[Child].InnerType){
            ChildDOM.type = BluePrint[Child].InnerType;
        }
        if(BluePrint[Child].Src){
            ChildDOM.src = BluePrint[Child].Src;
        }
        if(BluePrint[Child].Text){
            if(typeof BluePrint[Child].Text == 'string'){
        ChildDOM.innerText = BluePrint[Child].Text;
            }
            else if(typeof BluePrint[Child].Text == 'object' && !Array.isArray(BluePrint[Child].Text)){
                if(BluePrint[Child].Text.ReactiveText){
                    ChildDOM.innerText = await UmbraReactiveTextCore.Get(BluePrint[Child].Text.ReactiveText)();
                }
                if(BluePrint[Child].Text.Translation){
                let Traduc = BluePrint[Child].Text.Translation[UmbraCoreBrute.ClientLanguage()];
                ChildDOM.innerText = Traduc;
                }
            }
            else if(typeof BluePrint[Child].Text == 'function'){
           ChildDOM.innerText = BluePrint[Child].Text();
            }
           
            
        }
        let Win = 'Main';
         if(Window != null){
                Win = Window;
            }

        
        if(BluePrint[Child].Style && !BluePrint[Child].UmbraClass){
          
          UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(ChildDOM.id,BluePrint[Child].Style,"Declared",false,false,Win);  
        }

        if(BluePrint[Child].UmbraClass){
            if(UmbraClassesStorage[BluePrint[Child].UmbraClass]){
            let FinalStyle = UmbraClassesStorage[BluePrint[Child].UmbraClass];
         
            if(BluePrint[Child].Style){
                FinalStyle = UmbraMergePreset(BluePrint[Child].Style,structuredClone(UmbraClassesStorage[BluePrint[Child].UmbraClass])
                    ,true,BluePrint[Child].UmbraClass);
            }
         UmbraUI.UmbraApplyStyle(ChildDOM.id,FinalStyle,"Declared",false,false,Win);
            }
        }

        if(BluePrint[Child].ReactiveStyle){
         ReactiveStyleResolver(BluePrint[Child].Id,BluePrint[Child],BluePrint[Child].ReactiveStyle);
        };

        if(BluePrint[Child].Listener){
           
            if(Window){
            UmbraCoreBrute.UmbraLogic.LogicModule.UmbraListeners.Add(BluePrint[Child].Id,BluePrint[Child].Listener,Window);
            }else{
       UmbraCoreBrute.UmbraLogic.LogicModule.UmbraListeners.Add(BluePrint[Child].Id,BluePrint[Child].Listener,'Main');             
            
            };
        }
       
        if(!Sync){
            WindowRegister(Win,BluePrint[Child]);
        };
      
        if(BluePrint[Child].Childs){
            
            UmbraMainRender(BluePrint[Child].Id,BluePrint[Child].Childs,Sync,Window);
        }
    }

}

}



function WindowRegister(Window,BluePrint){
    console.warn('Regist',UmbraCoreBrute.UmbraDOM.Windows[Window]);
    if(!UmbraCoreBrute.UmbraDOM.Windows[Window]){
         UmbraCoreBrute.UmbraDOM.Windows[Window] = {};
    }
      UmbraCoreBrute.UmbraDOM.Windows[Window].Blueprints[BluePrint.Id] = BluePrint;
 

};


function ReactiveStyleResolver(Id,BluePrint,ReactiveStyle){
let DeclaredStyle = UmbraDeclaredStylesStorage[Id];
if(DeclaredStyle){

   
for(let Prop in ReactiveStyle){
    console.warn('Prop',ReactiveStyle[Prop]())
    DeclaredStyle.Style[Prop] = ReactiveStyle[Prop]();
}
}
UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(Id,{},'Declared',true);
};


function PresetConfigResolve(Preset,Config,Element){
    let FinalPreset = Preset;
if(Config.RecursiveId == true){
    console.error('fsdfsfsdfsfsdfsdfssdfas',Preset,Element);

FinalPreset = UmbraPresetRecursiveIdMerge(Preset,Element);
};
return FinalPreset;
};


function UmbraPresetRecursiveIdMerge(Preset,Element){
let MergeId = structuredClone(Element.Id);
if(!MergeId) return;
let ActualPresetNode = Preset;
let EntryNodes = ['Childs'];
let LastNode = null;
function MergeIds(ActualPresetNode){
     if(ActualPresetNode.Id){
       ActualPresetNode.Id = ActualPresetNode.Id + '_PresetId_' + MergeId; 
    }
for(let Node in ActualPresetNode){
    if(typeof ActualPresetNode[Node] == 'object' &&
         !Array.isArray(ActualPresetNode[Node])){
    MergeIds(ActualPresetNode[Node]);
    }
}
};

MergeIds(ActualPresetNode);
return Preset;
};

function UmbraMergePreset(MergeStyle,ActualStyle,Regist = false,PriorityId = null,SubId = null){
    try{
let ActualMergeNode = MergeStyle;
let ActualStyleNode = ActualStyle;
let PreMerge = structuredClone(MergeStyle);

let MergeQueue = Object.keys(MergeStyle);
function Merge(ActualMergeNode,ActualStyleNode){
  for(let MergeProp in ActualMergeNode){
    if(typeof ActualMergeNode[MergeProp] == 'object' && !Array.isArray(ActualMergeNode[MergeProp]) && MergeProp != 'Merged'){
        if(!ActualStyleNode[MergeProp] || typeof ActualStyleNode[MergeProp] != 'object'){
            if(typeof ActualMergeNode[MergeProp] == 'object'){
            ActualStyleNode[MergeProp] = {};
            }
        }
      Merge(ActualMergeNode[MergeProp], ActualStyleNode[MergeProp]);
    }else{
    ActualStyleNode[MergeProp] = ActualMergeNode[MergeProp];
};
  };
  
}
  Merge(ActualMergeNode,ActualStyleNode);
if(Regist == true){
  if(ActualStyle.Merged){
        ActualStyle.Merged[PriorityId]=PreMerge;
  }else{
    ActualStyle.Merged = {};
        ActualStyle.Merged[PriorityId]=PreMerge;
  }
}
  return ActualStyle;
}
catch(e){
    
    console.error('Merge Error',e);
    return ActualStyle;
}
};



function UmbraDismissMerge(Style,Dismiss){
   let NewMerge = {};
   if(!Style.Merged){
    return Style;
   }
   let NewMergedRegist = structuredClone(Style.Merged);
   if(!Style.Merged){
    return;
   }
   delete NewMergedRegist[Dismiss];
  for(let Prop in NewMergedRegist){
   NewMerge = UmbraMergePreset(NewMergedRegist[Prop],NewMerge,true,Prop,'NewMerge');
  }

return NewMerge;
};




export function UmbraPageRender(BluePrint){
  let RenderBluePrint = BluePrint.MainContainers;
  let MainParent = BluePrint.MainParent;
  UmbraMainRender(MainParent,RenderBluePrint);
}

UmbraNexusBrute.Update(["UmbraDOM","UiModule"],{
    UmbraScenes:UmbraScenesBrute,
    ClientTheme:ClientTheme,
    UmbraMainRender:UmbraMainRender,
    UmbraPageRender:UmbraPageRender,
    UmbraDOM:UmbraDOM,
    UmbraMultiWindows:UmbraMultiWindows,
    UmbraMerge:UmbraMergePreset,
    UmbraDismissMerge:UmbraDismissMerge,
});

let UmbraRenderMethods = {
    'BindingContent':UmbraBindingContentRender,
    'SearchTools':UmbraSearchToolsRender,
    'ComboBox':UmbraComboBoxRender,
    'CheckBox':UmbraCheckBoxRender,


}
function UmbraCheckBoxRender(BluePrint){
if(BluePrint.MainContainer.Listener){

}else{
    BluePrint.MainContainer.Listener = {};
    
}
BluePrint.MainContainer.Listener.Turn = true;
BluePrint.MainContainer.Listener.TurnedStyle = BluePrint.CheckedStyle;
UmbraMainRender(BluePrint.Parent,{'CheckBox':BluePrint.MainContainer});

if(BluePrint.StartState){
    if(typeof BluePrint.StartState == 'string'){
    let fn = UmbraCoreBrute.UmbraLogic.UmbraGlobalFunctions[BluePrint.StartState];
    if(fn() == true){
        UmbraCoreBrute.UmbraLogic.LogicModule.UmbraTurnDispatcher(BluePrint.MainContainer.Id,BluePrint.MainContainer.Listener); 
    }

    }else if(BluePrint.StartState == true){
        UmbraCoreBrute.UmbraLogic.LogicModule.UmbraTurnDispatcher(BluePrint.MainContainer.Id,BluePrint.MainContainer.Listener);
    }
}
};

function UmbraComboBoxRender(BluePrint){
      if(!BluePrint.MainContainer){
   return;
  }
  BluePrint = structuredClone(BluePrint);
 if(BluePrint.ContainersStyle){
    if(BluePrint.ContainersStyle.UmbraClass){
        if(Array.isArray(BluePrint.ContainersStyle.UmbraClass)){
            for(let i = 0;i<BluePrint.ContainersStyle.UmbraClass.length;i++){
       BluePrint.ContainersStyle = UmbraMergePreset(BluePrint.ContainersStyle,UmbraClassesStorage[BluePrint.ContainersStyle.UmbraClass[i]]);
            }
        }else{
 BluePrint.ContainersStyle = UmbraMergePreset(BluePrint.ContainersStyle,UmbraClassesStorage[BluePrint.ContainersStyle.UmbraClass]);
        }
    }
 }

  if(BluePrint.BackgroundStyle){
    if(BluePrint.BackgroundStyle.UmbraClass){
        if(Array.isArray(BluePrint.BackgroundStyle.UmbraClass)){
            for(let i = 0;i<BluePrint.BackgroundStyle.UmbraClass.length;i++){
       BluePrint.BackgroundStyle = UmbraMergePreset(BluePrint.BackgroundStyle,UmbraClassesStorage[BluePrint.BackgroundStyle.UmbraClass[i]]);
            }
        }else{
 BluePrint.BackgroundStyle = UmbraMergePreset(BluePrint.BackgroundStyle,UmbraClassesStorage[BluePrint.BackgroundStyle.UmbraClass]);
        }
    }
 }
  if(BluePrint.MainContainerTextStyle){
    if(BluePrint.MainContainerTextStyle.UmbraClass){
        if(Array.isArray(BluePrint.MainContainerTextStyle.UmbraClass)){
            for(let i = 0;i<BluePrint.MainContainerTextStyle.UmbraClass.length;i++){
       BluePrint.MainContainerTextStyle = UmbraMergePreset(BluePrint.MainContainerTextStyle,UmbraClassesStorage[BluePrint.MainContainerTextStyle.UmbraClass[i]]);
            }
        }else{
 BluePrint.MainContainerTextStyle = UmbraMergePreset(BluePrint.MainContainerTextStyle,UmbraClassesStorage[BluePrint.MainContainerTextStyle.UmbraClass]);
        }
    }
 }
   UmbraComboBoxRenderMainContainer(BluePrint);
   UmbraComboBoxRenderBackground(BluePrint);
    UmbraComboBoxRenderContainers(BluePrint);

    if(!BluePrint.OpenInit){
      ComboBoxMainContainerHandler('ComboBoxBackground'+BluePrint.MainContainer.Id,true);
    }

   
};


function ComboBoxMainContainerHandler(Background,OnlyClose = false){
  
    if(UmbraDeclaredStylesStorage[Background].Style.display != 'none'){
    
 UmbraDeclaredStylesStorage[Background].Style.display = 'none';
  UmbraDeclaredStylesStorage[Background].Style.pointerEvents = 'none';
   UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(Background,{},'Declared',true);
    }
    else if(UmbraDeclaredStylesStorage[Background].Style.display == 'none' && OnlyClose == false){
       
         UmbraDeclaredStylesStorage[Background].Style.display = 'flex';
          UmbraDeclaredStylesStorage[Background].Style.pointerEvents = 'all';
         UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(Background,{},'Declared',true);
    }
};

function UmbraComboBoxRenderMainContainer(BluePrint){
  let MainContainer = BluePrint.MainContainer;
    UmbraCoreBrute.UmbraLogic.LogicModule.UmbraListeners.Add(MainContainer.Id+'Listener'+'_ComboBoxMainHandler',{
                  UseFn:true,
    Condition:true,
    Fn:ComboBoxMainContainerHandler,
    FnParams:()=>['ComboBoxBackground'+MainContainer.Id],
    ...MainContainer.Listener,
            });

  let Listener = MainContainer.Id+'Listener'+'_ComboBoxMainHandler';
  if(MainContainer.Listener){
  //Listener = UmbraMergePreset(MainContainer.Listener,Listener);
  };
   MainContainer.Type = 'div';
  MainContainer.Listener = Listener;
  if(!MainContainer.Childs){
  MainContainer.Childs = {};
  }
  MainContainer.Childs['MainContainerText'] = {
    Id:MainContainer.Id+'Text',
    Type:'div',
    Style:{...BluePrint.MainContainerTextStyle,
        pointerEvents:'none',
    },
    Text:MainContainer.Text,

  }
  delete MainContainer.Text;
  UmbraMainRender(MainContainer.Parent,{'MainContainer':MainContainer});
};


function UmbraComboBoxRenderContainers(BluePrint){
  let Containers = BluePrint.Options;
  if(!Containers){
    return;
  }
  for(let Cont in Containers){
    let ActualCont = Containers[Cont];
    if(typeof ActualCont == 'object'){
       
    
    console.warn(ActualCont)
    ActualCont.Id = ActualCont.Id+'_'+BluePrint.MainContainer.Id;
    if(BluePrint.ContainersStyle){
    ActualCont.Style = structuredClone(BluePrint.ContainersStyle);
    }
let ContainerListenerId = ActualCont.Id+'Listener';
let List = [];
    let ParamList = [];
if(!BluePrint.NoAutoText){
 List = [()=>{
        let Text = Containers[Cont].Text;
     let MainContainer = document.getElementById(BluePrint.MainContainer.Id+'Text');
     if(MainContainer){
    if(Text.Translation){
   document.getElementById(BluePrint.MainContainer.Id+'Text').innerText = Text.Translation[UmbraCoreBrute.ClientLanguage()];   
        }else{
        document.getElementById(BluePrint.MainContainer.Id+'Text').innerText = Text;      
        } 
     }
    }];
    ParamList.push([]);
}


    if(BluePrint.OptionClose){
   List.push(ComboBoxMainContainerHandler);
    ParamList.push(['ComboBoxBackground'+BluePrint.MainContainer.Id,true]);
    }
    let Listener = {}
if(Containers[Cont].Listener){
    if(typeof Containers[Cont].Listener == 'string'){
   Listener = {
    NativeFnParams:()=>ParamList,
    NativeFn:List,
     ...UmbraCoreBrute.UmbraLogic.UmbraListeners[Containers[Cont].Listener],
     UseFn:true,
  }
    }else{
  Listener = {
    NativeFnParams:()=>ParamList,
    NativeFn:List,
     ...Containers[Cont].Listener,
     UseFn:true,
  }
    }
}
     
  UmbraCoreBrute.UmbraLogic.LogicModule.UmbraListeners.Add(ContainerListenerId,Listener);



Containers[Cont].Listener = ContainerListenerId;
    UmbraMainRender('ComboBoxBackground'+BluePrint.MainContainer.Id,{'ComboContainer':ActualCont});
     if(BluePrint.StartOption){
        if(typeof BluePrint.StartOption == 'object'){
       let fn = UmbraCoreBrute.UmbraLogic.UmbraGlobalFunctions[BluePrint.StartOption.UmbraGlobalFunctions];
      if(Containers[Cont].ComboValue == fn()){
           UmbraCoreBrute.UmbraLogic.LogicModule.UmbraVirtualMethods.Click(ContainerListenerId);
            }
        }else{
            if(Containers[Cont].ComboValue == BluePrint.StartOption){
         UmbraCoreBrute.UmbraLogic.LogicModule.UmbraVirtualMethods.Click(ContainerListenerId);
            }
        }
    }
}
  }
};

function UmbraComboBoxRenderBackground(BluePrint){
 let Height = 0;
 if(BluePrint.ContainersStyle){
    let EachHeight = BluePrint.ContainersStyle.height;
    if(!EachHeight){
        EachHeight = 0;
    }else{
        EachHeight = parseInt(EachHeight);
    }
    Height = EachHeight * (Object.keys(BluePrint.Options).length - 1);
 }
 let FinalHeight = Height+'px';
 if(!BluePrint.BackgroundStyle){
  BluePrint.BackgroundStyle = {};
 }

 
 BluePrint.BackgroundStyle.height = FinalHeight;
 BluePrint.BackgroundStyle.position = 'absolute';

 if(!BluePrint.BackgroundStyle.width){
    BluePrint.BackgroundStyle.width = BluePrint.MainContainer.Style.width;
 }

 if(BluePrint.Direction == 'Down' && !BluePrint.MainContainer.Text){
      BluePrint.BackgroundStyle.marginTop =BluePrint.MainContainer.Style.height;
 }else if(BluePrint.Direction == 'Down' && BluePrint.MainContainer.Text){
  let margin = 20;
     BluePrint.BackgroundStyle.marginTop = BluePrint.MainContainer.Style.height;
 };

  if(BluePrint.Direction == 'Up'){
      BluePrint.BackgroundStyle.marginBottom = UmbraDeclaredStylesStorage[BluePrint.MainContainer.Id].Style.height;
 }

 UmbraMainRender(BluePrint.MainContainer.Id,{
    'ComboBoxBackGround':{
        Id:'ComboBoxBackground'+BluePrint.MainContainer.Id,
        Type:'div',
        Style:BluePrint.BackgroundStyle,
    }
 });
};

export function UmbraBindingContentRender(BluePrint,Window='Main'){
    BluePrint = structuredClone(BluePrint);
     UmbraMainRender(structuredClone(BluePrint.MainContainer.Parent),{'MainContainer':BluePrint.MainContainer});
     for(let Trigger in BluePrint.BindingTriggers){
        let BindingTurn = [];
       
        let TriggerBluePrint = structuredClone(BluePrint.BindingTriggers[Trigger]);
        if(!TriggerBluePrint['Listener'] && typeof TriggerBluePrint == 'object'){
        
           TriggerBluePrint["Listener"] = {};
        };
        if(!TriggerBluePrint.Listener){
            delete BluePrint.BindingTriggers[Trigger];
            continue;
        }
        TriggerBluePrint.OldListener = structuredClone(TriggerBluePrint.Listener);
         if(BluePrint.BindingTurn){
           for(let InnerTrigger in BluePrint.BindingTriggers){
            
          if(InnerTrigger != Trigger){
            BindingTurn.push(BluePrint.BindingTriggers[InnerTrigger].Id+'Listener'+'_BindingContentHandler');
            console.warn('Turn esaad',Trigger,BindingTurn);
          }
           }
        };
        if(TriggerBluePrint.Preset){
            if(typeof TriggerBluePrint["Listener"] == 'string'){
                TriggerBluePrint['Listener'] = UmbraCoreBrute.UmbraLogic.UmbraListeners[TriggerBluePrint.Listener];
            }
            UmbraCoreBrute.UmbraLogic.LogicModule.UmbraListeners.Add(TriggerBluePrint.Id+'Listener'+'_BindingContentHandler',{
                  
            UseFn:true,
               DesactiveTurn:BindingTurn,
               TurnFlag:()=>(!UmbraCoreBrute.UmbraLogic.UmbraBrain[BluePrint.BindingTriggers[Trigger].Id].BindingTriggerStats),
            NativeFn:UmbraBindingContentHandler,
            NativeFnParams:()=>[Trigger,TriggerBluePrint,BluePrint,Window],
            ...TriggerBluePrint["OldListener"],
            });
          TriggerBluePrint['Listener'] =TriggerBluePrint.Id+'Listener'+'_BindingContentHandler';   
          console.warn('Triffer Testststs',UmbraCoreBrute.UmbraLogic.UmbraListeners[TriggerBluePrint.Id+'Listener'+'_BindingContentHandler'])
        }else{
        TriggerBluePrint['Listener'] = {
            UseFn:true,
              TurnFlag:()=>(!UmbraCoreBrute.UmbraLogic.UmbraBrain[BluePrint.BindingTriggers[Trigger].Id].BindingTriggerStats),
            DesactiveTurn:BindingTurn,
            NativeFn:UmbraBindingContentHandler,
            NativeFnParams:()=>[Trigger,TriggerBluePrint,BluePrint,Window],
              ...TriggerBluePrint["OldListener"],
        };
    }
        UmbraMainRender(TriggerBluePrint.Parent,{'Trigger':TriggerBluePrint},false,Window);  

        if(UmbraCoreBrute.UmbraLogic.UmbraBrain[BluePrint.BindingTriggers[Trigger].Id]){
         UmbraCoreBrute.UmbraLogic.UmbraBrain[BluePrint.BindingTriggers[Trigger].Id]['BindingTriggerStats'] = false;
          UmbraCoreBrute.UmbraLogic.UmbraBrain[BluePrint.BindingTriggers[Trigger].Id]['ComponentType'] = 'BindingTrigger';
        }else{
        UmbraCoreBrute.UmbraLogic.UmbraBrain[BluePrint.BindingTriggers[Trigger].Id] = {
            BindingTriggerStats:false,
            ComponentType:'BindingTrigger',
        };
        }
     };
     if(BluePrint.StartBinding){
    console.warn(BluePrint.StartBinding, document.getElementById(BluePrint.StartBinding));
    UmbraCoreBrute.UmbraLogic.LogicModule.UmbraVirtualMethods.Click(BluePrint.StartBinding);
     };
     
     
}


function UmbraBindingContentHandler(TriggerName,TriggerBluePrint,BluePrint,Window){
    
let ActiveBinding = null;
for(let Trigger in BluePrint.BindingTriggers){
    let TriggerId = BluePrint.BindingTriggers[Trigger].Id;
  if(UmbraCoreBrute.UmbraLogic.UmbraBrain[TriggerId].BindingTriggerStats == true){
   UmbraCoreBrute.UmbraLogic.UmbraBrain[TriggerId].BindingTriggerStats = false;
   let BindingContent = BluePrint.BindingTriggers[Trigger].BindingContent;
   for(let Content in BindingContent){
    console.warn('ContentDelete:',UmbraCoreBrute.UmbraDOM.ActiveElements);
    UmbraDOM.Delete(BindingContent[Content].Id,true,Window);
     console.warn('ContentDeletePos:',UmbraCoreBrute.UmbraDOM.ActiveElements);
   }
   
  }
}
let BindingContentRender = TriggerBluePrint.BindingContent;
UmbraMainRender(BluePrint.MainContainer.Id,BindingContentRender,false,Window);
UmbraCoreBrute.UmbraLogic.UmbraBrain[TriggerBluePrint.Id].BindingTriggerStats = true;
}

let SearchToolsTypes = [
    'SearchInput',
    'SearchFilterChanger',
    
];

let SearchMethods = {
 'InnerValue':SearchForResolver,
 'Text':SearchForResolver,
};

function UmbraSearchToolsHandler(BluePrint){
   let SearchArea = BluePrint.SearchArea;
    let Childs = UmbraDOM.GetChilds(BluePrint.SearchArea);
    for(let i = 0;i<Childs.length;i++){
        UmbraBlueprintsStorage[Childs[i]].Searched = false;
    }
   if(SearchArea){
    if(BluePrint.SearchFor){
  function Search(For){

   SearchForResolver(BluePrint,For);
    
  }
if(Array.isArray(BluePrint.SearchFor)){
  for(let i = 0;i<BluePrint.SearchFor.length;i++){
   Search(BluePrint.SearchFor[i])
   
  }
}else{   
  Search(BluePrint.SearchFor);
}
    }
   }
};

function SearchForResolver(BluePrint,For){
 let SearchTarget = GetSearchTarget(BluePrint);
 let SearchAreaBluePrint = UmbraBlueprintsStorage[BluePrint.SearchArea];
 let Searched = [];
 let Childs = UmbraDOM.GetChilds(BluePrint.SearchArea);
 console.warn('area',Childs);
 console.error(UmbraBlueprintsStorage);
 if(SearchAreaBluePrint){
    if(SearchAreaBluePrint.Childs){
  for(let i = 0;i<Childs.length;i++){
    let ActualBluePrint = UmbraBlueprintsStorage[Childs[i]];
    if(!ActualBluePrint){
        continue;
    }
 let Value = GetSearchValue(SearchAreaBluePrint,ActualBluePrint,For);
    let Result = CompareSearchValues(Value,SearchTarget,BluePrint.LowCase);
    if(ActualBluePrint.Searched == false){
     
    
    if(BluePrint.FilterMode){
        if(Array.isArray(BluePrint.FilterMode)){
            for(let i = 0;i<BluePrint.FilterMode.length;i++){
 FiltersModes[BluePrint.FilterMode[i]](Result,ActualBluePrint,BluePrint);
            }
        }else{
  if(FiltersModes[BluePrint.FilterMode]){
   FiltersModes[BluePrint.FilterMode](Result,ActualBluePrint,BluePrint);
  }
}
  }
   if(Result == true){
        ActualBluePrint.Searched = true;
    }
}
}
}
 }
};

const SearchTargetTypes = {
    'SearchInput':GetSearchInputTargetValue,
};

const FiltersModes = {
 'Hide':FilterHideResolver,
 'Focus':FilterFocusResolver,
  'InverseFocus':FilterInverseFocusResolver,
 'Sort':FilterSortResolver,
}

function FilterHideResolver(FilterResult,Element,Blueprint){
  if(!FilterResult){
   let style = UmbraMergePreset({display:'none'},UmbraCoreBrute.UmbraDOM.OverridesStyles[Element.Id],true,Element.Id+'Hide');
UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(Element.Id,style,'Overrides',true);

  }else{
let style = UmbraMergePreset({display:'flex'},UmbraCoreBrute.UmbraDOM.OverridesStyles[Element.Id],true,Element.Id+'Hide');
UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(Element.Id,style,'Overrides',true);
  }
};


function FilterFocusResolver(FilterResult,Element,Blueprint){
    
       if(Blueprint.Focus){

  if(!FilterResult ){
 let style = UmbraDismissMerge(UmbraOverridesStorage[Element.Id],Element.Id+'Focus');
 UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(Element.Id,style,'Overrides');

  }else{
let style = UmbraMergePreset(Blueprint.Focus,UmbraOverridesStorage[Element.Id],true,Element.Id+'Focus');

UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(Element.Id,style,'Overrides');

  }
}
};


function FilterInverseFocusResolver(FilterResult,Element,Blueprint){
    
       if(Blueprint.InverseFocus){
  if(FilterResult ){
  
   let style = UmbraDismissMerge(UmbraOverridesStorage[Element.Id],Element.Id+'InverseFocus');
   UmbraCoreBrute.UmbraDOM.OverridesStyles[Element.Id] = style;
 UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(Element.Id,style,'Overrides');

  }else{
let style = UmbraMergePreset(Blueprint.InverseFocus,UmbraOverridesStorage[Element.Id],true,Element.Id+'InverseFocus');

UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(Element.Id,style,'Overrides');

  }
}
};


function FilterSortResolver(FilterResult,Element,Blueprint){
    if(!FilterResult){
     UmbraDOM.Delete(Element.Id,true);
     let RealElement = UmbraCoreBrute.UmbraDOM.BluePrints[Element.Id];
     UmbraMainRender(UmbraDOM.GetParent(Element.Id),{'Element':RealElement});
    }else{
    
    }
};

function CompareSearchValues(Value,Target,LowCase = false){
let Length = Target.length;
console.error(Value,Target)
if(!Value){
    return false;
}
if(Length == 0){
    return true;
}
if(Value.length > Length){
    Value = Value.slice(0,Length);
};

 let bool = Value == Target;
  if(LowCase){
  bool = Value.toLowerCase() == Target.toLowerCase();
 }
 return bool;
};

function GetSearchValue(FullBluePrint,ActualChild,For){
  let Value = ActualChild[For];
  return Value;
};




function GetSearchInputTargetValue(Id){
 let Input = document.getElementById(Id);
 let Value = null;
 if(Input){
   Value = Input.value;
 }
 return Value;
};

function GetSearchTarget(BluePrint){
    let Value = null;
 if(SearchTargetTypes[BluePrint.SearchTool]){
    Value = SearchTargetTypes[BluePrint.SearchTool](BluePrint.Id);
 }
    return Value;
};

let SearchToolsTraductor = {
    'ItemsManagerSearchInput':'SearchInput',
}

function UmbraSearchToolsRender(BluePrint){
for(let Node in BluePrint){

if(SearchToolsTypes.includes(Node)){
     let SearchHandler = {};
   if(Array.isArray(BluePrint[Node].FilterMode)){
  if(BluePrint[Node].FilterMode.includes('Sort')){
    let newFilter = BluePrint[Node].FilterMode;
  if(newFilter.includes('Sort')){
         let index = 0;
 for(let i=0;i<newFilter.length;i++){
   if(newFilter[i] == 'Sort'){
      index = i;
   }
 };
  let filt = newFilter.splice(index,1)[0];
    newFilter.unshift(filt);
 }
  }
   }
    if(Node == 'SearchInput'){
        BluePrint[Node].Type = 'input';
        BluePrint[Node].SearchTool = 'SearchInput';
     
        SearchHandler = {
            UseFn:true,
            Condition:true,
            UmbraInput:{
                InputFn:UmbraSearchToolsHandler,
            InputFnParams:()=>[BluePrint[Node]],
            }
        }
        if(BluePrint[Node].Listener){
           SearchHandler = UmbraMergePreset(BluePrint[Node].Listener,SearchHandler);
        }
        
    }

    if(Node == 'SearchFilterChanger'){
        BluePrint[Node].Type = 'div';
        BluePrint[Node].SearchTool = 'SearchInputFilterChanger';
        let Target = SearchToolsTraductor[BluePrint[Node].Target];

        let ContStyle = {};
        let MainCont = {...structuredClone(BluePrint[Node])};

        let FocusText = 'Focus';
        let HideText = 'Hide';
        let InverseFocusText = 'Inverse Focus';
        let SortText = 'Sort';

        if(BluePrint[Node].HideText){
            HideText = BluePrint[Node].HideText;
        };

                if(BluePrint[Node].FocusText){
            FocusText = BluePrint[Node].FocusText;
        };

           if(BluePrint[Node].InverseFocusText){
            InverseFocusText = BluePrint[Node].InverseFocusText;
        };
        
           if(BluePrint[Node].SortText){
            SortText = BluePrint[Node].SortText;
        };

        let FocusListener = {
           UseFn:true,
                    Condition:true,
                    UmbraHover:{
                        Style:{
                            scale:'1.02',
                        }
                    },
                    Fn:SearchFilterChangerHandler,
                     FnParams:()=>[BluePrint[Node].Target,'FocusOption'+'_'+BluePrint[Node].Id],
                      Turn:true,
                       TurnedStyle : BluePrint[Node].TurnStyle,
     };
     let HideListener = {
 UseFn:true,
                    Condition:true,
                    UmbraHover:{
                        Style:{
                            scale:'1.02',
                        }
                    },
                    Fn:SearchFilterChangerHandler,
                      FnParams:()=>[BluePrint[Node].Target,'HideOption'+'_'+BluePrint[Node].Id],
                       Turn:true,
                       TurnedStyle : BluePrint[Node].TurnStyle,
     }


     let InverseFocusListener = {
  UseFn:true,
                    Condition:true,
                    UmbraHover:{
                        Style:{
                            scale:'1.02',
                        }
                    },
                    Fn:SearchFilterChangerHandler,
                    FnParams:()=>[BluePrint[Node].Target,'InverseFocusOption'+'_'+BluePrint[Node].Id],
                     Turn:true,
                    TurnedStyle : BluePrint[Node].TurnStyle,
     };

     let SortListener = {
UseFn:true,
                    Condition:true,
                    UmbraHover:{
                        Style:{
                            scale:'1.02',
                        }
                    },
                    Fn:SearchFilterChangerHandler,
                      FnParams:()=>[BluePrint[Node].Target,'SortOption'+'_'+BluePrint[Node].Id],
                       Turn:true,
                       TurnedStyle: BluePrint[Node].TurnStyle,
     }

   let FilterCheck = {
    'Sort':SortListener,
    'InverseFocus':InverseFocusListener,
    'Hide':HideListener,
    'Focus':FocusListener,
   }

   for(let filter in FilterCheck){
    if(BluePrint[Target].FilterMode.includes(filter)){
        FilterCheck[filter].Turned = true;
    }
   }


     UmbraCoreBrute.UmbraLogic.LogicModule.UmbraListeners.Add('FocusListener',FocusListener);
         UmbraCoreBrute.UmbraLogic.LogicModule.UmbraListeners.Add('HideListener',HideListener);
         UmbraCoreBrute.UmbraLogic.LogicModule.UmbraListeners.Add('SortListener',SortListener);
         UmbraCoreBrute.UmbraLogic.LogicModule.UmbraListeners.Add('InverseFocusListener',InverseFocusListener);

        BluePrint[Node].Method = {
            Type:'ComboBox',
            BluePrint:{
                NoAutoText:true,
                OptionClose:true,
                MainContainer:{
                  Parent:structuredClone(BluePrint.Parent),
                  ...MainCont,
                },
              ContainersStyle:BluePrint[Node].ContainersStyle,
              BackgroundStyle:BluePrint[Node].BackgroundStyle,
              Direction:BluePrint[Node].Direction,
              Options:{
              'Focus':{
                Id:'FocusOption',
                Type:'div',
                    InnerValue:'Focus',
                Listener:'FocusListener',
                  Text:FocusText,
                  
              },
              'Hide':{
           Id:'HideOption',
                Type:'div',
                    InnerValue:'Hide',
                Listener:'HideListener',
                    Text:HideText,
              },
              'Sort':{
           Id:'SortOption',
                Type:'div',
                    InnerValue:'Sort',
                Listener:'SortListener',
                        Text:SortText,
              },
              'InverseFocus':{
            Id: 'InverseFocusOption',
            InnerValue:'InverseFocus',
                Type:'div',
                Listener:'InverseFocusListener',
                  Text:InverseFocusText,
              }
              }
            }
        };

     
       


    }
     BluePrint[Node].Listener = SearchHandler;
    UmbraMainRender(BluePrint[Node].Parent,{'RenderElement':BluePrint[Node]});
    
};


};

};

function SearchFilterChangerHandler(Target,Diagram){
      console.warn('Filtrandoddodd',Target,Diagram)
let BluePrint = UmbraBlueprintsStorage[Diagram];
let TargetBluePrint = UmbraBlueprintsStorage[Target];
console.warn('Filtrandoddodd',BluePrint,TargetBluePrint)
if(BluePrint && TargetBluePrint){
        let opt = BluePrint;
          console.warn('Filtrandoddodd')
        if(opt.Data?.Active == true || opt.Data?.Active == false){
          
            if(TargetBluePrint.FilterMode){
                if(Array.isArray(TargetBluePrint.FilterMode)){
                    if(TargetBluePrint.FilterMode.includes(BluePrint.InnerValue)){
                          let newFilter = [];
                          for(let i = 0;i<TargetBluePrint.FilterMode.length;i++){
                          let filter = TargetBluePrint.FilterMode[i];
                          if(filter != BluePrint.InnerValue){
                            if(filter == 'Sort'){
                                newFilter.unshift(filter);
                            }else{
                            newFilter.push(filter);
                            }
                          }else{
                         
                            UmbraFilterChangerResolver(Diagram,Target,filter);
                          }
                          }
                          if(newFilter.includes('Sort')){
                            let index = 0;
                            for(let i=0;i<newFilter.length;i++){
                              if(newFilter[i] == 'Sort'){
                                index = i;
                              }
                            };
                            let filt = newFilter.splice(index,1)[0];
                            newFilter.unshift(filt);
                          }
                   
                          TargetBluePrint.FilterMode = newFilter;
                           
                    }else{
                        if(BluePrint.InnerValue == 'Sort'){
                    TargetBluePrint.FilterMode.unshift(BluePrint.InnerValue);
                        }else{
                     TargetBluePrint.FilterMode.push(BluePrint.InnerValue);
                        }
                    }
                }else{
                    if(TargetBluePrint.FilterMode == BluePrint.InnerValue){
                        TargetBluePrint.FilterMode = [];
                        UmbraFilterChangerResolver(Diagram,Target,TargetBluePrint.FilterMode);
                    }else{
                        
                    TargetBluePrint.FilterMode = [TargetBluePrint.FilterMode,BluePrint.InnerValue];
                    }
                }
            }
       UmbraCoreBrute.UmbraLogic.LogicModule.UmbraVirtualMethods.InputSimulator(Target);

       
    }

}
};

let FilterResolvers = {
  'Focus':UmbraFilterFocusEndResolver,
  'InverseFocus':UmbraFilterInverseFocusEndResolver,
  'Hide':UmbraFilterHideEndResolver,

};
function UmbraFilterFocusEndResolver(Diagram,Target){
let BluePrint = UmbraBlueprintsStorage[Diagram];
let TargetBluePrint = UmbraBlueprintsStorage[Target];
let SearchArea = UmbraDOM.GetChilds(TargetBluePrint.SearchArea);
   
for(let child = 0;child<SearchArea.length;child++){
let childBluePrint = UmbraBlueprintsStorage[SearchArea[child]];
let Overrides = UmbraOverridesStorage[SearchArea[child]];
let style = UmbraDismissMerge(Overrides,SearchArea[child]+'Focus');
Overrides = style;
UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(SearchArea[child],Overrides,'Overrides');

}
};

function UmbraFilterInverseFocusEndResolver(Diagram,Target){
let BluePrint = UmbraBlueprintsStorage[Diagram];
let TargetBluePrint = UmbraBlueprintsStorage[Target];
let SearchArea = UmbraDOM.GetChilds(TargetBluePrint.SearchArea);
   
for(let child = 0;child<SearchArea.length;child++){
let childBluePrint = UmbraBlueprintsStorage[SearchArea[child]];
let Overrides = UmbraOverridesStorage[SearchArea[child]];
let style = UmbraDismissMerge(Overrides,SearchArea[child]+'InverseFocus');
Overrides = style;
UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(SearchArea[child],Overrides,'Overrides');

}
};


function UmbraFilterHideEndResolver(Diagram,Target){
let BluePrint = UmbraBlueprintsStorage[Diagram];
let TargetBluePrint = UmbraBlueprintsStorage[Target];
let SearchArea = UmbraDOM.GetChilds(TargetBluePrint.SearchArea);
   
for(let child = 0;child<SearchArea.length;child++){
let childBluePrint = UmbraBlueprintsStorage[SearchArea[child]];
let Overrides = UmbraOverridesStorage[SearchArea[child]];
let style = UmbraDismissMerge(Overrides,SearchArea[child]+'Hide');
Overrides = style;
UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(SearchArea[child],Overrides,'Overrides');

}
};

function UmbraFilterChangerResolver(Diagram,Target,Filter){
let BluePrint = UmbraBlueprintsStorage[Diagram];
let TargetBluePrint = UmbraBlueprintsStorage[Target];
if(FilterResolvers[Filter]){
FilterResolvers[Filter](Diagram,Target);
};

};

function UmbraClearOverrides(ElementId,Window='Main'){
    delete UmbraCoreBrute.UmbraDOM.OverridesStyles[ElementId];
delete UmbraCoreBrute.UmbraDOM.Windows[Window].OverridesStyles[ElementId];
}



function UmbraNewAnimation(Id,AnimationConfig){
    AnimationConfig.Id = Id;
    if(AnimationConfig.Pc && UmbraCoreBrute.ClientPlataform() == 'Pc'){
   AnimationConfig = {Id:AnimationConfig.Id,...AnimationConfig.Pc};
    }else if(AnimationConfig.Mobile && UmbraCoreBrute.ClientPlataform() == 'Mobile'){
  AnimationConfig = {Id:AnimationConfig.Id,...AnimationConfig.Mobile};
    }
    UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id] = AnimationConfig;
    if(AnimationConfig.AwaitFlag){
        UmbraCoreBrute.UmbraDOM.AnimationsFlags[AnimationConfig.AwaitFlag] = true;
    }
}


let UmbraMetricsAnimations = [
    'left',
    'marginLeft',
    'marginTop',
    'right',
    'top',
    'bottom',
    'fontSize',
    'height',
    'width',
    'borderRadius',

]

let UmbraNoMetricsAnimations = [
    'opacity',
    'scale',
];

let UmbraRGBAAnimations = [
    'backgroundColor',
]

let UmbraNoInterpolateAnimations = [
    'display',

]
function UmbraAnimationsSpeedCalc(AnimationConfig,Element,Win){
    let DeclaredTime = AnimationConfig.Time;

        for(let Prop in AnimationConfig.Properties){
            if(UmbraMetricsAnimations.includes(Prop) || UmbraNoMetricsAnimations.includes(Prop)){
        let NewSpeed = 0;
        let StartValue = AnimationConfig.Properties[Prop].StartIn;
        let FinalValue = AnimationConfig.Properties[Prop].EndIn;
        if(FinalValue == 'Actual'){
            if(typeof UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop] == 'object'
                 && !Array.isArray(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop])){
                     let ClientPlataform = UmbraCoreBrute.ClientPlataform();
                    if(typeof UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][ClientPlataform] == 'object' && 
                        !Array.isArray(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][ClientPlataform])
                    ){
                        if(ClientPlataform == 'Mobile'){
                            let Orientation = UmbraCoreBrute.WindowOrientantion();
                            if(Array.isArray(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][ClientPlataform][Orientation])){
                        if(UmbraCoreBrute.ClientTheme() == 'Dark'){
                             FinalValue = parseFloat(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][ClientPlataform][Orientation][1]);
                             }
                         if(UmbraCoreBrute.ClientTheme() == 'Light'){
                             FinalValue = parseFloat(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][ClientPlataform][Orientation][0]);
                            }
                            }else{
                                FinalValue = parseFloat(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][ClientPlataform][Orientation]);
                            }
                        }
                    }else{
              
               if(Array.isArray(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][ClientPlataform])){
                let ClientTheme = UmbraCoreBrute.ClientTheme();
                if(ClientTheme == 'Dark'){
                    FinalValue = parseFloat(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][ClientPlataform][1]);
                }
                  if(ClientTheme == 'Light'){
                    FinalValue = parseFloat(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][ClientPlataform][0]);
                }
               }else{
                 FinalValue = parseFloat(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][ClientPlataform]);
               
               }
            }}else if(typeof UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop] == 'string'){
            FinalValue = parseFloat(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop]);
            }else if(Array.isArray(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop])){
                let ClientTheme = UmbraCoreBrute.ClientTheme();
                if(ClientTheme == 'Dark'){
                    FinalValue = parseFloat(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][1]);
                }
                  if(ClientTheme == 'Light'){
                    FinalValue = parseFloat(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][0]);
                }
            }
            AnimationConfig.Properties[Prop].EndIn = FinalValue;
        }
         if(StartValue == 'Actual'){
           if(typeof UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop] == 'object'
                 && !Array.isArray(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop])){
               let ClientPlataform = UmbraCoreBrute.ClientPlataform();
               if(Array.isArray(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][ClientPlataform])){
                let ClientTheme = UmbraCoreBrute.ClientTheme();
                if(ClientTheme == 'Dark'){
                   StartValue = parseFloat(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][ClientPlataform][1]);
                }
                  if(ClientTheme == 'Light'){
                   StartValue = parseFloat(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][ClientPlataform][0]);
                }
               }else{
                StartValue = UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][ClientPlataform];
               }
            }else if(typeof UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop] == 'string'){
           StartValue = parseFloat(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop]);
            }else if(Array.isArray(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop])){
                let ClientTheme = UmbraCoreBrute.ClientTheme();
                if(ClientTheme == 'Dark'){
                    StartValue = parseFloat(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][1]);
                }
                  if(ClientTheme == 'Light'){
                    StartValue = parseFloat(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element].Style[Prop][0]);
                }
            }
            AnimationConfig.Properties[Prop].EndIn = StartValue;
        }
       
        let ValuesDiff = FinalValue - StartValue;  
      
        AnimationConfig.Properties[Prop].Speed = ValuesDiff;
    }
    else if(UmbraRGBAAnimations.includes(Prop)){
    
  let StartInColor = AnimationConfig.Properties[Prop].StartIn;
  let EndInColor = AnimationConfig.Properties[Prop].EndIn;
  let ColorValues = [];
  if(StartInColor.length == EndInColor.length){
  for(let i=0;i<StartInColor.length;i++){
    ColorValues.push(EndInColor[i] - StartInColor[i]);
  };
    AnimationConfig.Properties[Prop].Speed = ColorValues;
}

    };
        }
        return AnimationConfig;
    }

function UmbraActiveAnimation(Id,Element,Window='Main'){
 
    UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id].State = 'Active';
    
        let NewAnimationObj = structuredClone(UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id]);
        NewAnimationObj = UmbraAnimationsSpeedCalc(NewAnimationObj,Element);
        
        let DeclaredTime = NewAnimationObj.Time;
        let DeclaredFrameRate = NewAnimationObj.FrameRate;
        let DeclaredRepeat = NewAnimationObj.Repeat;
        

         if(Object.keys(UmbraCoreBrute.UmbraDOM.ElementsAnimations).includes(Element)){
            for(let Animation in UmbraCoreBrute.UmbraDOM.ElementsAnimations[Element]){
           //   return;
                delete UmbraCoreBrute.UmbraDOM.ActiveAnimations[UmbraCoreBrute.UmbraDOM.ElementsAnimations[Element][Animation]];
               delete UmbraCoreBrute.UmbraDOM.Windows[Window].ActiveAnimations[UmbraCoreBrute.UmbraDOM.ElementsAnimations[Element][Animation]];
            }
           }
        for(let Prop in NewAnimationObj.Properties){
            if(UmbraNoInterpolateAnimations.includes(Prop)){
              //  UmbraCoreBrute.UmbraDOM.Windows[Window].DeclaredStyles[Prop] = Prop.StartIn;
              //  UmbraUI.UmbraApplyStyle(Element,{Prop:Prop.StartIn},'Declared',true,false,Window)
            }
            
            NewAnimationObj.Properties[Prop] = {...NewAnimationObj.Properties[Prop],
                'RealStartIn':NewAnimationObj.Properties[Prop].StartIn,
                 'FixedStartIn':NewAnimationObj.Properties[Prop].StartIn,
                'FrameRateController':structuredClone(DeclaredFrameRate),
                'Window':Window,
                'Time':DeclaredTime,'Repeat':DeclaredRepeat,'FrameRate':DeclaredFrameRate,'PropertieName':Prop,

            }
            if(NewAnimationObj.OnInit){

                for(let InitProp in NewAnimationObj.OnInit){
                                  
                     UmbraCoreBrute.UmbraDOM.Windows[Window].DeclaredStyles[Element].Style[InitProp] = NewAnimationObj.OnInit[InitProp];
                };
            };
            if(UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id].OnEnd){
            NewAnimationObj.Properties[Prop]['OnEnd'] = UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id].OnEnd;
            }
            if(UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id].PingPong){
              NewAnimationObj.Properties[Prop]['PingPong'] = true;
                   NewAnimationObj.Properties[Prop]['PingPongState'] = 'Linear';
            };
            if(UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id].Curve){
                NewAnimationObj.Properties[Prop]['Curve'] = structuredClone(UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id].Curve);
            }
             if(UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id].AwaitFlag){
                  NewAnimationObj.Properties[Prop]['AwaitFlag'] = structuredClone(UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id].AwaitFlag);
            UmbraCoreBrute.UmbraDOM.AnimationsFlags[UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id].AwaitFlag] = false;
          }
           NewAnimationObj.Properties[Prop].StartTime = performance.now();

          

           if(UmbraCoreBrute.UmbraDOM.ElementsAnimations[Element]){
            UmbraCoreBrute.UmbraDOM.ElementsAnimations[Element].push(Id+Element+Prop);
           }else{
            UmbraCoreBrute.UmbraDOM.ElementsAnimations[Element] = [];
               UmbraCoreBrute.UmbraDOM.ElementsAnimations[Element].push(Id+Element+Prop);
           }
           

            UmbraCoreBrute.UmbraDOM.ActiveAnimations[Id+Element+Prop] = {AnimationConfig:NewAnimationObj.Properties[Prop],
                Element:Element,Id:Id};

                  UmbraCoreBrute.UmbraDOM.Windows[Window].ActiveAnimations[Id+Element+Prop] = {AnimationConfig:NewAnimationObj.Properties[Prop],
                Element:Element,Id:Id};
         
            
        }

        
        


}

function UmbraDeleteAnimation(Id){
     delete UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id];
}

function UmbraTurnOffAnimation(){

}

function UmbraAnimationRender(AnimationConfig,Element,Id){
    
       
    let Win = UmbraMultiWindows.Get(AnimationConfig.Window);
       Win.console.warn('Rodando Animação')
    if(!Win.document.getElementById(Element)){
    delete UmbraCoreBrute.UmbraDOM.ActiveAnimations[Id + Element + AnimationConfig.PropertieName];
     delete UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].ActiveAnimations[Id + Element + AnimationConfig.PropertieName];
    return;
    }

 
    
    
    let FrameRateController = AnimationConfig.FrameRateController;
    let Speed = AnimationConfig.Speed;
    let StartValue = parseFloat(AnimationConfig.StartIn);
    let EndValue = parseFloat(AnimationConfig.EndIn);
    let Now = performance.now();
    let EnlapsedTime = Now - AnimationConfig.StartTime;
    let Time = EnlapsedTime / UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id].Time;
    Time = Math.min(Time,1);
    let Repeat = AnimationConfig.Repeat;
    let FrameRate = AnimationConfig.FrameRate;
    let ActualValue = parseFloat(StartValue);
    let Metric = null;
    let RepeatControler = Repeat;
    if(AnimationConfig.PingPong){
        if(AnimationConfig.PingPongState == 'Linear'){
            StartValue = parseFloat(AnimationConfig.FixedStartIn);
             EndValue = parseFloat(AnimationConfig.EndIn);
             AnimationConfig.RealStartIn =  parseFloat(AnimationConfig.FixedStartIn);
        }else if(AnimationConfig.PingPongState == 'Inverse'){
        StartValue = AnimationConfig.EndIn;
       EndValue = AnimationConfig.FixedStartIn;
         AnimationConfig.RealStartIn = AnimationConfig.EndIn;
        }
    }
   // let DeltaFrameRate = UmbraCoreBrute.UmbraTime.DeltaFrameRate;
     
    
    //if(DeltaFrameRate <= 0){
       // console.error( 'reser')
        //  AnimationConfig.FrameRateController = structuredClone(AnimationConfig.FrameRate);
    //}
   // if(AnimationConfig.FrameRateController <= 0){return;};
   //AnimationConfig.FrameRateController -= 1;
       if(UmbraMetricsAnimations.includes(AnimationConfig.PropertieName)){
        Metric = AnimationConfig.Metric;
        }
        if(UmbraNoMetricsAnimations.includes(AnimationConfig.PropertieName)){
         Metric = 'NoMetric';
        }

          if(UmbraRGBAAnimations.includes(AnimationConfig.PropertieName)){
         Metric = 'ColorMetric';
        }

    if(Metric != null){
        if(Metric == 'ColorMetric'){
 if(AnimationConfig.Curve){    
    ActualValue = [];
 for(let i=0;i<AnimationConfig.RealStartIn.length;i++){

ActualValue.push(UmbraInterpolationEngine(AnimationConfig.RealStartIn[i],EndValue[i],Time,AnimationConfig.Curve));
 }
}else{
    ActualValue = [];
 for(let i=0;i<AnimationConfig.RealStartIn.length;i++){

ActualValue.push(AnimationConfig.RealStartIn[i] + Speed * Time);
}
}
        }else{
        if(AnimationConfig.Curve){       
       ActualValue = UmbraInterpolationEngine(AnimationConfig.RealStartIn,EndValue,Time,AnimationConfig.Curve);
        }else{
        ActualValue = AnimationConfig.RealStartIn + Speed * Time;
        }
    }
    }

    

    if(Time >= 1){

        if(AnimationConfig.Repeat > 0 || Repeat == 'Infinity'){
            if(Repeat != 'Infinity'){
            AnimationConfig.Repeat -= 1;
            }
            if(AnimationConfig.PingPong){
                if(AnimationConfig.PingPongState == 'Linear'){
                    AnimationConfig.PingPongState = 'Inverse';
                }else if(AnimationConfig.PingPongState == 'Inverse'){
                    AnimationConfig.PingPongState = 'Linear';
                }
            }
            AnimationConfig.StartTime = Now;
            ActualValue = AnimationConfig.StartValue;
            
             
        }else{
            //ActualValue = EndValue;
  
            UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id].State = 'Off';
            if(AnimationConfig.OnEnd){
             for(let EndProp in AnimationConfig.OnEnd){
               
                UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element].Style[EndProp] = AnimationConfig.OnEnd[EndProp];
                  UmbraUI.UmbraApplyStyle(Element,{backgroundColor:'red'},'Declared',true,AnimationConfig.Window);
             };
            };
            if(UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id].AwaitFlag){
                
                UmbraCoreBrute.UmbraDOM.AnimationsFlags[UmbraCoreBrute.UmbraDOM.AnimationsNexus[Id].AwaitFlag] = true;
            }
        
            delete UmbraCoreBrute.UmbraDOM.ActiveAnimations[Id + Element + AnimationConfig.PropertieName];
              delete UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].ActiveAnimations[Id + Element + AnimationConfig.PropertieName];
            delete UmbraCoreBrute.UmbraDOM.ElementsAnimations[Element];


        }
    }
    if(Metric != null){

        AnimationConfig.StartIn = ActualValue;
    if(Metric == 'NoMetric'){
  UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName] = String(ActualValue);

    }else if(Metric == 'ColorMetric'){
       // alert(`rgba(${ActualValue[0]},${ActualValue[1]},${ActualValue[2]},${ActualValue[3]})`)
     UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName] = `rgba(${ActualValue[0]},${ActualValue[1]},${ActualValue[2]},${ActualValue[3]})`;
    }else if(Metric != 'NoMetric' && Metric != 'ColorMetric'){
        if(typeof UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName] == 'object' && 
            !Array.isArray(UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName])){
          if(UmbraCoreBrute.ClientPlataform() == 'Mobile'){
            if(typeof UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName]['Mobile'] == 'object' &&
                   !Array.isArray(UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName]['Mobile'])
            ){
              
             let ClientOrientation = UmbraCoreBrute.WindowOrientantion();
             if(Array.isArray(UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName]['Mobile'][ClientOrientation])){
          let ClientTheme = UmbraCoreBrute.ClientTheme() == 'Dark'? 1:0;
             UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName]['Mobile'][ClientOrientation][ClientTheme] = ActualValue + Metric;
             }else{
             UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName]['Mobile'][ClientOrientation] = ActualValue + Metric;
             }
            }else if(Array.isArray(UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName]['Mobile'])){
            let ClientTheme = UmbraCoreBrute.ClientTheme() == 'Dark'? 1:0;
             UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName]['Mobile'][ClientTheme] = ActualValue + Metric;
            }else if(typeof UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName]['Mobile'] == 'string'){
              UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName]['Mobile'] = ActualValue + Metric;  
            }
          }else if(UmbraCoreBrute.ClientPlataform() == 'Pc'){
               if(Array.isArray(UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName]['Pc'])){
             let ClientTheme = UmbraCoreBrute.ClientTheme() == 'Dark'? 1:0;
             UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName]['Pc'][ClientTheme] = ActualValue + Metric;
               }else{
                 UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName]['Pc'] = ActualValue + Metric;
               }
          }
        }else if(typeof UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName] == 'string' && 
            !Array.isArray(UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName])){
    UmbraCoreBrute.UmbraDOM.Windows[AnimationConfig.Window].DeclaredStyles[Element]['Style'][AnimationConfig.PropertieName] = ActualValue + Metric;
        }
    }
    UmbraUI.UmbraApplyStyle(Element,{backgroundColor:'red'},'Declared',true,AnimationConfig.Window);

    }


    
    
 

    


}

function UmbraAnimationLoop(Window){
    for(let Animation in UmbraCoreBrute.UmbraDOM.Windows[Window.name]?.ActiveAnimations){
        try{
            if(UmbraCoreBrute.UmbraDOM.Windows[Window.name].ActiveAnimations[Animation]){
    UmbraAnimationRender( UmbraCoreBrute.UmbraDOM.Windows[Window.name].ActiveAnimations[Animation].AnimationConfig,
    UmbraCoreBrute.UmbraDOM.Windows[Window.name].ActiveAnimations[Animation].Element,UmbraCoreBrute.UmbraDOM.Windows[Window.name].ActiveAnimations[Animation]?.Id )
    }    
}catch(e){
        console.error(e,UmbraCoreBrute.UmbraDOM.ActiveAnimations[Animation]?.Id);
    }
    }


   Window.requestAnimationFrame(()=>{UmbraAnimationLoop(Window)});
 

  }

UmbraAnimationLoop(window);

function UmbraAnimationRenderMetrics(){

}

const UmbraCurves = {
 'Ease-In':UmbraEaseInCurve,
 'Ease-Out':UmbraEaseOutCurve,
  'Ease-Out+':UmbraEaseOutPlusCurve,
    'Ease-Out-Smooth':UmbraEaseOutSmoothCurve,
  'Ease-In-Out':UmbraEaseInOutCurve
};

function UmbraInterpolationEngine(start, end, t, curve) {
    let easedT = curve && UmbraCurves[curve]
        ? UmbraCurves[curve](t)
        : t;

    return start + (end - start) * easedT;
}

function UmbraEaseInCurve(t){

    return t*t; 


}

function UmbraEaseOutCurve(t){

  return 1 - Math.pow(1 - t, 2);

}

function UmbraEaseOutSmoothCurve(t){

  return 1 - Math.pow(1 - t, 5);

}

function UmbraEaseInOutCurve(t) {
    return t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function UmbraEaseOutPlusCurve(t){
  const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}


function UmbraUpdateActiveDOM(){
    for(let Win in UmbraCoreBrute.UmbraDOM.Windows){
        let document = UmbraMultiWindows.Get(Win).document;
let AllElements = structuredClone(UmbraCoreBrute.UmbraDOM.Windows[Win].ActiveElements);
AllElements.push('Body');
console.warn('All Childs Body:',AllElements);

for(let i = 0;i<AllElements.length;i++){
let Element = UmbraCoreBrute.UmbraDOM.Windows[Win].Blueprints[AllElements[i]];
    
    if((!document.getElementById(AllElements[i]) || !UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[AllElements[i]].Style) && AllElements[i] != "Body"){
        continue;
    }
    UmbraCoreBrute.UmbraDOM.UiModule.UmbraApplyStyle(
        AllElements[i],structuredClone(UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[AllElements[i]].Style),
        'Declared',false,true,Win);
};
};
}

function VisibilityChangeControl(){
if(UmbraCoreBrute.ClientPlataform() == 'Mobile'){
    UmbraDOM.UpdateActiveDOM();
}
if(UmbraCoreBrute.ClientPlataform() == 'Pc'){
  if(UmbraCoreBrute.LastClientTheme() != UmbraCoreBrute.ClientTheme()){
    UmbraDOM.UpdateActiveDOM();
    let NewTheme = UmbraCoreBrute.ClientTheme();
    UmbraCoreBrute.LastClientTheme = ()=>{NewTheme};
  }
}

};




screen.orientation.addEventListener('change',UmbraDOM.UpdateActiveDOM);
document.addEventListener('visibilitychange',VisibilityChangeControl);
