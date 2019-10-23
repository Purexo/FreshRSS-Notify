import browser from 'webextension-polyfill';

import EventsManager from './both/EventsManager';
import * as get from './back/fetch';
import FreshRSSApi from "./back/FreshRSSApi";
import {clamp, getAutoRefreshTime, getParameters, saveInStorage, syncParameters} from "./back/functions";

import cache from "./back/cache";
import NOTIFICATIONS from "./back/NOTIFICATIONS";
import {
  EVENT_INPUT_OPTION_CHANGE, EVENT_INPUT_OPTION_CREDENTIALS_CHECK, EVENT_INPUT_OPTION_REFRESH_TIME_CHANGE,
  EVENT_INPUT_OPTION_SERVER_CHECK, EVENT_LOOP_AUTO_REFRESH, EVENT_OBTAIN_NBUNREADS, EVENT_OBTAIN_PARAMS,
  EVENT_OBTAIN_RSS, EVENT_REQUEST_NBUNREADS, EVENT_REQUEST_PARAMS, EVENT_REQUEST_RSS, EVENT_REQUEST_SWAP,
  NOTIFICATION_CREDENTIALS_CHECK_FAIL, NOTIFICATION_CREDENTIALS_CHECK_SUCCESS, NOTIFICATION_REFRESH_SUCCESS,
  NOTIFICATION_SERVER_CHECK_FAIL, NOTIFICATION_SERVER_CHECK_SUCCESS, PARAM_NB_FETCH_ITEMS, PARAM_URL_API, PARAM_URL_MAIN
} from "./both/constants";

const manager = new EventsManager(true);
window.cache = cache;

function resetAutoRefreshAlarm(runNow = true) {
  browser.alarms.clear(EVENT_LOOP_AUTO_REFRESH)
    .then(cleared => getAutoRefreshTime())
    .then(periodInMinutes => browser.alarms.create(EVENT_LOOP_AUTO_REFRESH, {
      periodInMinutes
    }))
    .catch(err => console.error(err));
  
  runNow && manager.fire(EVENT_LOOP_AUTO_REFRESH);
}

const API = new FreshRSSApi();

/**
 * simple routing alarm
 *
 * Map alarm to EventManager system
 */
browser.alarms.onAlarm.addListener(alarm => {
  manager.fire(alarm.name, alarm);
});

browser.runtime.onMessage.addListener(({name = '', ...data}) => {
  if (!name) return;
  manager.fire(name, data);
  
  return true;
});

manager.on(EVENT_REQUEST_NBUNREADS, async () => {
  const nbunreads = API.auth ? await API.getNbUnreads() : await API.connect().then(_ => API.getNbUnreads());
  
  cache.unreads = nbunreads;
  browser.runtime.sendMessage({name: EVENT_OBTAIN_NBUNREADS, nbunreads}).catch(console.error);
});

/**
 * auto refresh loop.
 * 1. Will connect if necessary
 * 2. fetch flux
 * 3. display them in panel
 */
manager.on(EVENT_LOOP_AUTO_REFRESH, async () => {
  const [prefs, nbunreads] = await Promise.all([
    getParameters(),
    API.auth ? API.getNbUnreads() : API.connect().then(() => API.getNbUnreads())
  ]);
  
  cache.unreads = nbunreads;
  browser.runtime.sendMessage({name: EVENT_OBTAIN_NBUNREADS, nbunreads}).catch(console.error);
  
  const totalFxToFetch = prefs[PARAM_NB_FETCH_ITEMS];
  const unreadToFetch = clamp(nbunreads, 0, totalFxToFetch);
  const readToFetch = totalFxToFetch - unreadToFetch;
  
  const articles = await Promise.all([
    API.getStreamsContent({nb: unreadToFetch}),
    API.getStreamsContent({
      nb: readToFetch,
      startIndex: unreadToFetch,
      filter: FreshRSSApi.EXCLUDE_UNREAD,
      isRead: true,
    })
  ]);
  
  cache.rss.clear();
  articles.reduce((res, arr) => res.concat(arr), [])
    .forEach(rss => {
      cache.rss.set(rss.id, rss);
      browser.runtime.sendMessage({name: EVENT_OBTAIN_RSS, id: rss.id, rss}).catch(console.error);
    });
  
  browser.browserAction.setBadgeText({text: `${nbunreads}`});
  browser.browserAction.setIcon({path: '/Assets/img/icon.png'}).catch(console.error);
  browser.browserAction.setBadgeBackgroundColor({
    color: nbunreads > 0 ? 'red' : 'green'
  });
  
  return nbunreads > 0 && NOTIFICATIONS[NOTIFICATION_REFRESH_SUCCESS].create({message_substitutions: `${nbunreads}`})
});

manager.on(EVENT_REQUEST_RSS, ({runNow}) => {
  resetAutoRefreshAlarm(runNow);
});

manager.on(EVENT_INPUT_OPTION_REFRESH_TIME_CHANGE, () => {
  resetAutoRefreshAlarm(false);
});

/**
 * User have typed new options
 * store it in storage
 */
manager.on(EVENT_INPUT_OPTION_CHANGE, saveInStorage);

/**
 * Request params option from client page
 * get them from auto storage
 * normalyze them
 * and fire them with EVENT_OBTAIN_PARAMS event
 */
manager.on(EVENT_REQUEST_PARAMS, () => {
  getParameters()
    .then(params => {
      cache.params = params;
      return browser.runtime.sendMessage({name: EVENT_OBTAIN_PARAMS, params});
    })
    .catch(console.error);
});

/**
 * Check server url
 */
manager.on(EVENT_INPUT_OPTION_SERVER_CHECK, ({[PARAM_URL_MAIN]: url_main, [PARAM_URL_API]: url_api}) => {
  get.text(url_main)
    .then(response => {
      NOTIFICATIONS[NOTIFICATION_SERVER_CHECK_SUCCESS].create();
    })
    .catch(error => {
      console.error(error);
      
      NOTIFICATIONS[NOTIFICATION_SERVER_CHECK_FAIL].create();
    });
  
  get.text(url_api)
    .catch(console.error);
});

/**
 * Check credentials
 */
manager.on(EVENT_INPUT_OPTION_CREDENTIALS_CHECK, () => {
  API.connect()
    .then(token => {
      NOTIFICATIONS[NOTIFICATION_CREDENTIALS_CHECK_SUCCESS].create();
      
      // we get a tokem, so reset the autorefresh loop
      resetAutoRefreshAlarm(false);
    })
    .catch(err => {
      console.log(err);
      
      NOTIFICATIONS[NOTIFICATION_CREDENTIALS_CHECK_FAIL].create();
    })
});

manager.on(EVENT_REQUEST_SWAP, ({itemid, isRead}) => {
  (API.auth ? Promise.resolve() : API.connect())
    .then(() => API.swapeState(itemid, isRead))
    .catch(console.error);
});

syncParameters()
  .then(resetAutoRefreshAlarm);