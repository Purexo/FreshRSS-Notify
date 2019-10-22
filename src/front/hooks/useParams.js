import browser from "webextension-polyfill";

import {useEffect, useReducer} from 'react';

import {
  EVENT_INPUT_OPTION_CHANGE, EVENT_INPUT_OPTION_REFRESH_TIME_CHANGE,
  EVENT_OBTAIN_PARAMS,
  EVENT_REQUEST_PARAMS, PARAM_REFRESH_TIME,
  PARAM_URL_API
} from "../../both/constants";

function reducerParams(state, action) {
  if (action.type === EVENT_OBTAIN_PARAMS) return action.data;
  
  if (action.type === PARAM_URL_API && !action.value.endsWith('/')) action.value += '/';
  
  browser.runtime
    .sendMessage({name: EVENT_INPUT_OPTION_CHANGE, [action.type]: action.value})
    .then(
      () => action.type === PARAM_REFRESH_TIME
        && browser.runtime.sendMessage({name: EVENT_INPUT_OPTION_REFRESH_TIME_CHANGE})
    )
    .catch(console.error);
  
  return {...state, [action.type]: action.value};
}

export default function useParams() {
  const [state, dispatch] = useReducer(reducerParams, {});
  
  useEffect(() => { // communication des params du back vers le front
    const onObtainParams = ({name = undefined, ...data}) => {
      if (name !== EVENT_OBTAIN_PARAMS) return;
      
      dispatch({type: EVENT_OBTAIN_PARAMS, data});
    };
    
    browser.runtime.onMessage.addListener(onObtainParams); // écoute la récupération des params
    browser.runtime.sendMessage({name: EVENT_REQUEST_PARAMS}).catch(console.error); // demande les params
    
    return () => browser.runtime.onMessage.removeListener(onObtainParams); // nettoie le listener au démontage du hook
  }, []);
  
  return [state, dispatch];
}