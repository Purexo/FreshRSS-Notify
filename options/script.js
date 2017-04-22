$.ready(() => {
  // Tout les inputs de la page d'option
  const $input_url_main = $('#input-url-main');
  const $input_url_api = $('#input-url-api');
  const $input_login = $('#input-login');
  const $input_password_api = $('#input-password-api');
  const $input_refresh_time = $('#input-refresh-time');
  const $indicateur_refresh_time = $('#input-refresh-time + span');
  const $input_active_notifications = $('#input-active-notifications');
  const $input_nb_fetch_items = $('#input-nb-fetch-items');
  
  const ALL_INPUTS = [
    $input_url_main, $input_url_api, $input_login, $input_password_api,
    $input_refresh_time, $input_active_notifications, $input_nb_fetch_items
  ];
  const CREDENTIALS_INPUTS =  [$input_url_main, $input_url_api, $input_login, $input_password_api];
  
  // mise à jours de l'indicateur
  $input_refresh_time.addEventListener('change', () => {
    $input_refresh_time.setAttribute('value', $input_refresh_time.value);
    $indicateur_refresh_time.textContent = `${$input_refresh_time.value} min`
  });
  
  // demande et récupère les params
  manager.addListener(EVENT_OBTAIN_PARAMS, ({message, sender, sendResponse}) => {
    ALL_INPUTS.forEach(input => input.value = message.params[input.id.substring(6)]);
  });
  manager.fire(EVENT_REQUEST_PARAMS);
  
  function getParamFromInput (element) {
    return {
      name: element.id.substring(6),
      value: element.value
    };
  }
  
  function handlerForListenerToSendRuntimeMessageFactory (messageName) {
    return event => {
      browser.runtime.sendMessage({
        name: messageName,
        param: getParamFromInput(event.target)
      });
    }
  }
  
  // Envoi au runtime des nouvelles valeurs d'option à chaque changement
  const INPUT_OPTION_CHANGE_HANDLER = handlerForListenerToSendRuntimeMessageFactory(EVENT_INPUT_OPTION_CHANGE);
  ALL_INPUTS.forEach(input => $.addEventsListener(INPUT_CHANGE_EVENTS, input, INPUT_OPTION_CHANGE_HANDLER));
  
  // Envoi d'un message spécifique parce-que le refresh time vient de changer, il va faloir réinitialiser la boucle
  const INPUT_OPTION_REFRESH_TIME_CHANGE_HANDLER = handlerForListenerToSendRuntimeMessageFactory(EVENT_INPUT_OPTION_REFRESH_TIME_CHANGE);
  $.addEventsListener(INPUT_CHANGE_EVENTS, $input_refresh_time, INPUT_OPTION_REFRESH_TIME_CHANGE_HANDLER);
  
  // Envoi d'un message spécifique car une information de crendential vient de changer, il faut ce reconnecter
  const INPUT_OPTION_CREDENTIAL_CHANGE_HANDLER = handlerForListenerToSendRuntimeMessageFactory(EVENT_INPUT_OPTION_CREDENTIALS_CHANGE);
  CREDENTIALS_INPUTS.forEach(input => $.addEventsListener(INPUT_CHANGE_EVENTS, input, INPUT_OPTION_CREDENTIAL_CHANGE_HANDLER))
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.name) {
    manager.fire(message.name, {message, sender, sendResponse});
  }
});