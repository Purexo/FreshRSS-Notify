class PreferenceAdapter {
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

/**
 * This callback is displayed as part of the Requester class.
 * @callback URLParams~reducer
 * @param {*} prev
 * @param {*} value
 * @param {*} key
 * @param {*} origData
 */

class URLParams extends Map {
  /**
   * Ajoute de façon intelligente des params
   *
   * @param {string|*} key - si key n'est pas une string, elle est interpollé en string. {} -> [Object object]
   * @param value
   * @return {URLParams} - this, chainable call
   */
  append (key, value) {
    key = `${key}`;
    
    if (typeof value === 'boolean') {
      return this.set(key, value);
    }
    
    if (this.has(key)) {
      let new_value = this.get(key);
      if (!Array.isArray(new_value)) {
        new_value = [new_value];
      }
      new_value.push(value);
      
      return this.set(key, new_value);
    }
    
    return this.set(key, value);
  }
  
  /**
   * permet de réduire l'URLParams
   * @param {URLParams~reducer} reducer
   * @param {*} initialValue
   * @param {*?} thisArg - this by default (the current URLParams instance)
   * @return {*} initialValue - transformed by reducer on each iteration
   */
  reduce (reducer, initialValue, thisArg) {
    thisArg = thisArg || this;
    
    for (let [key, value] of this) {
      initialValue = reducer.call(thisArg, initialValue, value, key, this);
    }
    
    return initialValue;
  }
  
  /**
   * Prépare une Map prête à etre encodé
   * transforme les values booleene en 1 ou 0,
   * passe key et value à encodeURIComponent
   *
   * @return {Map}
   */
  map () {
    return this.reduce((prev, value, key) => {
      key = encodeURIComponent(`${key}`);
      
      if (typeof value === 'boolean') {
        value = value ? '1' : '0';
      }
      else if (Array.isArray(value)) {
        value = value.map(value => encodeURIComponent(`${value}`));
      }
      else {
        value = encodeURIComponent(value);
      }
      
      return prev.set(key, value);
    }, new Map());
  }
  
  /**
   *
   * @return {string}
   */
  toString () {
    return URLParams.qs.encode(this);
  }
}

class QueryString {
  static getInstance () {
    return QueryString._defaultInstance;
  }
  
  constructor (sep = '&', eq = '=') {
    this.sep = sep;
    this.eq = eq;
  }
  
  /**
   *
   * @param {string} str
   * @return {*}
   */
  parse (str) {
    return str
      .split(this.sep)
      .reduce((prev, entry) => {
        let [key, value] = entry.split(this.eq, 2);
        key = decodeURIComponent(key);
        // flag
        if (value === void 0) {
          value = true;
        } else {
          value = decodeURIComponent(value);
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
   * @param {Map} map - sanitized map <String, String>  idealy from URLParams.prototype.map()
   * @return {string}
   */
  encode (map) {
    const entries = [];
    for (let [key, value] of map) {
      if (Array.isArray(value)) {
        entries.push(
          ...value.map(value => `${encodeURIComponent(`${key}`)}${this.eq}${encodeURIComponent(`${value}`)}`)
        );
        continue;
      }
      
      entries.push(`${encodeURIComponent(`${key}`)}${this.eq}${encodeURIComponent(`${value}`)}`);
    }
    
    return entries.join(this.sep);
  }
  
}

QueryString._defaultInstance = URLParams.qs = new QueryString();

/**
 * @class Headers
 * @extends Map
 * @property {URLSearchParams~append} append
 */

class RssApi {
  constructor (preferenceAdapter = new PreferenceAdapter()) {
    this.auth = null;
    this.preferenceAdapter = preferenceAdapter;
  }
  
  /**
   * Generate a new Header with Authorization setted
   * @returns {Headers}
   */
  get authHeader () {
    return new Headers({
      "Authorization": `GoogleLogin auth=${this.auth}`
    });
  }
  
  /**
   * Get API URL
   * @returns {Promise.<string>}
   */
  get api () {
    return this.preferenceAdapter.all()
      .then(prefs => `${prefs[PARAM_URL_API]}${RssApi.END_POINT}`)
  }
  
  /**
   * fetch token Authorization GoogleLogin auth
   *
   * @returns {Promise.<string, *>}
   */
  connect () {
    return Promise.all([this.api, this.preferenceAdapter.all()])
      .then(([url, prefs]) => {
        const params = new URLParams()
          .append('Email', prefs[PARAM_LOGIN])
          .append('Passwd', prefs[PARAM_PASSWORD_API]);
        
        url = `${url}/accounts/ClientLogin?${params}`;
        
        return get.text(url)
          .then(({text}) => {
            const parsed = RssApi.qsAuth.parse(text);
            
            if (parsed && parsed.Auth) {
              return this.auth = parsed.Auth;
            }
            
            throw new Error(`AUTH_PARSING_FAILED, of text :\n${text}`);
          })
      });
  }
  
  getNbUnreads () {
    return this.api.then(url => {
      url = `${url}${RssApi.PART_UNREAD}`;
      const headers = this.authHeader;
      
      return get.json(url, {headers})
        .then(data => data.max);
    });
  }
  
  getStreamsContent ({
                       nb = void 0,
                       startIndex = 0,
                       filter = ['xt', 'user/-/state/com.google/read'],
                       isRead = false
                     }={}) {
    if (nb === void 0) {
      return Promise.reject(new Error('No Stream Content to fetch, nb = 0'));
    }
    
    return this.api
      .then(url => {
        const params = new URLParams()
          .append('output', 'json')
          .append('r', 'n')
          .append('n', nb)
          .append(...filter);
        const headers = this.authHeader;
        url = `${url}${RssApi.PART_CONTENT}?${params}`;
        
        return get.json(url, {headers})
          .then(({json}) => json.items.map((item, index) => ({
            id: index + startIndex,
            link: item.alternate[0].href,
            title: item.title,
            originTitle: item.origin.title,
            content: item.summary.content,
            itemid: item.id,
            isRead,
          })));
      })
  }
  
  getToken () {
    return this.api.then(url => {
      url = `${url}${RssApi.PART_TOKEN}`;
      const headers = this.authHeader;
      
      return get.text(url, {headers})
        .then(({text}) => text);
    });
  }
  
  swapeState (itemid, isRead) {
    return Promise.all([this.api, this.getToken()])
      .then(([url, token]) => {
        const params = new URLParams()
          .append('i', `tag:google.com,2005:reader/item/${itemid}`)
          .append('T', token)
          .append(isRead ? 'r' : 'a', 'user/-/state/com.google/read');
        const headers = this.authHeader;
        url = `${url}${RssApi.PART_SWAP}?${params}`;
        
        return get.text(url, {
          method: 'POST',
          headers,
          body: `${params}`
        });
      })
  }
}

RssApi.qsAuth = new QueryString('\n');
RssApi.END_POINT = 'greader.php';
RssApi.PART_UNREAD = '/reader/api/0/unread-count?output=json';
RssApi.PART_TOKEN = '/reader/api/0/token';
RssApi.PART_SWAP = '/reader/api/0/edit-tag';
RssApi.PART_CONTENT = '/reader/api/0/stream/contents/reading-list';