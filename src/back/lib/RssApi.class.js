class PreferenceAdapter {
  /**
   * @returns {Promise.<DEFAULT_PARAMS>}
   */
  all() {
    return this.storage.get()
  }
  
  constructor(storage = browser.storage.local) {
    this.storage = storage;
  }
}

/**
 * Simple polyfill of node api
 * parse query string
 *
 * @param {string} str
 * @param {string?} sep
 * @param {string?} eq
 * @returns {*}
 *
 * @see https://nodejs.org/dist/latest-v8.x/docs/api/querystring.html#querystring_querystring_parse_str_sep_eq_options
 */
function querystring_parse(str, sep = '&', eq = '=') {
  return str
    .split(sep)
    .reduce((prev, entry) => {
      let [key, value] = entry.split(eq, 2);
      
      // flag
      if (value === void 0) {
        value = true;
      }
      
      // multiple value with same key
      if (prev.hasOwnProperty(key)) {
        if (!Array.isArray(prev[key])) {
          prev[key] = [prev[key]];
        }
        
        prev[key].push(value);
      }
      // classic key value
      else {
        prev[key] = value;
      }
    
      return prev;
    }, {});
}

/**
 * This callback is displayed as part of the Requester class.
 * @callback URLSearchParams~append
 * @param {string} key
 * @param {*} value
 */

/**
 * @class URLSearchParams
 * @extends Map
 * @property {URLSearchParams~append} append
 */

/**
 * @class Headers
 * @extends Map
 * @property {URLSearchParams~append} append
 */

class RssApi {
  constructor(preferenceAdapter = new PreferenceAdapter()) {
    this.auth = null;
    this.preferenceAdapter = preferenceAdapter;
  }
  
  /**
   * Generate a new Header with Authorization setted
   * @returns {Headers}
   */
  get authHeader() {
    return new Headers({
      "Authorization": `GoogleLogin auth=${this.auth}`
    });
  }
  
  /**
   * Get API URL
   * @returns {Promise.<string>}
   */
  get api() {
    return this.preferenceAdapter.all()
      .then(prefs => `${prefs[PARAM_URL_API]}${RssApi.END_POINT}`)
  }
  
  /**
   * fetch token Authorization GoogleLogin auth
   *
   * @returns {Promise.<string, *>}
   */
  connect() {
    return Promise.all([this.api, this.preferenceAdapter.all()])
      .then(([url, prefs]) => {
        const body = new URLSearchParams();
        body.append('Email', prefs[PARAM_LOGIN]);
        body.append('Passwd', prefs[PARAM_PASSWORD_API]);
        
        url = `${url}/accounts/ClientLogin?${body}`;
        
        return get.text(url)
          .then(({text}) => this.auth = querystring_parse(text, '\n', '=').Auth)
          .catch(err => {
            console.error(err);
            // TODO notification error _("Impossible connexion"), _("Check your ids or instance URL")
          })
      });
  }
}
RssApi.END_POINT = 'greader.php';