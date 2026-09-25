//Imports

import { UmbraCoreBrute,UmbraNexusBrute } from "./Core.js"


//Variáveis
let UmbraDeclaredStyles = UmbraCoreBrute.UmbraDOM.DeclaredStyles;
let UmbraAbsoluteStyles = UmbraCoreBrute.UmbraDOM.AbsoluteStyles;
let UmbraComputedStyles = UmbraCoreBrute.UmbraDOM.ComputedStyles;
let UmbraOverridesStyles = UmbraCoreBrute.UmbraDOM.OverridesStyles;
//Funções

export function UmbraApplyStyle(Element,Style,Type,UmbraSync = false,TextSync=false,Window='Main'){
    
  if(Element == 'Document'){
    Element = 'Body';
  }

  if(!UmbraCoreBrute.UmbraDOM.OverridesStyles[Element]){
    UmbraCoreBrute.UmbraDOM.OverridesStyles[Element] = {};
  }

  if(!UmbraCoreBrute.UmbraDOM.Windows[Window].OverridesStyles[Element]){
    UmbraCoreBrute.UmbraDOM.Windows[Window].OverridesStyles[Element] = {};
  }

    if(!UmbraSync){
    if(Type == "Overrides"){
        RegistUmbraDOM.Overrides(Element,structuredClone(Style),Window);
        for(let Prop in UmbraCoreBrute.UmbraDOM.OverridesStyles[Element]){
        if(!UmbraCoreBrute.UmbraDOM.Windows[Window].DeclaredStyles?.[Element].Style[Prop]){
         UmbraCoreBrute.UmbraDOM.Windows[Window].DeclaredStyles[Element].Style[Prop] = '';
        }
    }
    }
    if(Type == 'Declared'){
        if(Element != "Document" && Element != 'Body'){
        let ParentTree = UmbraSimpleParentTreeMaker(Element,Window);
        RegistUmbraDOM.Declared(Element,structuredClone(Style),ParentTree,Window);
        RegistUmbraDOM.Computed(Element,structuredClone(Style),ParentTree,Window);
        UmbraParentTreeMaker(Element,ParentTree);
        }else{
   RegistUmbraDOM.Declared(Element,structuredClone(Style),null,Window);
        RegistUmbraDOM.Computed(Element,structuredClone(Style),null,Window);
        }
    }
    }

    let ElementDOM;
   


       let Win = UmbraCoreBrute.UmbraDOM.UiModule.UmbraMultiWindows.Get(Window);
       
  
    if(Element == 'Body'){
    ElementDOM = Win.document.body; 
    }else if(Element == 'Document'){
        ElementDOM = Win.document.body;
    }else if(Element != 'Body' && Element != 'Document'){
     ElementDOM = Win.document.getElementById(Element);
    }

    if(!ElementDOM){
        return;
    }
   
     let ComputedStyle = UmbraCoreBrute.UmbraDOM.Windows[Win.name].ComputedStyles[Element].Style;
   Style = structuredClone(UmbraCoreBrute.UmbraDOM.Windows[Win.name].DeclaredStyles[Element].Style);
   
    for(let Prop in Style){
        if(UmbraCoreBrute.UmbraDOM.Windows[Win.name].OverridesStyles?.[Element]?.[Prop]){
            Style[Prop] = UmbraCoreBrute.UmbraDOM.Windows[Win.name].OverridesStyles[Element][Prop];
        }
  
        
         
        if(typeof Style[Prop] == 'object' && !Array.isArray(Style[Prop])){
            if(typeof Style[Prop][UmbraCoreBrute.ClientPlataform()] == 'object' && !Array.isArray(Style[Prop][UmbraCoreBrute.ClientPlataform()])){
             let ClientPlataform = UmbraCoreBrute.ClientPlataform();
             if(ClientPlataform == 'Mobile'){
                 let Orientation = UmbraCoreBrute.WindowOrientantion();
                if(Array.isArray(Style[Prop][ClientPlataform][Orientation])){
                     let Theme = UmbraCoreBrute.ClientTheme();                
         if(Theme == 'Dark'){ 
           ComputedStyle[Prop] = Style[Prop][UmbraCoreBrute.ClientPlataform()][Orientation][1];
         }else if(Theme == 'Light'){
             ComputedStyle[Prop] = Style[Prop][UmbraCoreBrute.ClientPlataform()][Orientation][0];
         }
                }else{
                ComputedStyle[Prop] = Style[Prop][ClientPlataform][Orientation];
                }
             }
            }else{
              if(Array.isArray(Style[Prop][UmbraCoreBrute.ClientPlataform()])){
                 let Theme = UmbraCoreBrute.ClientTheme();
         if(Theme == 'Dark'){ 
          ComputedStyle[Prop] = Style[Prop][UmbraCoreBrute.ClientPlataform()][1];
         }else if(Theme == 'Light'){
             ComputedStyle[Prop] = Style[Prop][UmbraCoreBrute.ClientPlataform()][0];
         }
        }else if(typeof Style[Prop] == 'string'){
            ComputedStyle[Prop] = Style[Prop];
           ComputedStyle[Prop]= Style[Prop][UmbraCoreBrute.ClientPlataform()];
        }else if(typeof Style[Prop][UmbraCoreBrute.ClientPlataform()] == 'string'){
            ComputedStyle[Prop] = Style[Prop][UmbraCoreBrute.ClientPlataform()];
        }
            
        }}else{
        if(Array.isArray(Style[Prop])){
           
    let Theme = UmbraCoreBrute.ClientTheme();   
          
         if(Theme == 'Dark'){ 
           ComputedStyle[Prop] = Style[Prop][1];
         }else if(Theme == 'Light'){
              ComputedStyle[Prop] = Style[Prop][0];
         }
        }else if(typeof Style[Prop] == 'string'){
          
            ComputedStyle[Prop] = Style[Prop];
        }
    }
}

UmbraApplyDOM(Element,ElementDOM,Win.name);
    if(TextSync){
        UmbraTextSync(Element,Window);
    }

}

