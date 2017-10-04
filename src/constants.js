/**
 * Created by Purexo on 21/04/2017.
 */
const EVENT_LOOP_AUTO_REFRESH = 'event-loop-auto-refresh';

const EVENT_INPUT_OPTION_CHANGE = 'event-input-option-change';
const EVENT_INPUT_OPTION_REFRESH_TIME_CHANGE = 'event-input-option-refresh-time-change';
const EVENT_INPUT_OPTION_SERVER_CHECK = 'event-input-option-server-check';
const EVENT_INPUT_OPTION_CREDENTIALS_CHECK = 'event-input-option-credentials-check';

const EVENT_REQUEST_PARAMS = 'event-request-params';
const EVENT_OBTAIN_PARAMS = 'event-obtain-params';

const EVENT_REQUEST_NBUNREADS = 'event-request-nbunreads';
const EVENT_OBTAIN_NBUNREADS = 'event-obtain-nbunreads';

const EVENT_OBTAIN_RSS = 'event-obtain-rss';
const EVENT_REQUEST_RSS = 'event-request-rss';

const PARAM_URL_MAIN = 'url-main';
const PARAM_URL_API = 'url-api';
const PARAM_LOGIN = 'login';
const PARAM_PASSWORD_API = 'password-api';
const PARAM_REFRESH_TIME = 'refresh-time';
const PARAM_ACTIVE_NOTIFICATIONS = 'active-notifications';
const PARAM_NB_FETCH_ITEMS = 'nb-fetch-items';

const DEFAULT_PARAMS = {
  [PARAM_URL_MAIN]: 'https://fresh-rss-instance.tld/',
  [PARAM_URL_API]: 'https://fresh-rss-instance.tld/api',
  [PARAM_LOGIN]: 'Your Login',
  [PARAM_PASSWORD_API]: 'Your Password API',
  [PARAM_REFRESH_TIME]: 15,
  [PARAM_ACTIVE_NOTIFICATIONS]: true,
  [PARAM_NB_FETCH_ITEMS]: 5,
};

const STORAGE_GET_ALL_PARAMS = [
  PARAM_URL_MAIN, PARAM_URL_API, PARAM_LOGIN, PARAM_PASSWORD_API,
  PARAM_REFRESH_TIME, PARAM_ACTIVE_NOTIFICATIONS, PARAM_NB_FETCH_ITEMS
];

const NOTIFICATION_SERVER_CHECK_SUCCESS = 'notification-server-check-success';
const NOTIFICATION_SERVER_CHECK_FAIL = 'notification-server-check-fail';
const NOTIFICATION_CREDENTIALS_CHECK_SUCCESS = 'notification-credential-check-success';
const NOTIFICATION_CREDENTIALS_CHECK_FAIL = 'notification-credential-check-fail';
const NOTIFICATION_REFRESH_SUCCESS = 'notification-refresh-success';