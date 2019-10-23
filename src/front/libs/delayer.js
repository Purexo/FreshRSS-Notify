export function throttle(callback, limit) {
  let inThrottle;
  
  return function $throttler$() {
    if (!inThrottle) {
      callback.apply(this, arguments);
      
      inThrottle = true;
      
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

export function debounce(callback, delay) {
  let inDebounce;
  
  return function $debouncer$() {
    inDebounce && clearTimeout(inDebounce);
    
    inDebounce = setTimeout(() => callback.apply(this, arguments), delay);
  }
}