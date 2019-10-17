import browser from 'webextension-polyfill';

export default class PreferenceAdapter {
  /**
   * @returns {Promise.<DEFAULT_PARAMS>}
   */
  all () {
    return this.storage.get()
  }
  
  constructor (storage = browser.storage.local) {
    this.storage = storage;
  }
}