async function UmbraTextSync(Element,Window){
  let BluePrint = UmbraCoreBrute.UmbraDOM.BluePrints[Element];
  if(!BluePrint){
    return;
  };
  if(BluePrint.Text){
   let Text = await UmbraTextResolver(BluePrint.Text);
    UmbraApplyText(Element,Text,Window);
  }


}

async function UmbraTextResolver(Text){
  if(typeof Text == 'string'){
    return Text;
  }
  if(typeof Text == 'function'){
    return await Text();
  }
  if(typeof Text == 'object'){
    if(Text.ReactiveText){
        return await UmbraCoreBrute.UmbraDOM.UmbraReactiveText[Text.ReactiveText]();
    }
    if(Text.Translation){
        return Text.Translation[UmbraCoreBrute.ClientLanguage()];
    }
  }
};

function UmbraApplyText(Element,Text,Window){
 let DOM = UmbraCoreBrute.UmbraDOM.UiModule.UmbraMultiWindows.Get(Window).document.getElementById(Element);
 if(DOM){
    DOM.innerText = Text;
 }
};

export function UmbraApplyDOM(Id,ElementDOM,Window){
 let ComputedStyle = UmbraCoreBrute.UmbraDOM.Windows[Window].ComputedStyles[Id].Style;
 if(ComputedStyle){
    for(let Prop in ComputedStyle){
     
        ElementDOM.style[Prop] = ComputedStyle[Prop];
    }
 }

};

let RegistUmbraDOM = {
    Declared:RegistDeclaredUmbraDOM,
    Absolute:RegistAbsoluteUmbraDOM,
    Computed:RegistComputedUmbraDOM,
    Overrides:RegistOverridesUmbraDOM,
}

