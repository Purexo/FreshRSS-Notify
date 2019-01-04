let background;
const manager = new EventsManager();

function listenRuntimeMessage() {
  browser.runtime.onMessage.addListener(({name=undefined, ...data}) => {
    if (!name) return;
    
    manager.fire(name, data);
  });
}

function renewFromCache({rss, unreads, params}) {
  if (rss) {
    for (let [id, item] of rss) {
      manager.fire(EVENT_OBTAIN_RSS, {id, rss: item});
    }
  } else {
    browser.runtime.sendMessage({name: EVENT_REQUEST_RSS}).catch(console.error);
  }

  unreads
    ? manager.fire(EVENT_OBTAIN_NBUNREADS, {nbunreads: unreads})
    : browser.runtime.sendMessage({name: EVENT_REQUEST_NBUNREADS}).catch(console.error);

  params
    ? manager.fire(EVENT_OBTAIN_PARAMS, {params})
    : browser.runtime.sendMessage({name: EVENT_REQUEST_PARAMS}).catch(console.error);
}

(async function () {
  background = await browser.runtime.getBackgroundPage();
  const $container = $('.rss-item-container');
  const $unreads = $('.js-nb-unreads');
  const $btn_refresh = $('.js-refresh');
  const $rss_instance_link = $('.js-rss-instance-link');
  
  manager.on(EVENT_OBTAIN_NBUNREADS, ({nbunreads}) => $unreads.text(nbunreads));
  manager.on(EVENT_OBTAIN_RSS, ({id, rss}) => {
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
      .on('click', event => {
        event.preventDefault();

        browser.tabs.create({active: true, url: event.currentTarget.getAttribute('href')})
          .catch(console.error)
      })
      .attr('href', rss.link)
      .text(rss.title);

    const docHTML = new DOMParser().parseFromString(DOMPurify.sanitize(rss.content), 'text/html');
    const rssContent = $rss_item.find('.tpl-rss-content')
      .on('click', 'a', event => {
        event.preventDefault();

        browser.tabs.create({active: false, url: event.currentTarget.getAttribute('href')})
          .catch(console.error)
      })
      .get(0);

    while (rssContent.hasChildNodes()) {
      rssContent.firstChild.remove();
    }

    while(docHTML.body.hasChildNodes()) {
      rssContent.appendChild(docHTML.body.firstChild);
    }
    
    $rss_item.find('.tpl-rss-origin-title')
      .attr('href', rss.origin.htmlUrl || rss.origin.url)
      .text(rss.origin.title);

    $rss_item.find('.js-swap').on('click', event => {
      event.preventDefault();

      browser.runtime.sendMessage({
        name: EVENT_REQUEST_SWAP,
        itemid: rss.itemid,
        isRead: rss.isRead,
      }).catch(console.error);

      $swap_icon
        .toggleClass('fa-envelope-open-o')
        .toggleClass('fa-envelope-o')
        .toggleClass('text-secondary')
        .toggleClass('text-danger')
    })
  });

  manager.on(
    EVENT_OBTAIN_PARAMS,
    ({params}) => $rss_instance_link.attr('href', params[PARAM_URL_MAIN])
  );

  $btn_refresh.on(
    'click',
    () => browser.runtime
      .sendMessage({name: EVENT_REQUEST_RSS, runNow: true})
      .catch(console.error)
  );
  
  listenRuntimeMessage();
  renewFromCache(background.cache);
})();