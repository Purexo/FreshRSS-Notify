$.ready(() => {
  const $input_refresh_time = $('#input-refresh-time');
  const $indicateur_refresh_time = $('#input-refresh-time + span');
  $input_refresh_time.addEventListener('change', () => {
    $input_refresh_time.setAttribute('value', $input_refresh_time.value);
    $indicateur_refresh_time.textContent = `${$input_refresh_time.value} min`
  })
});