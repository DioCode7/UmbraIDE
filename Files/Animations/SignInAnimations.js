//Imports

import { Umbra,UmbraAnimations } from "../../Umbra/Umbra.js";


//Vars


//Functions
UmbraAnimations.New("SignInActiveContainerLeaveAnimation",{
Pc:{
      Properties:{

    marginLeft:{
        StartIn:50,
        EndIn:150,
        Metric:'%'
    },  

      opacity:{
      StartIn:1,
      EndIn:0,
      
    },

    width:{
      StartIn:800,
      EndIn:0,
      Metric:'px'
    }
  },
    

   Repeat:0,
   Time:1000,
   FrameRate:60,
   AwaitFlag:"SignInActiveContainerLeaveAnimation",
   Curve:'Ease-Out-Smooth',
  },

});

UmbraAnimations.New("SignInActiveContainerEntryAnimation",{
Pc:{
      Properties:{

    marginLeft:{
        StartIn:-150,
        EndIn:50,
        Metric:'%'
    },  

      opacity:{
      StartIn:0,
      EndIn:1,
      
    },

    width:{
      StartIn:0,
      EndIn:800,
      Metric:'px'
    }
  },
    

   Repeat:0,
   Time:1000,
   FrameRate:60,
   Curve:'Ease-Out-Smooth',
  },

});

