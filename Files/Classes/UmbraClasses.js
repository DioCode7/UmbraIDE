//Imports

import { UmbraClassesControl } from "../../Umbra/Umbra.js";


//Vars





//Functions

UmbraClassesControl.Create("BasicContainerClass",{
    display:"flex",
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    
    
});


UmbraClassesControl.Create("BasicBackgroundImageClass",{
    backgroundSize:"cover",
    backgroundPosition:"center",
    backgroundRepeat:"no-repeat",
});

UmbraClassesControl.Create("BasicTitleClass",{
    fontFamily:"'Poppins', sans-serif",
    fontWeight:"600",
    textAlign:"start",
    lineHeight:"3rem",
    userSelect:"none",
    letterSpacing:"3px",
    textShadow:["0px 0px 5px rgba(0, 0, 0, 0.5)","0px 0px 5px rgba(255, 255, 255, 0.5)"],
    color:["rgb(0, 0, 0)","rgb(255, 255, 255)"],
});

UmbraClassesControl.Create("AverageUmbraLogoClass",{
    width:"200px",
    height:"200px",
    backgroundSize:"contain",
    backgroundPosition:"center",
    userSelect:"none",
    backgroundRepeat:"no-repeat",
    transform:"translate(-50%, 0%)",
    backgroundImage:"url('../../Assets/AverageUmbraLogo.png')",
});

UmbraClassesControl.Create("UmbraTitleClass",{
  fontFamily:"'Poppins', sans-serif",
    fontWeight:"600",
    textAlign:"Start",
    fontSize:"2rem",
    userSelect:"none",
    lineHeight:"4rem",
    letterSpacing:"10px",
    transform:"translate(-48%, 0%)",
    textAlign:"center",
    textShadow:["0px 0px 5px rgba(0, 0, 0, 0.5)","0px 0px 5px rgba(255, 255, 255, 0.5)"],
    color:["rgb(0, 0, 0)","rgb(255, 255, 255)"],
}
);

UmbraClassesControl.Create("BasicInputClass",{
    padding:"10px",
    borderRadius:"4px",
    outline:"none",
    textAlign:"center",
    border:"none",
    boxShadow:"none",
    fontSize:"1rem",
    color:["rgb(0, 0, 0)","rgb(255, 255, 255)"],
    width:"250px",
    height:"10px",
    backgroundColor:["rgb(255, 255, 255)","rgb(12, 12, 12)"],
    
});

UmbraClassesControl.Create("BasicTextClass",{
    fontFamily:"'Poppins', sans-serif",
    fontWeight:"300",
    textAlign:"start",
    lineHeight:"1rem",
    userSelect:"none",
    letterSpacing:"2px",
    textShadow:["0px 0px 5px rgba(0, 0, 0, 0.5)","0px 0px 5px rgba(255, 255, 255, 0.5)"],
    color:["rgb(0, 0, 0)","rgb(255, 255, 255)"],
});


UmbraClassesControl.Create("BasicSmallTextClass",{
    fontFamily:"'Poppins', sans-serif",
    fontWeight:"300",
    textAlign:"start",
    lineHeight:"1rem",
    userSelect:"none",
    letterSpacing:"2px",
    textShadow:["0px 0px 5px rgba(0, 0, 0, 0.5)","0px 0px 5px rgba(255, 255, 255, 0.5)"],
    color:["rgb(17, 17, 17)","rgb(255, 255, 255)"],
});

UmbraClassesControl.Create("BasicButtonClass",{
    UmbraMerge:["BasicTextClass"],
    textAlign:"center",
    justifyContent:"center",
    alignItems:"center",
    display:"flex",
    borderRadius:"4px",
    width:"250px",
    height:"40px",
    backgroundColor:["rgb(222, 142, 253)","rgb(21, 0, 44)"],
    outline:"none",
    border:"none",
    boxShadow:"none",
});


UmbraClassesControl.Create("SimpleTextButtonClass",{
    UmbraMerge:["BasicTextClass"],
    textAlign:"start",
    justifyContent:"center",
    alignItems:"center",
    display:"flex",
    backgroundColor:"rgba(0,0,0,0)",
    width:"320px",
    outline:"none",
    boxShadow:"none",
});