function RegistDeclaredUmbraDOM(Element,Style,ParentTree,Window){
 let Win = 'Main';
if(Window != null){
Win = Window;
};
if(UmbraCoreBrute.UmbraDOM.DeclaredStyles[Element]){
    if(UmbraCoreBrute.UmbraDOM.DeclaredStyles[Element].Window){
        UmbraCoreBrute.UmbraDOM.DeclaredStyles[Element].Style = Style;
         UmbraCoreBrute.UmbraDOM.DeclaredStyles[Element].ParentTree = ParentTree; 
    }else{
   UmbraCoreBrute.UmbraDOM.DeclaredStyles[Element] = {Style:Style,ParentTree:ParentTree,Window:Win};
    }
}else{
  UmbraCoreBrute.UmbraDOM.DeclaredStyles[Element] = {Style:Style,ParentTree:ParentTree,Window:Win};
}

UmbraCoreBrute.UmbraDOM.Windows[Win].DeclaredStyles[Element] = {Style:Style,ParentTree:ParentTree,Window:Win};
 
}

function RegistAbsoluteUmbraDOM(Element,Style){
     UmbraCoreBrute.UmbraDOM.AbsoluteStyles[Element] = Style;
    
}

function RegistOverridesUmbraDOM(Element,Style,Window){
     UmbraCoreBrute.UmbraDOM.OverridesStyles[Element] = Style;
         UmbraCoreBrute.UmbraDOM.Windows[Window].OverridesStyles[Element] = Style;
}

function RegistComputedUmbraDOM(Element,Style,ParentTree,Window){
     let Win = 'Main';
if(Window != null){
Win = Window;
};
     UmbraCoreBrute.UmbraDOM.ComputedStyles[Element] = {Style:Style,ParentTree:ParentTree,Window:Win};
UmbraCoreBrute.UmbraDOM.Windows[Win].ComputedStyles[Element] = {Style:Style,ParentTree:ParentTree,Window:Win};

}


function UmbraParentTreeMaker(Element,ParentTree){

    if(Element != "Document" && Element != "Body"){
    let ActualParent = document.getElementById(Element)?.parentElement;
    if(ActualParent == document.documentElement){
        ActualParent = "Document";
    }
    if(ActualParent == document.body){
        ActualParent = "Body";
    }

    let ActualTree = UmbraCoreBrute.UmbraDOM.UmbraTree;


    function ParentTreeLoop(LinearTree,Element){
        for(let i = 0;i<LinearTree.length;i++){
            if(LinearTree[i+1]){
    if(ActualTree[LinearTree[i]]){
        ActualTree = ActualTree[LinearTree[i]];
    }
    else{
   ActualTree[LinearTree[i]] = {};
   ActualTree = ActualTree[LinearTree[i]];
    }
    }else{
   ActualTree[LinearTree[i]] = {};
    };
}
}

    ParentTreeLoop(ParentTree,Element);


    }
}

function UmbraSimpleParentTreeMaker(Element,Window){
    let Win = UmbraCoreBrute.UmbraDOM.UiModule.UmbraMultiWindows.Get(Window);
    Win.console.log('ID Teste:',Element);
   let ActualParent = Win.document.getElementById(Element)?.parentElement;
   let ParentTreeList = [];
   
   
   
   function SimpleParentTreeLoop(ActualParentId){
    if(ActualParent == Win.document.documentElement){
    ActualParentId = "Document";

   }
   else if(ActualParent == Win.document.body){
    ActualParentId = "Body";
   }
   else if(ActualParent != Win.document.body && ActualParent != Win.document.documentElement && ActualParent){
    ActualParentId = ActualParent.id;
   }

     ParentTreeList.push(ActualParentId);
     if(Win.document.getElementById(ActualParentId)?.parentElement){
      ActualParent = Win.document.getElementById(ActualParentId).parentElement;
      SimpleParentTreeLoop(ActualParent);
     }

   }
   ParentTreeList.push(Element);
   SimpleParentTreeLoop(ActualParent);
   ParentTreeList.reverse();
   return ParentTreeList;
}




UmbraNexusBrute.Set(["UmbraDOM","UiModule"],{UmbraApplyStyle:UmbraApplyStyle});
