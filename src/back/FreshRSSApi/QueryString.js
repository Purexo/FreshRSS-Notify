export default class QueryString {
  constructor(sep = '&', eq = '=') {
    this.sep = sep;
    this.eq = eq;
  }
  
  /**
   *
   * @param {string} str
   * @return {*}
   */
  parse(str) {
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
  encode(map) {
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