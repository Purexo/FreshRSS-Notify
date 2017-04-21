$.ready(() => {
  const $input_refresh_time = $('#input-refresh-time');
  const $indicateur_refresh_time = $('#input-refresh-time + span');
  $input_refresh_time.addEventListener('change', () => {
    $input_refresh_time.setAttribute('value', $input_refresh_time.value);
    $indicateur_refresh_time.textContent = `${$input_refresh_time.value} min`
  });
  
  $$([
    '#input-url-main', '#input-url-api', '#input-login', '#input-password-api',
    '#input-refresh-time', '#input-active-notifications', '#input-nb-fetch-items'
  ].join(', ')).forEach(input => {
    function handleChange() {
      const name = input.id.substring(6);
      const value = input.value;
  
      browser.runtime.sendMessage({
        name: INPUT_OPTION_CHANGE,
        param: {name, value}
      });
    }
    
    input.addEventListener('input', handleChange);
    input.addEventListener('change', handleChange);
    input.addEventListener('keyup', handleChange);
  });
});