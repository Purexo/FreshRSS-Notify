import browser from "webextension-polyfill";

import {useEffect, useReducer} from 'react';

function cacheReducer(state, action) {
  if (action.type === 'fulfilled') {
    return {cache: action.cache, isLoading: false, error: null};
  }
  if (action.type === 'rejected') return {cache: {}, isLoading: false, error: action.error};
  
  return state;
}

export default function useCache() {
  const [{cache, isLoading, error}, dispatch] = useReducer(cacheReducer, {
    cache: {},
    isLoading: true,
    error: null,
  });
  
  useEffect(() => {
    browser.runtime.getBackgroundPage()
      .then(window => window.cache)
      .then(cache => dispatch({type: 'fulfilled', cache}))
      .catch(error => dispatch({type: 'rejected', error}))
  }, []);
  
  return {cache, isLoading, error};
}