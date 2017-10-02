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

function shouldSaveParams (checkedParams, oldParams) {
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
  
  if (shouldSaveParams(checkedParams, params)) {
    saveInStorage(checkedParams);
  }
  
  return checkedParams;
}

function syncParameters() {
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

function getParameters() {
  return browser.storage.local.get(STORAGE_GET_ALL_PARAMS)
    .then(normalyzeParams);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function PromiseWaitAll(...promises) {
  return new Promise(function (resolve, reject) {
    let count = promises.length;
    const results = new Array(count);
    
    for (let [index, promise] of promises.entries()) {
      let handler = data => {
        results[index] = data;
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