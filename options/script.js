$.ready(() => {
  /* --- refresh block --- */
  const $refreshBlock = $('#block-refresh-time');
  const $refreshInput = $('input', $refreshBlock);
  const $refreshHelper = $('input + span', $refreshBlock);

  const refreshInputChange = event => $refreshHelper.textContent = `${event.target.value} min`;
  $refreshInput.addEventListener('input', refreshInputChange);
  $refreshInput.addEventListener('change', refreshInputChange);
  $refreshHelper.textContent = `${$refreshInput.value} min`;
});