//Imports

import { Umbra,UmbraAnimations } from "../../Umbra/Umbra.js";


//Vars


//Functions
UmbraAnimations.New("LoginHeroPhraseAnimation",{
Pc:{
      Properties:{
    marginLeft:{
        StartIn:-100,
        EndIn:'Actual',
        Metric:'%'
    },  
      opacity:{
      StartIn:0,
      EndIn:1,
      
    },
    width:{
      StartIn:0,
      EndIn:"Actual",
      Metric:'%'
    }
  },
    

   Repeat:0,
   Time:1000,
   FrameRate:60,
   Curve:'Ease-Out-Smooth',
  },

});

