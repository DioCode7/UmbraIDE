//Imports
import { UmbraTranslationsNexus,UmbraAnimations, UmbraListenersControl,UmbraDOMControl,
    UmbraComponentRender,UmbraRender,UmbraCore,UmbraAwaitFlag,
    UmbraScenes,UmbraGlobalStorage
 } from "../../Umbra/Umbra.js";


//Vars


let SignInStepsDispatcher = {
    1:async ()=>{
     UmbraAnimations.Active("SignInActiveContainerLeaveAnimation","SignInActiveContainer",window.name);
     await UmbraAwaitFlag(()=>UmbraCore.UmbraDOM.AnimationsFlags["SignInActiveContainerLeaveAnimation"]);
     UmbraDOMControl.Delete('SignInActiveContainer',false,window.name);
     UmbraComponentRender("SignInSceneContainer",
        {'SignInActiveContainer':{
        Id:"SignInActiveContainer",
        Preset:"SignInWizardStepTwo",

    }},false,window.name);
     UmbraAnimations.Active("SignInActiveContainerEntryAnimation","SignInActiveContainer",window.name);
    },

     2:async ()=>{
        alert('Step 2');
     UmbraAnimations.Active("SignInActiveContainerLeaveAnimation","SignInActiveContainer",window.name);
     await UmbraAwaitFlag(()=>UmbraCore.UmbraDOM.AnimationsFlags["SignInActiveContainerLeaveAnimation"]);
     UmbraDOMControl.Delete('SignInActiveContainer',false,window.name);
     UmbraComponentRender("SignInSceneContainer",
        {'SignInActiveContainer':{
        Id:"SignInActiveContainer",
        Preset:"SignInWizardStepTwo",

    }},false,window.name);
     UmbraAnimations.Active("SignInActiveContainerEntryAnimation","SignInActiveContainer",window.name);
    },


};


let SignInBackStepsDispatcher = {
    1:async ()=>{
     UmbraAnimations.Active("SignInActiveContainerLeaveAnimation","SignInActiveContainer",window.name);
     await UmbraAwaitFlag(()=>UmbraCore.UmbraDOM.AnimationsFlags["SignInActiveContainerLeaveAnimation"]);
     UmbraDOMControl.Delete('SignInActiveContainer',false,window.name);
     UmbraComponentRender("SignInSceneContainer",
        {'SignInActiveContainer':{
        Id:"SignInActiveContainer",
        Preset:"SignInWizardStepTwo",

    }},false,window.name);
     UmbraAnimations.Active("SignInActiveContainerEntryAnimation","SignInActiveContainer",window.name);
    },

     2:async ()=>{
     UmbraAnimations.Active("SignInActiveContainerLeaveAnimation","SignInActiveContainer",window.name);
     await UmbraAwaitFlag(()=>UmbraCore.UmbraDOM.AnimationsFlags["SignInActiveContainerLeaveAnimation"]);
     UmbraDOMControl.Delete('SignInActiveContainer',false,window.name);
     UmbraComponentRender("SignInSceneContainer",
        {'SignInActiveContainer':{
        Id:"SignInActiveContainer",
        Preset:"SignInWizardStepOne",

    }},false,window.name);
     UmbraAnimations.Active("SignInActiveContainerEntryAnimation","SignInActiveContainer",window.name);
    },


};

//Functions


UmbraListenersControl.Add("SignInNextStepListeners",{
UmbraHover:{
    Style:{
        scale:"1.1",

    }
},
UseFn:true,
Fn:()=>{
SignInStepsDispatcher[UmbraGlobalStorage.Get("SignInStep").Value]?.();
UmbraGlobalStorage.Storaged("SignInStep",{
    Value: UmbraGlobalStorage.Get("SignInStep").Value + 1,

});
},



});


UmbraListenersControl.Add("SignInBackStepListeners",{
UmbraHover:{
    Style:{
        scale:"1.1",

    }
},
UseFn:true,
Fn:()=>{
SignInBackStepsDispatcher[UmbraGlobalStorage.Get("SignInStep").Value]?.();
UmbraGlobalStorage.Storaged("SignInStep",{
    Value: UmbraGlobalStorage.Get("SignInStep").Value - 1,
    
});
},



});