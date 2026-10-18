//Imports
import {UmbraCore, UmbraScenes,UmbraListenersControl,UmbraWindows} from "../Umbra/Umbra.js"
import { LoginSceneLayout_Blueprint } from "./Layouts/LoginLayout.js";
import { SignInSceneLayout_Blueprint } from "./Layouts/SignInLayout.js";


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
overflow:"hidden",
});

console.log(UmbraCore.UmbraDOM.Windows);
UmbraScenes.Active("LoginScene");
}
};

export function SignInSceneTrigger(){
if(UmbraScenes.Verify("SignInScene")){
 UmbraScenes.Active("SignInScene");

}else{
  
UmbraScenes.New("SignInScene",SignInSceneLayout_Blueprint,{
backgroundColor:["white","rgb(12,12,12)"],
display:"flex",
width:"100vw",
height:"100vh",
overflow:"hidden",
});

console.log(UmbraCore.UmbraDOM.Windows);
 UmbraScenes.Active("SignInScene");

}
};



UmbraListenersControl.Add("SignInButtonListener",{
   UseFn:true,
   Fn:()=>{
        UmbraWindows.Create("SignInWindow","Umbra - SignIn");
      
}, 

  UmbraHover:{
                    Style:{
                        scale:"1.05",
                        color:'purple',
                    },
                },
},"Main");

