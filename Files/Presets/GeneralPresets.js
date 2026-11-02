//Imports
import { UmbraPresetsControl,UmbraTranslationsNexus } from "../../Umbra/Umbra.js";
import "../Classes/UmbraClasses.js"

//Vars


//Functions

UmbraPresetsControl.Create("MainHeaderPreset",{
    Id:"MainHeaderPreset",
        Type:'div', 
        UmbraClass:["BasicContainerClass"],
        Style:{
            width:"100%",
            height:"70px",
            backgroundColor:["rgb(190, 121, 211)","rgb(49, 0, 39)"],
            boxShadow:"rgba(0, 0, 0, 0.3) 0px 0px 10px",
        },
        Childs:{
        UmbraLogo:{
            Id:"UmbraLogo",
            Type:"div",
            UmbraClass:["AverageUmbraLogoClass"],
            Style:{
                marginLeft:"5%",
                marginTop:"5px",
                width:"60px",
                height:"60px",
            },
        },
        UmbraTitle:{
            Id:"UmbraTitle",
            Type:"div",
            UmbraClass:["BasicSmallTextClass"],
            Style:{
                marginLeft:"-25px",
                marginTop:"32px",
                fontWeight:'600',
                fontSize:"1.6rem",
                color:["rgb(255, 255, 255)","rgb(0, 0, 0)"],
            },
            Text:"Umbra",
              } 
                 }
})