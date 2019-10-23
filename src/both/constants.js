/**
 * Created by Purexo on 21/04/2017.
 */
export const EVENT_LOOP_AUTO_REFRESH = 'event-loop-auto-refresh';

export const EVENT_INPUT_OPTION_CHANGE = 'event-input-option-change';
export const EVENT_INPUT_OPTION_REFRESH_TIME_CHANGE = 'event-input-option-refresh-time-change';
export const EVENT_INPUT_OPTION_SERVER_CHECK = 'event-input-option-server-check';
export const EVENT_INPUT_OPTION_CREDENTIALS_CHECK = 'event-input-option-credentials-check';

export const EVENT_REQUEST_PARAMS = 'event-request-params';
export const EVENT_OBTAIN_PARAMS = 'event-obtain-params';

export const EVENT_REQUEST_NBUNREADS = 'event-request-nbunreads';
export const EVENT_OBTAIN_NBUNREADS = 'event-obtain-nbunreads';

export const EVENT_OBTAIN_RSS = 'event-obtain-rss';
export const EVENT_REQUEST_RSS = 'event-request-rss';

export const EVENT_REQUEST_SWAP = 'event-request-swap';

export const PARAM_URL_MAIN = 'url-main';
export const PARAM_URL_API = 'url-api';
export const PARAM_LOGIN = 'login';
export const PARAM_PASSWORD_API = 'password-api';
export const PARAM_REFRESH_TIME = 'refresh-time';
export const PARAM_ACTIVE_NOTIFICATIONS = 'active-notifications';
export const PARAM_NB_FETCH_ITEMS = 'nb-fetch-items';

export const DEFAULT_PARAMS = {
  [PARAM_URL_MAIN]: 'https://fresh-rss-instance.tld/',
  [PARAM_URL_API]: 'https://fresh-rss-instance.tld/api',
  [PARAM_LOGIN]: '',
  [PARAM_PASSWORD_API]: '',
  [PARAM_REFRESH_TIME]: 15,
  [PARAM_ACTIVE_NOTIFICATIONS]: true,
  [PARAM_NB_FETCH_ITEMS]: 5,
};

export const STORAGE_GET_ALL_PARAMS = [
  PARAM_URL_MAIN, PARAM_URL_API, PARAM_LOGIN, PARAM_PASSWORD_API,
  PARAM_REFRESH_TIME, PARAM_ACTIVE_NOTIFICATIONS, PARAM_NB_FETCH_ITEMS
];

export const NOTIFICATION_SERVER_CHECK_SUCCESS = 'notification-server-check-success';
export const NOTIFICATION_SERVER_CHECK_FAIL = 'notification-server-check-fail';
export const NOTIFICATION_CREDENTIALS_CHECK_SUCCESS = 'notification-credential-check-success';
export const NOTIFICATION_CREDENTIALS_CHECK_FAIL = 'notification-credential-check-fail';
export const NOTIFICATION_REFRESH_SUCCESS = 'notification-refresh-success';

export const LOCALE_NOTIF_SERVER_CHECK_SUCCESS_TITLE = 'NOTIFICATION_SERVER_CHECK_SUCCESS_TITLE';
export const LOCALE_NOTIF_SERVER_CHECK_SUCCESS_MESSAGE = 'NOTIFICATION_SERVER_CHECK_SUCCESS_MESSAGE';
export const LOCALE_NOTIF_SERVER_CHECK_FAIL_TITLE = 'NOTIFICATION_SERVER_CHECK_FAIL_TITLE';
export const LOCALE_NOTIF_SERVER_CHECK_FAIL_MESSAGE = 'NOTIFICATION_SERVER_CHECK_FAIL_MESSAGE';

export const LOCALE_NOTIF_CREDENTIALS_CHECK_SUCCESS_TITLE = 'NOTIFICATION_CREDENTIALS_CHECK_SUCCESS_TITLE';
export const LOCALE_NOTIF_CREDENTIALS_CHECK_SUCCESS_MESSAGE = 'NOTIFICATION_CREDENTIALS_CHECK_SUCCESS_MESSAGE';
export const LOCALE_NOTIF_CREDENTIALS_CHECK_FAIL_TITLE = 'NOTIFICATION_CREDENTIALS_CHECK_FAIL_TITLE';
export const LOCALE_NOTIF_CREDENTIALS_CHECK_FAIL_MESSAGE = 'NOTIFICATION_CREDENTIALS_CHECK_FAIL_MESSAGE';

export const LOCALE_NOTIF_REFRESH_SUCCESS_TITLE = 'NOTIFICATION_REFRESH_SUCCESS_TITLE';
export const LOCALE_NOTIF_REFRESH_SUCCESS_MESSAGE = 'NOTIFICATION_REFRESH_SUCCESS_MESSAGE';

export const LOCALE_PANEL_BTN_REFRESH_TITLE = 'PANEL_BTN_REFRESH_TITLE';
export const LOCALE_PANEL_BTN_UNREADS_TITLE = 'PANEL_BTN_UNREADS_TITLE';