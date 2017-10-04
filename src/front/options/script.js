$(function $_on_ready_handler() {
  /**
   * Take an element and return his name and value
   *
   * @param {HTMLInputElement} element
   * @returns {{name, value}}
   */
  function getParamFromInput (element) {
    return {
      name: element.name,
      value: element.value
    };
  }
  
  /* --- Gestion generic des inputs du form --- */
  const $form = $('form');
  
  $form.on('change', '.js-should-end-by-slash', /** @this {HTMLInputElement}*/ function $form_js_should_end_by_slash_on_change(event) {
    if (!this.value.endsWith('/')) {
      event.preventDefault();
      this.value = `${this.value}/`
    }
  });
  
  // Au change input, fire EVENT_INPUT_OPTION_CHANGE avec en données le nom du param et sa nouvelle valeur
  $form.on('change', 'input', /** @this {HTMLInputElement}*/ function $form_input_on_change () {
    manager.fire(EVENT_INPUT_OPTION_CHANGE, getParamFromInput(this));
  });
  
  /* --- Gestion du slider de délai d'activation --- */
  const $input_refresh_time = $form.find('#input-refresh-time');
  const $input_refresh_time_detail = $form.find('#input-refresh-time-detail');
  
  // mise à jours de l'indicateur
  $input_refresh_time.on('input keyup change', function $refresh_time_on_change() {
    this.setAttribute('value', this.value);
    $input_refresh_time_detail.text(`${this.value} min`);
  });
  // et fire EVENT_INPUT_OPTION_REFRESH_TIME_CHANGE
  $input_refresh_time.on('change', /** @this {HTMLInputElement}*/ function $refresh_time_on_just_change() {
    manager.fire(EVENT_INPUT_OPTION_REFRESH_TIME_CHANGE, getParamFromInput(this));
  });
  
  /* --- Gestion du fieldset server settings --- */
  const $input_input_url_main = $form.find('#input-url-main');
  const $input_input_url_api = $form.find('#input-url-api');
  const $btn_check_server = $form.find('#btn-check-server');
  
  // check if server respond
  $btn_check_server.on('click', function $btn_check_server_on_click() {
    manager.fire(EVENT_INPUT_OPTION_SERVER_CHECK, {
      [PARAM_URL_MAIN]: $input_input_url_main.val(),
      [PARAM_URL_API]: $input_input_url_api.val(),
    });
  });
  
  /* --- Gestion du fieldset authentification settings --- */
  const $btn_check_credentials = $form.find('#btn-check-credentials');
  
  // check if api respond
  $btn_check_credentials.on('click', function $btn_check_credentials_on_click() {
    manager.fire(EVENT_INPUT_OPTION_CREDENTIALS_CHECK);
  });
  
  /* --- Récupèration des params --- */
  const $all_inputs = $form.find('input');
  
  // demande et récupère les params
  manager.addListener(EVENT_OBTAIN_PARAMS, ({data: params}) => {
    console.log(params);
    $all_inputs.each(function $all_inputs_each() {
      this.value = params[this.name];
    });
  });
  manager.fire(EVENT_REQUEST_PARAMS);
});