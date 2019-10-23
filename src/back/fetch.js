/**
 * @typedef {Request} Request
 * @see https://developer.mozilla.org/fr/docs/Web/API/Request
 */

/*
 * Helper for Fetch API 
 */
/**
 * get text over network
 *
 * @param {string|Request} url
 * @param {object?} fetchOptions
 * @returns Promise <{response: Response, text: string}>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch for fetchOption
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response for Response
 */
export function text(url, fetchOptions) {
  return fetch(url, fetchOptions)
    .then(response => {
      const clonedResponse = response.clone();
      
      return response.text().then(text => ({
        response: clonedResponse,
        text
      }));
    });
}

/**
 * get json over network
 *
 * @param {string|Request} url
 * @param {object?} fetchOptions
 * @returns Promise <{response: Response, json: any}>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch for fetchOption
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response for Response
 */
export function json(url, fetchOptions) {
  return fetch(url, fetchOptions)
    .then(response => {
      const clonedResponse = response.clone();
      
      return response.json().then(json => ({
        response: clonedResponse,
        json
      }));
    });
}

/**
 * get ArrayBuffer over network
 *
 * @param {string|Request} url
 * @param {object?} fetchOptions
 * @returns Promise <{response: Response, buffer: ArrayBuffer}>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch for fetchOption
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer for ArrayBuffer
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response for Response
 */
export function arrayBuffer(url, fetchOptions) {
  return fetch(url, fetchOptions)
    .then(response => {
      const clonedResponse = response.clone();
      
      return response.arrayBuffer().then(buffer => ({
        response: clonedResponse,
        buffer
      }));
    });
}

/**
 * get blob over network
 *
 * @param {string|Request} url
 * @param {object?} fetchOptions
 * @returns Promise <{response: Response, blob: Blob}>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch for fetchOption
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Blob for Blob
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response for Response
 */
export function blob(url, fetchOptions) {
  return fetch(url, fetchOptions)
    .then(response => {
      const clonedResponse = response.clone();
      
      return response.blob().then(blob => ({
        response: clonedResponse,
        blob
      }));
    });
}

/**
 * get formData over network
 *
 * @param {string|Request} url
 * @param {object?} fetchOptions
 * @returns Promise <{response: Response, formData: FormData}>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch for fetchOption
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Blob for Blob
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response for Response
 */
export function formData(url, fetchOptions) {
  return fetch(url, fetchOptions)
    .then(response => {
      const clonedResponse = response.clone();
      
      return response.formData().then(formData => ({
        response: clonedResponse,
        formData
      }));
    });
}


/**
 * get cloned Response over network
 *
 * @param {string|Request} url
 * @param {object?} fetchOptions
 * @returns Promise <{response: Response, clone: Response}>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch for fetchOption
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Blob for Blob
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response for Response
 */
export function clone(url, fetchOptions) {
  return fetch(url, fetchOptions)
    .then(response => ({response, clone: response.clone()}));
}