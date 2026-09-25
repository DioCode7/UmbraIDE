//Imports
import {UmbraCoreBrute,UmbraNexusBrute} from "./Core.js";

//Variáveis
export const UmbraTranslationsCore = {
    Add:AddNewTranslation,
    Remove:RemoveTranslation,
    Get:GetTranslation,
};


let LanguagesObj = {
      'Pt-Br': {
        Sigla: 'Pt-Br',
        Idioma: 'Português',
        LanguageNavigator:'pt-BR'
    },
    'En': {
        Sigla: 'En',
        Idioma: 'English',
        LanguageNavigator:'en-Us'
    },
    'Esp': {
        Sigla: 'Esp',
        Idioma: 'Español',
        LanguageNavigator:'es-ES'
    },
    'Rus': {
        Sigla: 'Rus',
        Idioma: 'Русский',
        LanguageNavigator:'ru-RU'

    },
    'Ger': {
        Sigla: 'Ger',
        Idioma: 'Deutsch', 
        LanguageNavigator:'de-DE'
    },
    'Chi': {
        Sigla: 'Chi',
        Idioma: '中文',
        LanguageNavigator:'zh-CN'
    },
    'Jap': {
        Sigla: 'Jap',
        Idioma: '日本語',
        LanguageNavigator:'ja-JP'
    }
    
  }
//Funções

function AddNewTranslation(TranslationId,TranslationObj){
    let TranslationBank = {};
    TranslationBank[TranslationId] = TranslationObj;
 UmbraNexusBrute.Update("UmbraTranslations",TranslationBank);

}


function RemoveTranslation(TranslationId){
    if(UmbraCoreBrute.UmbraTranslations[TranslationId]){
        delete UmbraCoreBrute.UmbraTranslations[TranslationId];
    }
};

function GetTranslation(TranslationId){
    let Language = UmbraCoreBrute.ClientLanguage();
    console.warn('Lang',Language)
    let Traduction = UmbraCoreBrute.UmbraTranslations[TranslationId][Language];
    return {Translation:UmbraCoreBrute.UmbraTranslations[TranslationId]};
};

UmbraNexusBrute.Update(['UmbraDOM','UiModule'],{UmbraTranslationsCore:UmbraTranslationsCore});
