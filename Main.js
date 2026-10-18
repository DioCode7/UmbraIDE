//Imports
import {Umbra, UmbraCore, UmbraScenes,UmbraApplyStyles} from "./Umbra/Umbra.js"
import "./Files/Classes/UmbraClasses.js"
import "./Files/Translations/LoginTranslations.js"
import "./Files/Translations/SignInTranslations.js"
import "./Files/Translations/GlobalTranslations.js"
import "./Files/Animations/LoginAnimations.js"
import "./Files/Animations/SignInAnimations.js"
import "./Files/Presets/SignInPresets.js"
import "./Files/Listeners/SignInListeners.js"
import { LoginSceneTrigger } from "./Files/ScenesTriggers.js"
import { SignInSceneTrigger } from "./Files/ScenesTriggers.js"


//Vars


let WindowsDispatcher = {
    "Main":MainWindowInitProtocol,
    "SignInWindow":SignInWindowInitProtocol,
}



//Functions
console.log('UmbraCore',UmbraCore);

   
   WindowsDispatcher[window.name]?.();
       
  Umbra.Genesis(["../Main.js"]);



function MainWindowInitProtocol(){

    LoginSceneTrigger(); 
};

function SignInWindowInitProtocol(){
    SignInSceneTrigger();
    UmbraApplyStyles("Body",{
        "width":"100%",
    "height":"100%",
    "overflowX": "hidden",
    "margin":"0",
    "padding":"0",
    },
"Declared",false,false,window.name);
};

