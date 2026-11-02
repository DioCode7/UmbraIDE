//Imports
import { UmbraTranslationsNexus,UmbraAnimations, UmbraListenersControl,UmbraDOMControl,
    UmbraComponentRender,UmbraRender,UmbraCore,UmbraAwaitFlag,
    UmbraScenes,UmbraGlobalStorage,UmbraGlobalFunctionsControl,VirtualUmbra,
    Umbra
 } from "../../Umbra/Umbra.js";


//Vars


let SignInStepsDispatcher = {
    1:async ()=>{
     UmbraAnimations.Active("SignInActiveContainerLeaveAnimation","SignInActiveContainer",window.name);
     await UmbraAwaitFlag(()=>UmbraCore.UmbraDOM.AnimationsFlags["SignInActiveContainerLeaveAnimation"]);
       UmbraGlobalStorage.Storaged("SignInEmail",{
        Value:document.getElementById("SignInActiveContainerInput").value,
    });
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
       UmbraGlobalStorage.Storaged("SignInPassword",{
        Value:document.getElementById("SignInActiveContainerInput").value,
    });
     UmbraGlobalStorage.Storaged("SignInPasswordConfirm",{
        Value:document.getElementById("SignInActiveContainerConfirmPasswordInput").value,
    });
     UmbraDOMControl.Delete('SignInActiveContainer',false,window.name);
     UmbraComponentRender("SignInSceneContainer",
        {'SignInActiveContainer':{
        Id:"SignInActiveContainer",
        Preset:"SignInWizardStepThree",

    }},false,window.name);
     UmbraAnimations.Active("SignInActiveContainerEntryAnimation","SignInActiveContainer",window.name);
    
    },

     3:async ()=>{
     UmbraAnimations.Active("SignInActiveContainerLeaveAnimation","SignInActiveContainer",window.name);
     await UmbraAwaitFlag(()=>UmbraCore.UmbraDOM.AnimationsFlags["SignInActiveContainerLeaveAnimation"]);
      UmbraGlobalStorage.Storaged("SignInUserName",{
        Value:document.getElementById("SignInActiveContainerInput").value,
    });
     UmbraDOMControl.Delete('SignInActiveContainer',false,window.name);
     console.log("SignInData",UmbraGlobalStorage.Get("SignInEmail").Value,
     UmbraGlobalStorage.Get("SignInPassword").Value,
     UmbraGlobalStorage.Get("SignInPasswordConfirm").Value,
    UmbraGlobalStorage.Get("SignInUserName").Value); 

   VirtualUmbra.Click("SignInFetch",window.name);
    
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

     3:async ()=>{
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


UmbraListenersControl.Add("SignInFetch",{
UseFn:true,
 UmbraFetch:{
      Route:'SignInProtocol',
      Method:'POST',
      
      Data:async()=>({
        UserName:UmbraGlobalStorage.Get("SignInUserName").Value,
        Email:UmbraGlobalStorage.Get("SignInEmail").Value,
        Password:UmbraGlobalStorage.Get("SignInPassword").Value,
        ConfirmPassword:UmbraGlobalStorage.Get("SignInConfirmPassword").Value,

    }),
  
    }
});