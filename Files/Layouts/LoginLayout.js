import { UmbraTranslationsNexus,UmbraAnimations, UmbraListenersControl,UmbraDOMControl,
    UmbraComponentRender,UmbraRender,
    UmbraScenes,
 } from "../../Umbra/Umbra.js";

//Imports


//Vars
export let LoginSceneLayout_Blueprint = {
Parent:"LoginSceneContainer",
MainContainers:{
    LoginHeroContainer:{
    Id:"LoginHeroContainer",
    Type:"div",
    UmbraClass:["BasicContainerClass"],
    Style:{
        width:"65%",
        height:"100vh",
        margin:"0",
        padding:"0",
    },
    Childs:{
    LoginHeroImage:{
        Id:"LoginHeroImage",
        Type:"div",
        UmbraClass:["BasicBackgroundImageClass"],
        Style:{
            position:"absolute",
            width:"100%",
            height:"100%",
            backgroundImage:"url('../../Assets/LoginHeroBackground.png')",
            opacity:["1",'0.3'],
        
        }
    },
    LoginHeroPhrase:{
        Id:"LoginHeroPhrase",
        Type:"div",
        UmbraClass:["BasicTitleClass"],
        Style:{
            width:"80%",
            height:"auto",
            zIndex:"2",
            marginLeft:"10%",
            marginTop:"18%",
            fontSize:"1.6rem",
            opacity:"0",
            scale:'1',
            color:["rgb(0, 0, 0)","rgb(255, 255, 255)"],
    },
    Text:UmbraTranslationsNexus.Get("LoginHeroPhraseTranslation"),
    Listener:{
    UmbraViewportLogic:{
        Action:UmbraAnimations.Active,
      Params:['LoginHeroPhraseAnimation','LoginHeroPhrase',"Main"],

    },
    }

},
}
    
    },
  LoginActiveContainer:{
    Id:"LoginActiveContainer",
    Type:"div",
    UmbraClass:["BasicContainerClass"],
    Style:{
      width:"35%",
      height:"100vh",
      zIndex:"3",
      backgroundColor:["rgb(240,240,240)","rgb(13, 13, 13)"],
      boxShadow:["-5px 0px 10px rgba(183, 107, 255, 0.5)","-5px 0px 10px rgba(67, 0, 95, 0.5)"],
    },
    Listener:{
    UmbraViewportLogic:{
        Action:UmbraAnimations.Active,
      Params:['LoginHeroPhraseAnimation','LoginActiveContainer',"Main"],

    },
    },
    Childs:{
        LoginUmbraLogo:{
            Id:"LoginUmbraLogo",
            Type:"div",
            UmbraClass:["AverageUmbraLogoClass"],
            Style:{
                marginTop:"10%",
                marginLeft:"50%",
        },
    },
      LoginUmbraTitle:{
            Id:"LoginUmbraTitle",
            Type:"div",
            UmbraClass:["UmbraTitleClass"],
            Style:{
                marginLeft:"50%",
              //  borderBottom:["1px solid rgb(0, 0, 0)","1px solid rgb(255, 255, 255)"],
            },
            Text:"Umbra",
        },

        LoginUserText:{
            Id:"LoginUserText",
            Type:"div",
            UmbraClass:["BasicTextClass"],
            Style:{
                transform:"translate(-50%, 0%)",
                marginTop:"15px",
                marginLeft:"50%",
            },
            Text:UmbraTranslationsNexus.Get("LoginUserTextTranslation"),
        },
        LoginUserInput:{
            Id:"LoginUserInput",
            Type:"input",
            UmbraClass:["BasicInputClass"],
            Style:{
                marginTop:"15px",
                marginLeft:"50%",
                transform:"translate(-50%, 0%)",
            }
        },
        LoginPasswordText:{
            Id:"LoginPasswordText",
            Type:"div",
            UmbraClass:["BasicTextClass"],
            Style:{
                 transform:"translate(-50%, 0%)",
                marginTop:"15px",
                marginLeft:"50%",
            },
            Text:UmbraTranslationsNexus.Get("LoginPasswordTextTranslation"),
            
        },
        LoginPasswordInput:{
            Id:"LoginPasswordInput",
            Type:"input",
            AutoComplete:"off",
            InputType:"password",
            UmbraClass:["BasicInputClass"],
            Style:{
                marginTop:"15px",
                marginLeft:"50%",
                transform:"translate(-50%, 0%)",
            },
        },
        LoginButton:{
            Id:"LoginButton",
            Type:"div",
            UmbraClass:["BasicButtonClass"],
            Style:{
                marginTop:"15px",
                marginLeft:"50%",
                transform:"translate(-50%, 0%)",
            },
            Text:UmbraTranslationsNexus.Get("LoginButtonTranslation"),
            Listener:{
                UmbraHover:{
                    Style:{
                        scale:"1.05",
                        marginLeft:"51%",
                    }
                }
            }
        },
        SignInText:{
            Id:"SignInText",
            Type:"div",
            UmbraClass:["BasicTextClass"],
            Style:{
                marginTop:"15px",
                marginLeft:"20px",
                pointerEvents:"none",
            },
            Text:UmbraTranslationsNexus.Get("SignInTextTranslation"),
            
        },
        SignInButton:{
            Id:"SignInButton",
            Type:"div",
            UmbraClass:["BasicTextClass"],
            Style:{
                marginTop:"15px",
                marginLeft:"20px",
                zIndex:"2"
            },

           
            Text:UmbraTranslationsNexus.Get("SignInButtonTranslation"),
            Listener:"SignInButtonListener"

        }

    },
},
    },



};
