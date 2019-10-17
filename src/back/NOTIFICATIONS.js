import {getParameters, requiredParam} from "./functions";

class Notification {
  /**
   * @param {string} notification_id
   * @param {string?} title
   * @param {string?} message
   * @param {string} iconUrl
   * @param {Function} onClick
   * @param {Function} isAuthorized
   */
  constructor({
                notification_id,
                title,
                message,
                iconUrl = 'Assets/img/icon.png',
                onClick = () => {},
                isAuthorized = params => true
  }) {
    this.notification_id = notification_id;
    
    this.default = {title, message, iconUrl};
    this._onClick = onClick;
    this._isAuthorized = isAuthorized;
  }
  
  static getURL(iconPath) {
    if (iconPath) {
      iconPath = browser.runtime.getURL(iconPath);
    }
    
    return iconPath;
  }

  /**
   * @param {String?} title
   * @param {String|string[]?} title_substitutions
   * @param {String?} message
   * @param {String|string[]?} message_substitutions
   * @param {String?} iconUrl
   */
  create({title, title_substitutions, message, message_substitutions, iconUrl}={}) {
    this._create({title, title_substitutions, message, message_substitutions, iconUrl})
      .catch(console.error)
  }

  async _create({
                  title=this.default.title, message=this.default.message,
                  title_substitutions, message_substitutions,
                  iconUrl=this.default.iconUrl
  }) {
    const params = await getParameters();
    
    if (!this._isAuthorized(params)) {
      return;
    }

    if (!title) {
      requiredParam('NOTIFICATIONS.prototype.create', 'title', 'no default value are setted');
    }
    if (!message) {
      requiredParam('NOTIFICATIONS.prototype.create', 'message', 'no default value are setted');
    }
    
    iconUrl = NOTIFICATIONS.getURL(iconUrl);
    
    return browser.notifications.create(this.notification_id, {
      type: 'basic', iconUrl,
      title: browser.i18n.getMessage(title, title_substitutions),
      message: browser.i18n.getMessage(message, message_substitutions),
    });
  }
  
  onClick() {
    if (typeof this._onClick === 'function') {
      this._onClick();
    }
  }
}

const NOTIFICATIONS = {
  [NOTIFICATION_SERVER_CHECK_SUCCESS]: new Notification({
    notification_id: NOTIFICATION_SERVER_CHECK_SUCCESS,
    title: LOCALE_NOTIF_SERVER_CHECK_SUCCESS_TITLE,
    message: LOCALE_NOTIF_SERVER_CHECK_SUCCESS_MESSAGE,
    iconUrl: '/Assets/img/icon.png',
  }),
  [NOTIFICATION_SERVER_CHECK_FAIL]: new Notification({
    notification_id: NOTIFICATION_SERVER_CHECK_FAIL,
    title: LOCALE_NOTIF_SERVER_CHECK_FAIL_TITLE,
    message: LOCALE_NOTIF_SERVER_CHECK_FAIL_MESSAGE,
    iconUrl: '/Assets/img/error.png',
  }),
  [NOTIFICATION_CREDENTIALS_CHECK_SUCCESS]: new Notification({
    notification_id: NOTIFICATION_CREDENTIALS_CHECK_SUCCESS,
    title: LOCALE_NOTIF_CREDENTIALS_CHECK_SUCCESS_TITLE,
    message: LOCALE_NOTIF_CREDENTIALS_CHECK_SUCCESS_MESSAGE,
    iconUrl: '/Assets/img/icon.png',
  }),
  [NOTIFICATION_CREDENTIALS_CHECK_FAIL]: new Notification({
    notification_id: NOTIFICATION_CREDENTIALS_CHECK_FAIL,
    title: LOCALE_NOTIF_CREDENTIALS_CHECK_FAIL_TITLE,
    message: LOCALE_NOTIF_CREDENTIALS_CHECK_FAIL_MESSAGE,
    iconUrl: '/Assets/img/error.png'
  }),
  [NOTIFICATION_REFRESH_SUCCESS]: new Notification({
    notification_id: NOTIFICATION_REFRESH_SUCCESS,
    title: LOCALE_NOTIF_REFRESH_SUCCESS_TITLE,
    message: LOCALE_NOTIF_REFRESH_SUCCESS_MESSAGE,
    iconUrl: '/Assets/img/icon.png',
    isAuthorized(params) {
      return params[PARAM_ACTIVE_NOTIFICATIONS];
    },
    onClick() {
      getParameters()
        .then(params => params[PARAM_URL_MAIN])
        .then(url => browser.tabs.create({active: true, url}));
    }
  })
};

browser.notifications.onClicked.addListener(notification_id => {
  if (!NOTIFICATIONS.hasOwnProperty(notification_id)) {
    return;
  }
  
  NOTIFICATIONS[notification_id].onClick();
});

export default NOTIFICATIONS;