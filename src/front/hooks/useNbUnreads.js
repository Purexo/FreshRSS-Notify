import browser from "webextension-polyfill";

import {useEffect, useState} from 'react';
import {EVENT_OBTAIN_NBUNREADS, EVENT_REQUEST_NBUNREADS} from "../../both/constants";
import useCache from "./useCache";

export default function useNbUnreads() {
  const {cache, isLoading} = useCache();
  const [nbUnreads, setNbUnreads] = useState(0);
  
  useEffect(() => {
    setNbUnreads(cache.unreads || 0);
    
    if (isLoading) return;
    if (Object.prototype.hasOwnProperty.call(cache, 'unreads')) return;
    
    // communication des params du back vers le front
    const onObtainUnreads = ({name = undefined, nbunreads}) => {
      if (name !== EVENT_OBTAIN_NBUNREADS) return;
      
      setNbUnreads(nbunreads);
    };
    
    browser.runtime.onMessage.addListener(onObtainUnreads); // écoute la récupération des params
    browser.runtime.sendMessage({name: EVENT_REQUEST_NBUNREADS}).catch(console.error); // demande les params
    
    return () => browser.runtime.onMessage.removeListener(onObtainUnreads); // nettoie le listener au démontage du hook
  }, [isLoading]);
  
  return nbUnreads;
}