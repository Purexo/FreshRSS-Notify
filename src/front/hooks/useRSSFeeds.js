import browser from "webextension-polyfill";

import {useEffect, useState} from 'react';
import {EVENT_OBTAIN_RSS, EVENT_REQUEST_RSS} from "../../both/constants";
import useCache from "./useCache";

function imSetMap(map, key, value) {
  if (map.has(key) && map.get(key) === value) return map;
  
  return new Map(map).set(key, value);
}

export default function useRSSFeeds() {
  const {cache, isLoading} = useCache();
  const [feeds, setFeeds] = useState(new Map());
  
  useEffect(() => { // communication des params du back vers le front
    setFeeds(cache.rss || new Map());
  
    if (isLoading) return;
    if (Object.prototype.hasOwnProperty.call(cache, 'rss')) return;
    
    const onObtainRSS = ({name = undefined, id, rss}) => {
      if (name !== EVENT_OBTAIN_RSS) return;
  
      setFeeds(feeds => imSetMap(feeds, id, rss));
    };
    
    browser.runtime.onMessage.addListener(onObtainRSS); // écoute la récupération des params
    browser.runtime.sendMessage({name: EVENT_REQUEST_RSS}).catch(console.error); // demande les params
    
    return () => browser.runtime.onMessage.removeListener(onObtainRSS); // nettoie le listener au démontage du hook
  }, [isLoading]);
  
  return feeds;
}