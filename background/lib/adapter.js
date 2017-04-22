/**
 * handle incompatibilities between chrome and firexox
 * 
 * adapter replace browser or chrome for function i need, chrome use callback, but firefox promise. i will used promise.
 * 
 * So adapt chrome API to firefox API
 */

// short polyfill
chrome = chrome || false;
browser = browser || chrome;

const adapter = {
  alarms: {
    clear (name) {
      return chrome
        ? new Promise(resolve => browser.alarms.clear(name, cleared => resolve(cleared)))
        : browser.alarms.clear(name);
    }
  },
  storage: {
    sync: {
      get(keys) {
        return chrome
          ? new Promise(resolve => browser.storage.sync.get(keys, values => resolve(values)))
          : browser.storage.sync.get(keys);
      }
    },
    local: {
      get(keys) {
        return chrome
          ? new Promise(resolve => browser.storage.local.get(keys, values => resolve(values)))
          : browser.storage.local.get(keys);
      }
    }
  }
};