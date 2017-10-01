$(function () {
  const $container = $('.rss-item-container .mCSB_container');
  
  for (let i = 0; i < 5; i++) {
    const rss_item = $(getTemplate('tpl-rss-item'));
    $container.append(rss_item);
  }
});