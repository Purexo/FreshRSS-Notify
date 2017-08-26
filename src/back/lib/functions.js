/**
 * Created by Purexo on 07/05/2017.
 */

function getAutoRefreshTime () {
  return browser.storage.local.get(PARAM_REFRESH_TIME)
    .then(param => param[PARAM_REFRESH_TIME] || DEFAULT_PARAMS[PARAM_REFRESH_TIME]);
}

function saveInStorage (params) {
  browser.storage.local.set(params);
  browser.storage.sync.set(params);
}

function shouldSavaParams (checkedParams, oldParams) {
  let persist = false;
  
  for (let name of STORAGE_GET_ALL_PARAMS) {
    if (checkedParams[name] != oldParams[name]) {
      persist = true;
      break;
    }
  }
  
  return persist;
}

function normalyzeParams (params) {
  const checkedParams = Object.assign({}, DEFAULT_PARAMS, params);
  
  if (shouldSavaParams(checkedParams, params)) {
    saveInStorage(checkedParams);
  }
  
  return checkedParams;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function PromiseWaitAll(promises) {
  return new Promise(function (resolve, reject) {
    if (typeof promises[Symbol.iterator] !== 'function') {
      reject('promises should be an Iterable of Promise');
    }
    let count = promises.length || typeof promises.size;
    const results = new Map();
    
    // iterate over iterable
    // array not work with [index, value] array.entries() did
    const iterator = typeof promises.entries == 'function' ? promises.entries() : promises;
    for (let [index, promise] of iterator) {
      let handler = data => {
        results.set(index, data);
        if (--count == 0) {
          resolve(results);
        }
      };
      
      if (promise instanceof Promise) {
        promise.then(handler);
        promise.catch(handler);
      } else {
        handler(promise);
      }
    }
  });
}