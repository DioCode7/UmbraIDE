import { UmbraTranslationsNexus } from "../../Umbra/Umbra.js";

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
            //backgroundImage:["url(./Files/Images/LoginHeroImage.png)","url(./Files/Images/LoginHeroImageDark.png)"],
            
        }
    },
    LoginHeroPhrase:{
        Id:"LoginHeroPhrase",
        Type:"div",
        UmbraClass:["BasicTitleClass"],
        Style:{
            maxWidth:"80%",
            height:"auto",
            marginLeft:"10%",
            marginTop:"15%",
            fontSize:"1.6rem",
            color:["rgb(0, 0, 0)","rgb(255, 255, 255)"],
    },
    Text:UmbraTranslationsNexus.Get("LoginHeroPhraseTranslation"),
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
      flexDirection:"column",
      backgroundColor:["rgb(240,240,240)","rgb(5,5,5)"],
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
                marginTop:"60px",
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
                marginTop:"60px",
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
                marginTop:"70px",
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

    },
},
    },



};

//Functions