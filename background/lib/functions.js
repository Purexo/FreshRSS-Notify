/**
 * Created by Purexo on 07/05/2017.
 */

function getAutoRefreshTime () {
  return adapter.storage.auto.get(PARAM_REFRESH_TIME)
    .then(param => param[PARAM_REFRESH_TIME] || DEFAULT_PARAMS[PARAM_REFRESH_TIME]);
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
    adapter.storage.auto.set(checkedParams);
  }
  
  return checkedParams;
}