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

class URLParams extends URLSearchParams {
  append(key, value) {
    super.append(key, value);

    return this;
  }

  set(key, value) {
    super.set(key, value);

    return this;
  }
}

class QueryString {
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
        key = decodeURI(key);
        // flag
        if (value === void 0) {
          value = true;
        } else {
          value = decodeURI(value);
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
          ...value.map(value => `${encodeURI(`${key}`)}${this.eq}${encodeURI(`${value}`)}`)
        );
        continue;
      }
      
      entries.push(`${encodeURI(`${key}`)}${this.eq}${encodeURI(`${value}`)}`);
    }
    
    return entries.join(this.sep);
  }
  
}

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
  async connect () {
    const [url, prefs] = await Promise.all([this.api, this.preferenceAdapter.all()]);

    const params = new URLParams()
      .append('Email', prefs[PARAM_LOGIN])
      .append('Passwd', prefs[PARAM_PASSWORD_API]);

    const {text} = await get.text(`${url}/accounts/ClientLogin?${params}`);
    const {Auth = void 0} = RssApi.qsAuth.parse(text);

    if (!Auth) {
      throw new Error(`AUTH_PARSING_FAILED, of text :\n${text}`);
    }

    return this.auth = Auth;
  }
  
  async getNbUnreads () {
    const base_url = await this.api;
    const url = `${base_url}${RssApi.PART_UNREAD}`;
    const headers = this.authHeader;
    
    const {json: data} = await get.json(url, {headers});
    
    return data.max;
  }
  
  async cacheSubscriptions() {
    if (this._cache_subscribtions !== void 0) {
      return this._cache_subscribtions;
    }
    
    const base_url = await this.api;
    const headers = this.authHeader;
    
    const url = `${base_url}${RssApi.SUBSCRIPTIONS_LIST}`;
  
    const {json: {subscriptions}} = await get.json(url, {headers});
  
    const result = subscriptions.reduce((result, value) => {
      result[value.id] = value;
      
      return result;
    }, {});
    
    this._cache_subscribtions = result;
    
    return result
  }
  
  async getStreamsContent ({
                       nb = void 0,
                       startIndex = 0,
                       filter = ['xt', 'user/-/state/com.google/read'],
                       isRead = false
                     }={}) {
    if (nb === void 0) {
      throw new Error('No Stream Content to fetch, nb = undefined');
    }

    // if no feed to fetch, return an empty array instead request api
    // api have unexpected behavior in this case
    // respond very slowy, depend on version return empty response or very big response
    // in two case, unparsable (empty is not JSON valid, big response is truncate)
    if (nb === 0) {
      return []
    }
    
    const base_url = await this.api;
    const headers = this.authHeader;

    const params = new URLParams()
      .append('output', 'json')
      .append('r', 'n')
      .append('n', nb)
      .append(...filter);

    const url = `${base_url}${RssApi.PART_CONTENT}?${params}`;
    
    const [{json}, cache] = await Promise.all([
      get.json(url, {headers}).catch(() => ({json: {items: []}})),
      this.cacheSubscriptions(),
    ]);
    
    return json.items.map((item, index) => ({
      id: index + startIndex,
      link: item.alternate[0].href,
      title: item.title,
      origin: cache[item.origin.streamId],
      content: item.summary.content,
      itemid: item.id,
      isRead
    }));
  }
  
  async getToken () {
    const base_url = await this.api;
    const url = `${base_url}${RssApi.PART_TOKEN}`;
    
    const {text} = await get.text(url, {headers: this.authHeader});
    
    return text.trim();
  }
  
  async swapeState (itemid, isRead) {
    const [url, token] = await Promise.all([this.api, this.getToken()]);

    const params = new URLParams()
      .append('i', `tag:google.com,2005:reader/item/${itemid}`)
      .append('T', token)
      .append(isRead ? 'r' : 'a', 'user/-/state/com.google/read');

    return get.text(`${url}${RssApi.PART_SWAP}`, {
      method: 'POST',
      headers: this.authHeader,
      body: params,
    });
  }
}

RssApi.qsAuth = new QueryString('\n');
RssApi.END_POINT = 'greader.php';
RssApi.PART_UNREAD = '/reader/api/0/unread-count?output=json';
RssApi.PART_TOKEN = '/reader/api/0/token';
RssApi.PART_SWAP = '/reader/api/0/edit-tag';
RssApi.PART_CONTENT = '/reader/api/0/stream/contents/reading-list';
RssApi.SUBSCRIPTIONS_LIST = '/reader/api/0/subscription/list?output=json';