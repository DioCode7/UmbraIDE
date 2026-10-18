import { UmbraTranslationsNexus,UmbraAnimations, UmbraListenersControl,UmbraDOMControl,
    UmbraComponentRender,UmbraRender,
    UmbraScenes,UmbraGlobalStorage
 } from "../../Umbra/Umbra.js";

//Imports


//Vars

UmbraGlobalStorage.Storaged("SignInStep",{
    Value:1,
});

UmbraGlobalStorage.Storaged("SignInAttribs",{
    Email:"Null",
    Password:"Null",
    ConfirmPassword:"Null",
    UserName:"Null",
});

export let SignInSceneLayout_Blueprint = {
Parent:"SignInSceneContainer",
MainContainers:{
    SignInActiveContainer:{
        Id:"SignInActiveContainer",
        Preset:"SignInWizardStepOne",
        
    },
}
};



//Functions

