function getAutoRefreshTime() {
  return adapter.storage.auto.get(PARAM_REFRESH_TIME)
    .then(param => param[PARAM_REFRESH_TIME] || DEFAULT_PARAMS[PARAM_REFRESH_TIME]);
}

function runAutoRefreshAlarm() {
  adapter.alarms.clear(EVENT_LOOP_AUTO_REFRESH)
    .then(cleared => getAutoRefreshTime())
    .then(periodInMinutes => browser.alarms.create(EVENT_LOOP_AUTO_REFRESH, {periodInMinutes}))
    .catch(err => console.error(err));
}

// simple routing alarm
browser.alarms.onAlarm.addListener(alarm => {
  manager.fire(alarm.name, alarm);
});

manager.addListener(EVENT_LOOP_AUTO_REFRESH, runAutoRefreshAlarm)();
manager.addListener(EVENT_INPUT_OPTION_CHANGE, ({data: {name, value}}) => {
  const keys = {
    [name]: value
  };
  
  adapter.storage.auto.set(keys);
});

function normalyzeParams(params) {
  const checkedParams = Object.assign({}, DEFAULT_PARAMS, params);
  
  let persist = false;
  for (let name of STORAGE_GET_ALL_PARAMS) {
    if (checkedParams[name] != params[name]) {
      persist = true;
      break;
    }
  }
  
  if (persist) {
    adapter.storage.auto.set(checkedParams);
  }
  
  return checkedParams;
}

manager.addListener(EVENT_REQUEST_PARAMS, () => {
  adapter.storage.local.get(STORAGE_GET_ALL_PARAMS)
    .then(normalyzeParams)
    .then(params => manager.fire(EVENT_OBTAIN_PARAMS, params));
});