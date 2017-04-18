$.ready(() => {
  const $input_refresh_time = $('#input-refresh-time');
  $input_refresh_time.addEventListener('change', () => {
    $input_refresh_time.setAttribute('value', $input_refresh_time.value);
  })
});