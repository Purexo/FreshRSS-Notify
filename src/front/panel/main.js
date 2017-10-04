function listenRuntimeMessage(background) {
  background.runtime.onMessage.addListener(({name=undefined, ...data}) => {
    if (!name) return;
    
    console.log(`FRONT_RUNTIME_ONMESSAGE: ${name} with `, data);
    
    manager.fire(name, data);
  });
}

function renewFromCache(background) {
  if (background.cache.rss) {
    for (let [index, rss] of background.cache.rss) {
      manager.fire(EVENT_OBTAIN_RSS, {rss});
    }
  } else {
    background.runtime.sendMessage({name: EVENT_REQUEST_RSS});
  }
  
  if (background.cache.unreads) {
    manager.fire(EVENT_OBTAIN_NBUNREADS, {nbunreads: background.cache.unreads});
  } else {
    background.runtime.sendMessage({name: EVENT_REQUEST_NBUNREADS});
  }
  
  if (background.cache.params) {
    manager.fire(EVENT_OBTAIN_PARAMS, {params: background.cache.params});
  } else {
    background.runtime.sendMessage({name: EVENT_REQUEST_PARAMS});
  }
}

$(async function () {
  const background = await browser.runtime.getBackgroundPage();
  
  const $container = $('.rss-item-container .mCSB_container');
  const $unreads = $('.js-nb-unreads');
  
  manager.addListener(EVENT_OBTAIN_NBUNREADS, ({data: {nbunreads}}) => {
    $unreads.text(nbunreads);
  });
  
  $container.css({
    'display': 'flex',
    'flex-direction': 'column'
  });
  
  manager.addListener(EVENT_OBTAIN_RSS, ({data: {rss}}) => {
    // remove old item
    $container.find(`.rss-item[data-order=${rss.id}]`).remove();
    
    const $rss_item = $(getTemplate('tpl-rss-item')).find('.rss-item');
    $container.append($rss_item);
    
    $rss_item
      .attr('data-order', rss.id)
      .attr('data-id', rss.itemid)
      .css('order', rss.id);
    
    const $swap_icon = $rss_item.find('.js-swap .fa');
    $swap_icon.addClass(rss.isRead ? 'fa-envelope-open-o' : 'fa-envelope-o');
    $swap_icon.addClass(rss.isRead ? 'text-secondary' : 'text-danger');
    
    $rss_item.find('.tpl-rss-title')
      .attr('href', rss.link)
      .text(rss.title);
    
    $rss_item.find('.tpl-rss-content').html(rss.content);
    
    $rss_item.find('.tpl-rss-origin-title')
      .attr('href', rss.origin.htmlUrl || rss.origin.url)
      .text(rss.origin.title);
  });
  
  const $btn_refresh = $('.js-refresh');
  $btn_refresh.click(_ => background.runtime.sendMessage({name: EVENT_REQUEST_RSS, runNow: true}));
  
  const $rss_instance_link = $('.js-rss-instance-link');
  manager.addListener(EVENT_OBTAIN_PARAMS, ({data: {params}}) => {
    $rss_instance_link.attr('href', params[PARAM_URL_MAIN]);
  });
  
  listenRuntimeMessage(background);
  renewFromCache(background);
});