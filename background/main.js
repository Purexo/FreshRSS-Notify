function getAutoRefreshTime() {
  // TODO get from options
  return adapter.storage.local.get(PARAM_REFRESH_TIME)
    .then(param => param[PARAM_REFRESH_TIME]);
}

function runAutoRefreshAlarm() {
  adapter.alarms.clear(EVENT_LOOP_AUTO_REFRESH)
    .then(cleared => getAutoRefreshTime())
    .then(periodInMinutes => browser.alarms.create(EVENT_LOOP_AUTO_REFRESH, {periodInMinutes}))
    .catch(err => console.error(err));
}

// simple routing alarm
browser.alarms.onAlarm(alarm => {
  manager.fire(alarm.name, alarm);
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.name) {
    manager.fire(message.name, {message, sender, sendResponse});
  }
});

manager.addListener(EVENT_LOOP_AUTO_REFRESH, runAutoRefreshAlarm)();
manager.addListener(EVENT_INPUT_OPTION_CHANGE, ({message, sender, sendResponse}) => {
  const param = message.param;
  const keys = {
    [param.name]: param.value
  };
  
  browser.storage.local.set(keys);
  browser.storage.sync.set(keys);
});

manager.addListener(EVENT_REQUEST_PARAMS, () => {
  adapter.storage.local.get(STORAGE_GET_ALL_PARAMS)
    .then(params => browser.runtime.sendMessage({name: EVENT_OBTAIN_PARAMS, params}));
});