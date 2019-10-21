/**
 * Created by Purexo on 07/05/2017.
 */

import browser from 'webextension-polyfill';
import {DEFAULT_PARAMS, PARAM_REFRESH_TIME, STORAGE_GET_ALL_PARAMS} from "../both/constants";

export function getAutoRefreshTime() {
  return browser.storage.local.get(PARAM_REFRESH_TIME)
    .then(param => param[PARAM_REFRESH_TIME] || DEFAULT_PARAMS[PARAM_REFRESH_TIME]);
}

export function saveInStorage(params) {
  browser.storage.local.set(params).catch(console.error);
  browser.storage.sync.set(params).catch(console.error);
}

export function shouldSaveParams(checkedParams, oldParams) {
  let persist = false;
  
  for (let name of STORAGE_GET_ALL_PARAMS) {
    if (checkedParams[name] !== oldParams[name]) {
      persist = true;
      break;
    }
  }
  
  return persist;
}

export function normalyzeParams(params) {
  const checkedParams = Object.assign({}, DEFAULT_PARAMS, params);
  
  if (shouldSaveParams(checkedParams, params)) {
    saveInStorage(checkedParams);
  }
  
  return checkedParams;
}

export function syncParameters() {
  return Promise.all([
    browser.storage.local.get(STORAGE_GET_ALL_PARAMS),
    browser.storage.sync.get(STORAGE_GET_ALL_PARAMS)
  ])
    .then(([local, sync]) => {
      for (let key of STORAGE_GET_ALL_PARAMS) {
        if (sync[key] === void 0) {
          sync[key] = local[key];
        }
        if (local[key] === void 0) {
          local[key] = sync[key]
        }
        
        if (sync[key] === void 0) {
          sync[key] = DEFAULT_PARAMS[key];
        }
        if (local[key] === void 0) {
          local[key] = DEFAULT_PARAMS[key]
        }
      }
      
      local = normalyzeParams(local);
      saveInStorage(local);
      
      return local;
    });
}

export function getParameters() {
  return browser.storage.local.get(STORAGE_GET_ALL_PARAMS)
    .then(normalyzeParams);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function PromiseAllSettled(...promises) {
  return Promise.all(promises.map(
    p => p
      .then(value => ({status: 'fulfilled', value}))
      .catch(reason => ({status: 'rejected', reason}))
  ));
}

export function requiredParam(method, param, message) {
  throw new TypeError(`${method} required ${param} parameter${message ? ` - ${message}` : ''}`)
}