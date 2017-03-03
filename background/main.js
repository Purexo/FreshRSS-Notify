function getAutoRefreshTime() {
  // TODO get from options
  return Promise.resolve(15);
}

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
  const eventNameToFire = MAP_ALARM_TO_EVENT[alarm.name];

  if (eventNameToFire) {
      manager.fire(eventNameToFire, alarm);
  } else {
      console.log(alarm, 'is not listened');
  }
});