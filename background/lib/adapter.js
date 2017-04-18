/**
 * handle incompatibilities between chrome and firexox
 * 
 * adapter replace browser or chrome for function i need, chrome use callback, but firefox promise. i will used promise.
 * 
 * So adapt chrome API to firefox API
 */

// short polyfill
chrome = chrome || {};
browser = browser || chrome;

const adapter = {
  alarms: {
    clear (name) {
      return chrome ?
        new Promise(resolve => browser.alarms.clear(name, cleared => resolve(cleared))) :
        browser.alarms.clear(name);
    }
  }
};