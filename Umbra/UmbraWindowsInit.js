import {UmbraLogicCore} from './UmbraLogic.js';
import { UmbraCoreBrute } from "./Core.js";
import { UmbraTranslationsNexus,UmbraCore, UmbraApplyStyles, UmbraNetworkControl,UmbraClassesControl,UmbraPresetsControl, UmbraListenersControl, UmbraScenes, UmbraNexus, Languages, UmbraGlobalStorage, UmbraPopUps, UmbraAnimations } from "./Umbra.js";
import { UmbraDOM } from "./UmbraUI.js";


UmbraLogicCore(window.document,window);
let Monarch = window.opener;
console.warn('Monarch',Monarch.Umbral);
console.warn('Genesis',Monarch.Umbral.Genesis);

let Genesis = [];
if(Array.isArray(Monarch.Umbral.Genesis)){
for(let i = 0;i<Monarch.Umbral.Genesis.length;i++){
    let GenesisAtom = await import(Monarch.Umbral.Genesis[i]);
    Genesis.push(GenesisAtom);
}
}else{
Genesis = await import(Monarch.Umbral.Genesis);
}
console.warn('Monarch',Monarch.Umbral);
if(Array.isArray(Genesis)){
for(let i = 0;i<Genesis.length;i++){

    if(Genesis[i].UmbraTurn){
    Genesis[i].UmbraTurn();
    }
}
}else{
Genesis.UmbraTurn();
}
console.warn('UmbraCore',UmbraCoreBrute);

   

