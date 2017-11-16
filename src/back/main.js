const manager = new EventsManager(true);

function resetAutoRefreshAlarm(runNow = true) {
  browser.alarms.clear(EVENT_LOOP_AUTO_REFRESH)
    .then(cleared => getAutoRefreshTime())
    .then(periodInMinutes => browser.alarms.create(EVENT_LOOP_AUTO_REFRESH, {
      periodInMinutes
    }))
    .catch(err => console.error(err));
  
  runNow && manager.fire(EVENT_LOOP_AUTO_REFRESH);
}

const API = new RssApi();
cache = {
  rss: undefined,
  unreads: undefined,
  params: undefined
};

/**
 * simple routing alarm
 *
 * Map alarm to EventManager system
 */
browser.alarms.onAlarm.addListener(alarm => {
  manager.fire(alarm.name, alarm);
});

browser.runtime.onMessage.addListener(({name='', ...data}, sender, sendResponse) => {
  console.log(`BACK_RUNTIME_ONMESSAGE: ${name} with `, data, sender);
  
  if (!name) return;
  manager.fire(name, data, sendResponse);
  
  return true;
});

manager.addListener(EVENT_REQUEST_NBUNREADS, async (name, data, sendResponse) => {
  const nbunreads = API.auth ? await API.getNbUnreads() : await API.connect().then(_ => API.getNbUnreads());
  
  cache.unreads = nbunreads;
  sendResponse(nbunreads);
});

/**
 * auto refresh loop.
 * 1. Will connect if necessary
 * 2. fetch flux
 * 3. display them in panel
 */
manager.addListener(EVENT_LOOP_AUTO_REFRESH, async (name, data, sendResponse) => {
  const [prefs, nbunreads] = await Promise.all([
    getParameters(),
    API.auth ? API.getNbUnreads() : API.connect().then(_ => API.getNbUnreads())
  ]);
  
  cache.unreads = nbunreads;
  browser.runtime.sendMessage({name: EVENT_OBTAIN_NBUNREADS, nbunreads});
  
  const totalFxToFetch = prefs[PARAM_NB_FETCH_ITEMS];
  const unreadToFetch = clamp(nbunreads, 0, totalFxToFetch);
  const readToFetch = totalFxToFetch - unreadToFetch;
  
  const [results] = Promise.all([
    API.getStreamsContent({nb: unreadToFetch}),
    API.getStreamsContent({
      nb: readToFetch,
      startIndex: unreadToFetch,
      filter: ['xt', 'user/-/state/com.google/unread'],
      isRead: true
    })
  ]);
  
  results.forEach(data => {
    cache.rss = cache.rss || new Map();
    
    data.forEach(rss => {
      cache.rss.set(rss.id, rss);
      browser.runtime.sendMessage({name: EVENT_OBTAIN_RSS, rss});
    });
  });
  
  browser.browserAction.setBadgeText({text: `${nbunreads}`});
  browser.browserAction.setIcon({path: 'Assets/img/icon.png'});
  browser.browserAction.setBadgeBackgroundColor({
    color: nbunreads > 0 ? (NOTIFICATIONS[NOTIFICATION_REFRESH_SUCCESS].create(), 'red') : 'green'
  });
});

manager.addListener(EVENT_REQUEST_RSS, ({data: {runNow}}) => {
  resetAutoRefreshAlarm(runNow);
});

/**
 * User have typed new options
 * store it in storage
 */
manager.addListener(
  EVENT_INPUT_OPTION_CHANGE,
  ({data: {name, value}}) => saveInStorage({[name]: value})
);

/**
 * Request params option from client page
 * get them from auto storage
 * normalyze them
 * and fire them with EVENT_OBTAIN_PARAMS event
 */
manager.addListener(EVENT_REQUEST_PARAMS, () => {
  getParameters()
    .then(params => {
      cache.params = params;
      browser.runtime.sendMessage({name: EVENT_OBTAIN_PARAMS, params});
    })
    .catch(err => console.error(err));
});

/**
 * Check server url
 */
manager.addListener(EVENT_INPUT_OPTION_SERVER_CHECK, ({data: {[PARAM_URL_MAIN]: url_main, [PARAM_URL_API]: url_api}}) => {
  get.text(url_main)
    .then(response => {
      console.log(response.text);
      
      NOTIFICATIONS[NOTIFICATION_SERVER_CHECK_SUCCESS].create();
    })
    .catch(error => {
      console.error(error);
  
      NOTIFICATIONS[NOTIFICATION_SERVER_CHECK_FAIL].create();
    });
  
  get.text(url_api)
    .then(result => console.log(result.text))
    .catch(error => console.error(error));
});

/**
 * Check credentials
 */
manager.addListener(EVENT_INPUT_OPTION_CREDENTIALS_CHECK, () => {
  API.connect()
    .then(token => {
      console.log(`TOKEN: ${token}`);
      
      NOTIFICATIONS[NOTIFICATION_CREDENTIALS_CHECK_SUCCESS].create();
      
      // we get a tokem, so reset the autorefresh loop
      resetAutoRefreshAlarm(false);
    })
    .catch(err => {
      console.log(err);
      NOTIFICATIONS[NOTIFICATION_CREDENTIALS_CHECK_FAIL].create();
    })
});

syncParameters()
  .then(resetAutoRefreshAlarm);