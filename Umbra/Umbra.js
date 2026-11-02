//Imports
import { Genesis, LanguagesObj, UmbraCoreBrute,UmbraNexusBrute } from "./Core.js";
import { UmbraApplyStyle } from "./UmbraStyles.js";
import {UmbraScenesBrute,UmbraPageRender, UmbraDOM,UmbraAnimationsCore,UmbraPresetsCore,UmbraClassesCore, UmbraMainRender,
    UmbraReactiveTextCore,
    UmbraPopUpsControl,
    UmbraOverlaysControl,
    UmbraMultiWindows
 } from "./UmbraUI.js";
import { UmbraTranslationsCore } from "./UmbraTranslations.js";
import { UmbraListeners,AwaitFlag,UmbraGlobalFunctionsCore, UmbraGlobalStorageCore,UmbraVirtualMethods } from "./UmbraLogic.js";
import { UmbraNetwork } from "./UmbraNetwork.js";


//Variáveis

export let UmbraCore = UmbraCoreBrute;
export let UmbraNexus = UmbraNexusBrute;
export let UmbraApplyStyles = UmbraApplyStyle;
export let UmbraScenes = UmbraScenesBrute;
export let Languages = LanguagesObj;
export let UmbraGlobalStorage = UmbraGlobalStorageCore;
export let UmbraRender = UmbraPageRender;
export let UmbraComponentRender = UmbraMainRender;
export let UmbraTranslationsNexus = UmbraTranslationsCore;
export let UmbraListenersControl = UmbraListeners;
export let UmbraDOMControl = UmbraDOM;
export let UmbraAnimations = UmbraAnimationsCore;
export let UmbraAwaitFlag = AwaitFlag;
export let UmbraNetworkControl = UmbraNetwork;
export let UmbraPresetsControl = UmbraPresetsCore;
export let UmbraClassesControl = UmbraClassesCore;
export let UmbraReactiveTextControl = UmbraReactiveTextCore;
export let UmbraWindows = UmbraMultiWindows;
export let UmbraGlobalFunctionsControl = UmbraGlobalFunctionsCore;
export let UmbraPopUps = UmbraPopUpsControl;
export let UmbraOverlays = UmbraOverlaysControl;
export let VirtualUmbra = UmbraVirtualMethods;
export const Umbra = {
    Genesis:Genesis
};

//Funções




