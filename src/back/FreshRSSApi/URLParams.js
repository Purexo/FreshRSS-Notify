export default class URLParams extends URLSearchParams {
  append(key, value) {
    super.append(key, value);
    
    return this;
  }
  
  set(key, value) {
    super.set(key, value);
    
    return this;
  }
}