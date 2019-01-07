$(function $_on_ready_handler() {
  /**
   * Take an element and return his name and value
   *
   * @param {HTMLInputElement} element
   * @returns {{paramname, value}}
   */
  function getParamFromInput (element) {
    return {
      paramname: element.name,
      value: element.value
    };
  }
  
  /* --- Gestion generic des inputs du form --- */
  const $form = $('form');

  /* --- locale loading --- */
  document.querySelectorAll('[data-locale-id]').forEach(element => {
    const localeId = element.getAttribute('data-locale-id');
    const substitutions = element.hasAttribute('data-locale-substitutions')
      ? element.getAttribute('data-locale-substitutions')
      : void 0;

    const message = browser.i18n.getMessage(localeId, substitutions);

    if (element.hasAttribute('data-locale-attribute')) {
      const attribute = element.getAttribute('data-locale-attribute');

      element.setAttribute(attribute, message);
    } else {
      element.textContent = message;
    }
  });
  
  $form.on('change', '.js-should-end-by-slash', /** @this {HTMLInputElement}*/ function $form_js_should_end_by_slash_on_change(event) {
    if (!this.value.endsWith('/')) {
      event.preventDefault();
      this.value = `${this.value}/`
    }
  });
  
  // Au change input, fire EVENT_INPUT_OPTION_CHANGE avec en données le nom du param et sa nouvelle valeur
  $form.on('change', 'input', /** @this {HTMLInputElement}*/ function $form_input_on_change () {
    browser.runtime
      .sendMessage({name: EVENT_INPUT_OPTION_CHANGE, ...getParamFromInput(this)})
      .catch(console.error);
  });
  
  /* --- Gestion du slider de délai d'activation --- */
  const $input_refresh_time = $form.find('#input-refresh-time');
  const $input_refresh_time_detail = $form.find('#input-refresh-time-detail');
  
  // mise à jours de l'indicateur
  $input_refresh_time.on('input keyup change', function $refresh_time_on_change() {
    this.setAttribute('value', this.value);
    $input_refresh_time_detail.text(
      browser.i18n.getMessage(
        $input_refresh_time_detail.attr('data-locale-id'),
        `${this.value}`
      )
    );
  });
  // et fire EVENT_INPUT_OPTION_REFRESH_TIME_CHANGE
  $input_refresh_time.on('change', /** @this {HTMLInputElement}*/ function $refresh_time_on_just_change() {
    browser.runtime
      .sendMessage({name: EVENT_INPUT_OPTION_REFRESH_TIME_CHANGE})
      .catch(console.error);
  });
  
  /* --- Gestion du fieldset server settings --- */
  const $input_input_url_main = $form.find('#input-url-main');
  const $input_input_url_api = $form.find('#input-url-api');
  const $btn_check_server = $form.find('#btn-check-server');
  
  // check if server respond
  $btn_check_server.on('click', function $btn_check_server_on_click() {
    browser.runtime
      .sendMessage({
        name: EVENT_INPUT_OPTION_SERVER_CHECK,
        [PARAM_URL_MAIN]: $input_input_url_main.val(),
        [PARAM_URL_API]: $input_input_url_api.val(),
      })
      .catch(console.error);
  });
  
  /* --- Gestion du fieldset authentification settings --- */
  const $btn_check_credentials = $form.find('#btn-check-credentials');
  
  // check if api respond
  $btn_check_credentials.on('click', function $btn_check_credentials_on_click() {
    browser.runtime
      .sendMessage({
        name: EVENT_INPUT_OPTION_CREDENTIALS_CHECK,
        [PARAM_URL_MAIN]: $input_input_url_main.val(),
        [PARAM_URL_API]: $input_input_url_api.val(),
      })
      .catch(console.error);
  });
  
  /* --- Récupèration des params --- */
  const $all_inputs = $form.find('input');
  
  // demande et récupère les params
  browser.runtime.onMessage.addListener(({name=undefined, ...data}) => {
    if (!name) return;

    if (name === EVENT_OBTAIN_PARAMS) {
      const {params} = data;

      $all_inputs.each(function $all_inputs_each() {
        this.value = params[this.name];
      });
    }
  });

  browser.runtime
    .sendMessage({name: EVENT_REQUEST_PARAMS})
    .catch(console.error);
});