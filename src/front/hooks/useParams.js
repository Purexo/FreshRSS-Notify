import browser from "webextension-polyfill";

import {useEffect, useReducer} from 'react';

import {
  EVENT_INPUT_OPTION_CHANGE, EVENT_INPUT_OPTION_REFRESH_TIME_CHANGE,
  EVENT_OBTAIN_PARAMS,
  EVENT_REQUEST_PARAMS, PARAM_NB_FETCH_ITEMS, PARAM_REFRESH_TIME,
  PARAM_URL_API
} from "../../both/constants";

function signalChange(prop, value) {
  browser.runtime
    .sendMessage({name: EVENT_INPUT_OPTION_CHANGE, [prop]: value})
    .then(() => {
      if (prop !== PARAM_REFRESH_TIME) return;
      
      // alert background page that refresh time change
      return browser.runtime.sendMessage({name: EVENT_INPUT_OPTION_REFRESH_TIME_CHANGE})
    })
    .catch(console.error)
}

function reducerParams(state, action) {
  if (action.type === EVENT_OBTAIN_PARAMS)
    return action.value;
  
  // API URL Should end with slash
  if (action.type === PARAM_URL_API && !action.value.endsWith('/'))
    action.value += '/';
  
  // Refresh Time and NB Fetch Items should be number
  if ([PARAM_REFRESH_TIME, PARAM_NB_FETCH_ITEMS].includes(action.type))
    action.value = Number(action.value);
  
  // alert background page that params change
  signalChange(action.type, action.value);
  
  return {...state, [action.type]: action.value};
}

export default function useParams(reducer=reducerParams, initialState={}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  useEffect(() => { // communication des params du back vers le front
    const onObtainParams = ({name = undefined, params: value}) => {
      if (name !== EVENT_OBTAIN_PARAMS) return;
      
      dispatch({type: EVENT_OBTAIN_PARAMS, value});
    };
    
    browser.runtime.onMessage.addListener(onObtainParams); // écoute la récupération des params
    browser.runtime.sendMessage({name: EVENT_REQUEST_PARAMS}).catch(console.error); // demande les params
    
    return () => browser.runtime.onMessage.removeListener(onObtainParams); // nettoie le listener au démontage du hook
  }, []);
  
  return [state, dispatch];
}