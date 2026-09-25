//Imports
import {UmbraCore, UmbraScenes} from "../Umbra/Umbra.js"
import { LoginSceneLayout_Blueprint } from "./Layouts/LoginLayout.js";


//Vars




//Functions
export function LoginSceneTrigger(){
if(UmbraScenes.Verify("LoginScene")){
  UmbraScenes.Active("LoginScene");

}else{
  
UmbraScenes.New("LoginScene",LoginSceneLayout_Blueprint,{
backgroundColor:["white","rgb(12,12,12)"],
display:"flex",
width:"100vw",
height:"100vh",
});

console.log(UmbraCore.UmbraDOM.Windows);
UmbraScenes.Active("LoginScene");
}
};