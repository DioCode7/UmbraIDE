//Imports
import {Umbra, UmbraCore, UmbraScenes} from "./Umbra/Umbra.js"
import "./Files/Classes/UmbraClasses.js"
import "./Files/Translations/LoginTranslations.js"
import { LoginSceneTrigger } from "./Files/ScenesTriggers.js"


//Vars




//Functions
document.addEventListener("DOMContentLoaded",()=>{
    window.name = "Main";
    Umbra.Genesis(["../Main.js"]);
    LoginSceneTrigger()    

});
