/**
 * Simple EventsManager
 *
 * you can
 * - on - need name and listener
 * - fire - need name and callback
 * - removeListener - need listener
 *
 * @class EventsManager
 */
export default class EventsManager {
  /**
   * Creates an instance of EventsManager.
   * @param {boolean} debug
   *
   * @memberOf EventsManager
   */
  constructor(debug = false) {
    this.debug = debug;
    this.clear();
  }
  
  /**
   * Add a listener
   *
   * @param {string} name
   * @param {Function} listener - take multiple argument: name, ...args sended by fire
   * @returns {[string, Function]} listener - usefull for removeListener
   *
   * @example
   * manager.on('is-ready', (data, name) => console.log(`${name} fired with data :`, data)) // data is {foo: 'bar'}
   * manager.fire('is-ready', 'bar')
   *
   * @memberOf EventsManager
   */
  on(name, listener) {
    const dispatcher = this._getNameDispatcher(name);
    dispatcher.push(listener);
    
    return [name, listener];
  }
  
  /**
   * fire event, will call all listener associated with name given
   *
   * @param {string} name
   * @param {...*} args
   *
   * @memberOf EventsManager
   */
  fire(name, ...args) {
    const dispatcher = this._getNameDispatcher(name);
    
    if (this.debug) {
      console.debug(`event ${name} is fired with data :`, ...args);
      console.trace();
    }
    
    dispatcher
      .filter(l => typeof l === 'function')
      .forEach(listener => Promise.resolve(listener(...args, name)).catch(console.error));
  }
  
  /**
   * remove listener associated with name and listener given
   *
   * @param {*} name
   * @param {Function} listener
   *
   * @memberOf EventsManager
   */
  removeListener(name, listener) {
    let dispatcher = this._getNameDispatcher(name);
    
    this._dispatchers[name] = dispatcher.filter(inListener => listener !== inListener);
  }
  
  /**
   * remove all listener associated with name given
   *
   * @param {*} name
   *
   * @memberOf EventsManager
   */
  removeAllListener(name) {
    this._initNameDispatcher(name);
  }
  
  /**
   * remove all listener
   *
   * @memberOf EventsManager
   */
  clear() {
    this._dispatchers = {};
  }
  
  get debug() {
    return this._debug;
  }
  
  set debug(debug) {
    this._debug = !!debug;
    
    return true;
  }
  
  /**
   * @param {string} name
   * @returns
   *
   * @memberOf EventsManager
   * @private
   */
  _initNameDispatcher(name) {
    return this._dispatchers[name] = [];
  }
  
  /**
   * @param {string} name
   * @returns
   *
   * @memberOf EventsManager
   * @private
   */
  _getNameDispatcher(name) {
    return this._dispatchers[name] || this._initNameDispatcher(name);
  }
}