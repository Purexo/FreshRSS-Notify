const manager = (function () {
  /**
   * Simple Event
   * have name and data
   * 
   * @class Event
   */
  class Event {
    /**
     * Creates an instance of Event.
     * @param {string} name 
     * @param {*} data
     * 
     * @memberOf Event
     */
    constructor (name, data) {
      this.name = name;
      this.data = data;
    }
  }

  /**
   * Simple EventsManager
   * 
   * you can
   * - addListener - need name and listener
   * - fire - need name and callback
   * - removeListener - need listener
   * 
   * @class EventsManager
   */
  class EventsManager {
    /**
     * Creates an instance of EventsManager.
     * @param {boolean} debug
     * 
     * @memberOf EventsManager
     */
    constructor({debug=false}={}) {
      this._debug = debug;
      this.clear();
    }

    /**
     * Add a listener
     * 
     * @param {string} name 
     * @param {Function} listener - take one arg of Event type (data when fired if defined is in it)
     * @returns {*} listener - usefull for removeListener
     * 
     * @example
     * manager.addListener('is-ready', ({name, data}) => console.log(`${name} fired with data :`, data))
     * manager.addListener('is-ready', (event => console.log(event))
     * 
     * @memberOf EventsManager
     */
    addListener(name, listener) {
      const dispatcher = this._getNameDispatcher(name);
      dispatcher.push(listener);

      return listener;
    }

    /**
     * fire event, will call all listener associated with name given
     * 
     * @param {string} name 
     * @param {*} data
     * 
     * @memberOf EventsManager
     */
    fire(name, data) {
      const event = new Event(name, data);
      const dispatcher = this._getNameDispatcher(name);

      this._debug && console.log(`event ${name} is fired with data :`, data) || console.trace();

      dispatcher
        .forEach(listener => typeof listener === 'function' ? listener(event) : event);
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
      this._debug = debug;

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
    _getNameDispatcher (name) {
      return this._dispatchers[name] || this._initNameDispatcher(name);
    }
  }

  return new EventsManager();
})();