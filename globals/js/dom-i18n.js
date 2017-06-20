/**
 * Created by Purexo on 20/06/2017.
 */

$$('[data-i18n]').forEach(element => {
  element.textContent = gettext(element.getAttribute('data-i18n'));
});