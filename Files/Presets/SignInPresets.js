//Imports
import { UmbraPresetsControl,UmbraTranslationsNexus } from "../../Umbra/Umbra.js";
import "../Classes/UmbraClasses.js"
//Vars


//Functions

UmbraPresetsControl.Create("SignInWizardStepOne",{
    Id:"SignInActiveContainer",
        Type:'div',
        UmbraClass:["BasicContainerClass"],
        Style:{
        width:"800px",
        flexDirection:"column",
        height:"400px",
        boxShadow:["rgba(0,0,0,0.3) 0px 0px 10px","rgba(0,0,0,0.3) 0px 0px 10px" ],
        marginTop:"50vh",
        marginLeft:"50%",
        transform:"translate(-50%,-50%)",
        backgroundColor:["rgb(245,245,245)","rgb(9,9,9)"],

        
        },
        Childs:{
            UmbraLogo:{
             Id:"UmbraLogo",
              Type:"div",
            UmbraClass:["AverageUmbraLogoClass"],
            Style:{
                position:"absolute",
                marginTop:"5px",
                marginLeft:"95%",
                width:"70px",
                height:"70px",

        },
            },
            SignInActiveContainerTitle:{
                Id:"SignInActiveContainerTitle",
                Type:'div',
                UmbraClass:["BasicTextClass"],
                Style:{
                fontSize:"1.5rem",
                marginTop:"40px",
                marginLeft:"5%",
                width:"95%"
                },
                Text:UmbraTranslationsNexus.Get("SignInActiveContainerTitleTranslation"),
            },

            SignInActiveContainerText:{
                Id:"SignInActiveContainerText",
                Type:'div',
                UmbraClass:["BasicSmallTextClass"],
                Style:{
                fontSize:"0.9rem",
                marginLeft:"5%",
                marginTop:"52px",
                width:"95%",
                
                },
                Text:UmbraTranslationsNexus.Get("SignInActiveContainerTextTranslation"),
            },

            SignInActiveContainerInput:{
             Id:"SignInActiveContainerInput",
             Type:'input',
             AutoComplete:'off',
             Style:{
                marginLeft:"5%",
                marginTop:"52px",
                 boxShadow:["rgba(0,0,0,0.3) 0px 0px 10px","rgba(0,0,0,0.3) 0px 0px 10px" ],
                 width:"300px",
             },
             UmbraClass:["BasicInputClass"],
            },

            SignInActiveContainerButton:{
                Id:"SignInActiveContainerButton",
                Type:'div',
                Style:{
                  marginLeft:"5%",
                marginTop:"52px",
                 boxShadow:["rgba(0,0,0,0.3) 0px 0px 10px","rgba(0,0,0,0.3) 0px 0px 10px" ],
                 width:"150px",
                },
                Text:UmbraTranslationsNexus.Get("ContinueTranslation"),
                UmbraClass:["BasicButtonClass"],
                Listener:"SignInNextStepListeners",
                
            }
            
        }
    
});



UmbraPresetsControl.Create("SignInWizardStepTwo",{
    Id:"SignInActiveContainer",
        Type:'div',
        UmbraClass:["BasicContainerClass"],
        Style:{
        width:"800px",
        flexDirection:"column",
        height:"400px",
        boxShadow:["rgba(0,0,0,0.3) 0px 0px 10px","rgba(0,0,0,0.3) 0px 0px 10px" ],
        marginTop:"50vh",
        marginLeft:"50%",
        transform:"translate(-50%,-50%)",
        backgroundColor:["rgb(245,245,245)","rgb(9,9,9)"],

        
        },
        Childs:{
            UmbraLogo:{
             Id:"UmbraLogo",
              Type:"div",
            UmbraClass:["AverageUmbraLogoClass"],
            Style:{
                position:"absolute",
                marginTop:"5px",
                marginLeft:"95%",
                width:"70px",
                height:"70px",

        },
            },
            SignInActiveContainerTitle:{
                Id:"SignInActiveContainerTitle",
                Type:'div',
                UmbraClass:["BasicTextClass"],
                Style:{
                fontSize:"1.5rem",
                marginTop:"40px",
                marginLeft:"5%",
                width:"95%"
                },
                Text:UmbraTranslationsNexus.Get("SignInActiveContainerTitle2Translation"),
            },

            SignInActiveContainerText:{
                Id:"SignInActiveContainerText",
                Type:'div',
                UmbraClass:["BasicSmallTextClass"],
                Style:{
                fontSize:"0.9rem",
                marginLeft:"5%",
                marginTop:"40px",
                width:"95%",
                
                },
                Text:UmbraTranslationsNexus.Get("SignInActiveContainerTwoTextTranslation"),
            },

            SignInActiveContainerInput:{
             Id:"SignInActiveContainerInput",
             Type:'input',
             AutoComplete:'off',
             Style:{
                marginLeft:"5%",
                marginTop:"10px",
                 boxShadow:["rgba(0,0,0,0.3) 0px 0px 10px","rgba(0,0,0,0.3) 0px 0px 10px" ],
                 width:"300px",
             },
             UmbraClass:["BasicInputClass"],
            },

              SignInActiveContainerText2:{
                Id:"SignInActiveContainerText2",
                Type:'div',
                UmbraClass:["BasicSmallTextClass"],
                Style:{
                fontSize:"0.9rem",
                marginLeft:"5%",
                marginTop:"27px",
                width:"95%",
                
                },
                Text:UmbraTranslationsNexus.Get("SignInActiveContainerTwoText2Translation"),
            },

             SignInActiveContainerConfirmPasswordInput:{
             Id:"SignInActiveContainerConfirmPasswordInput",
             Type:'input',
             AutoComplete:'off',
             Style:{
                marginLeft:"5%",
                marginTop:"10px",
                 boxShadow:["rgba(0,0,0,0.3) 0px 0px 10px","rgba(0,0,0,0.3) 0px 0px 10px" ],
                 width:"300px",
             },
             UmbraClass:["BasicInputClass"],
            },


            SignInActiveContainerButton:{
                Id:"SignInActiveContainerButton",
                Type:'div',
                Style:{
                  marginLeft:"5%",
                marginTop:"52px",
                 boxShadow:["rgba(0,0,0,0.3) 0px 0px 10px","rgba(0,0,0,0.3) 0px 0px 10px" ],
                 width:"150px",
                },
                Text:UmbraTranslationsNexus.Get("ContinueTranslation"),
                UmbraClass:["BasicButtonClass"],
                Listener:"SignInNextStepListeners",
                
            },

              SignInActiveContainerBackButton:{
                Id:"SignInActiveContainerBackButton",
                Type:'div',
                Style:{
                  marginLeft:"30px",
                marginTop:"40px",
                 width:"20px",
                 fontSize:"0.9rem",
                 textAlign:"start",

                },
                Text:UmbraTranslationsNexus.Get("BackTranslation"),
                UmbraClass:["SimpleTextButtonClass"],
                Listener:"SignInBackStepListeners",
        
                
            },


        
            
        }
    
});