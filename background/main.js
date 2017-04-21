function getAutoRefreshTime() {
  // TODO get from options
  return Promise.resolve(15);
}

function runAutoRefreshAlarm() {
  adapter.alarms.clear(LOOP_AUTO_REFRESH)
    .then(cleared => getAutoRefreshTime())
    .then(periodInMinutes => browser.alarms.create(LOOP_AUTO_REFRESH, {periodInMinutes}))
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

manager.addListener(LOOP_AUTO_REFRESH, runAutoRefreshAlarm)();
manager.addListener(INPUT_OPTION_CHANGE, ({message, sender, sendResponse}) => {
  const param = message.param;
  const keys = {
    [param.name]: param.value
  };
  
  browser.storage.local.set(keys);
  browser.storage.sync.set(keys);
});