function requiredParam(method, param, message) {
  throw new TypeError(`${method} required ${param} parameter${message ? ` - ${message}` : ''}`)
}

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
    
    iconUrl = Notification.getURL(iconUrl);
    
    this.default = {title, message, iconUrl};
    this._onClick = onClick;
    this._isAuthorized = isAuthorized;
  }
  
  static getURL(iconPath) {
    if (iconPath) {
      iconPath = browser.extension.getURL(iconPath);
    }
    
    return iconPath;
  }

  /**
   * @param {string?} title
   * @param {string?} message
   * @param {string?} iconUrl
   */
  create(title, message, iconUrl) {
    this._create(title, message, iconUrl)
      .catch(console.error)
  }

  async _create(title, message, iconUrl) {
    const params = await getParameters();
    
    if (!this._isAuthorized(params)) {
      return;
    }
    
    iconUrl = Notification.getURL(iconUrl);
    const options = {type: 'basic'};
    options.title = title || this.default.title;
    options.message = message || this.default.message;
    options.iconUrl = iconUrl || this.default.iconUrl;
  
    if (!options.title) {
      requiredParam('Notification.prototype.create', 'title', 'no default value are setted');
    }
    if (!options.message) {
      requiredParam('Notification.prototype.create', 'message', 'no default value are setted');
    }
    
    browser.notifications.create(this.notification_id, options);
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
    title: 'Success',
    message: 'Server responded correctly'
  }),
  [NOTIFICATION_SERVER_CHECK_FAIL]: new Notification({
    notification_id: NOTIFICATION_SERVER_CHECK_FAIL,
    title: 'Fail',
    message: 'Server responded badly, check urls and yout connection',
    iconUrl: 'Assets/img/error.png'
  }),
  [NOTIFICATION_CREDENTIALS_CHECK_SUCCESS]: new Notification({
    notification_id: NOTIFICATION_CREDENTIALS_CHECK_SUCCESS,
    title: 'Success',
    message: 'Your are correctly connected'
  }),
  [NOTIFICATION_CREDENTIALS_CHECK_FAIL]: new Notification({
    notification_id: NOTIFICATION_CREDENTIALS_CHECK_FAIL,
    title: 'Fail',
    message: 'Check your password api and login',
    iconUrl: 'Assets/img/error.png'
  }),
  [NOTIFICATION_REFRESH_SUCCESS]: new Notification({
    notification_id: NOTIFICATION_REFRESH_SUCCESS,
    title: 'Success',
    message: 'You have x unreads articles',
    isAuthorized(params) {
      return params[PARAM_ACTIVE_NOTIFICATIONS];
    }
  })
};

browser.notifications.onClicked.addListener(notification_id => {
  if (!NOTIFICATIONS.hasOwnProperty(notification_id)) {
    return;
  }
  
  NOTIFICATIONS[notification_id].onClick();
});