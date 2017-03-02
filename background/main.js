function getAutoRefreshTime() {
  // TODO get from options
  return Promise.resolve(15);
}

const ALARM_AUTO_REFRESH = 'auto-refresh';
function runAutoRefreshAlarm() {
  browser.alarms.clear(ALARM_AUTO_REFRESH)
    .then(cleared => getAutoRefreshTime())
    .then(periodInMinutes =>
      browser.alarms.create(ALARM_AUTO_REFRESH, {periodInMinutes})
    )
    .catch(err => console.error(err))
    ;
}

browser.alarms.onAlarm(alarm => {
  switch (alarm.name) {
    case ALARM_AUTO_REFRESH:
      // TODO refresh flux
      break;
    default:
      console.log(alarm, 'is not listened');
  }
});