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
   */
  constructor(notification_id, title, message, iconUrl = 'Assets/img/icon.png', onClick = () => {}) {
    this.notification_id = notification_id;
    
    iconUrl = Notification.getURL(iconUrl);
    
    this.default = {title, message, iconUrl};
    this._onClick = onClick;
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
    iconUrl = Notification.getURL(iconUrl);
    const options = Object.assign({}, this.default, {
      title, message, iconUrl
    });
  
    if (!options.title) {
      requiredParam('Notification.prototype.create', 'title', 'no default value are setted');
    }
    if (!options.message) {
      requiredParam('Notification.prototype.create', 'message', 'no default value are setted');
    }
    
    browser.notifications.create(this.notification_id, options);
  }
  
  onClick() {
    if (typeof this.onClick === 'function') {
      this._onClick();
    }
  }
}

const NOTIFICATIONS = {
  [NOTIFICATION_SERVER_CHECK_SUCCESS]: new Notification(NOTIFICATION_SERVER_CHECK_SUCCESS, 'Success', 'Server responded correctly'),
  [NOTIFICATION_SERVER_CHECK_FAIL]: new Notification(
    NOTIFICATION_SERVER_CHECK_FAIL, 'Fail',
    'Server responded badly, check urls and yout connection',
    'Assets/img/error.png'
  ),
  [NOTIFICATION_CREDENTIALS_CHECK_SUCCESS]: new Notification(NOTIFICATION_CREDENTIALS_CHECK_SUCCESS, 'Success', 'Your are correctly connected'),
  [NOTIFICATION_CREDENTIALS_CHECK_FAIL]: new Notification(
    NOTIFICATION_CREDENTIALS_CHECK_FAIL, 'Fail',
    'Check your password api and login',
    'Assets/img/error.png'
  )
};

browser.notifications.onClicked.addListener(notification_id => {
  if (!NOTIFICATIONS.hasOwnProperty(notification_id)) {
    return;
  }
  
  NOTIFICATIONS[notification_id].onClick();
});