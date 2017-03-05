const $ = (selector, context=document) => context.querySelector(selector);
const $$ = (selector, context=document) => Array.from(context.querySelectorAll(selector));
$.ready = (callback) => document.readyState == 'interactive' ? callback() : document.addEventListener('DOMContentLoaded', callback);
$.parse = (strHTML) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = strHTML;

  return Array.from(wrapper.childNodes);
};