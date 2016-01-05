/**
* === Gestion DOM ===
* @author : Taken from https://stackoverflow.com/questions/683366/remove-all-the-children-dom-elements-in-div
* @param node : Dom Element where you want delete all children node
*/
function removeAllChildren(node){
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

/**
* @author Purexo <contact@purexo.eu>
* A selector System like jquery with native javascript
* @param query : <string> It's the query string, same as CSS
* usage :
*   let nodes = $$('.test') return all elements who have class test atributes
*   let node  = $('#test') return first element who have id test atributes
*/
let $ = (query) => { return document.querySelector(query);};
let $$ = (query) => { return document.querySelectorAll(query);};

/**
* Définition des boutons
*/
let btnRefresh = $('#btn-refresh');
let btnUnreads = $('#btn-unreads');

let mainLink = $('#mainLink');
self.port.on('mainlink', (link) => {
    mainLink.href = link;
    mainLink.target = "_blank";
})

/**
* === Gestion des Evenements ===
*/
// appele le refresh
let evtRefresh = function evtRefresh () {
    // lancé quand on clic sur le bouton refresh.
    self.port.emit('refresh', null);
}
// Redirige vers la page des flux RSS pour les lire.
let evtUnreads = function evtUnreads () {
    // lancé quand on clic sur le bouton unread
    self.port.emit('open-rss', null);
}

// Actualise le bouton pour savoir combien il y a de flux non lus
self.port.on('refresh-nbunread', (nbunread) => {
    /*
    removeAllChildren(btnUnreads);
    let nodeIconUnread = document.createElement(i);
    nodeIconUnread.className = 'material-icons';
    let nodeIconUnreadText = document.createTextNode('markunread');
    nodeIconUnread.appendChild(nodeIconUnreadText);
    btnUnreads.appendChild(nodeIconUnread);

    let nodeNbUnread = document.createTextNode(nbunread);
    btnUnreads.appendChild(nodeNbUnread);
    /**/
    btnUnreads.innerHTML = `<i class="material-icons">markunread</i> ${parseInt(nbunread, 10)}`;
    // sorry, innerHTML work as expected...
})
// met à jours les cards : affiche les 5 derniers flux (en priorisant les non lus)
self.port.on('refresh-additem', (data) => {
    // data.id data.link data.title data.content data.isRead
    let itemrss = $$('.item-rss')[data.id];
    let header = itemrss.querySelector('.header');

    // title of article
    let titleNode = header.querySelector('span');
    let newTitleNode = document.createTextNode(data.title);
    titleNode.removeChild(titleNode.childNodes[0]);
    titleNode.appendChild(newTitleNode);

    // link of article
    let linkNode = header.querySelector('a');
    linkNode.setAttribute('href', data.link);
    linkNode.setAttribute('alt', data.originTitle);
    linkNode.setAttribute('target', "_blank");

    // state of article
    let imgTitleNode = header.querySelector('img');
    imgTitleNode.setAttribute('src', data.isRead ? '../img/panel/read.svg' : '../img/panel/unread.svg');
    imgTitleNode.setAttribute('itemid', data.itemid);
    imgTitleNode.setAttribute('isRead', data.isRead);
    imgTitleNode.itemid = data.itemid;
    imgTitleNode.isRead = data.isRead;

    // content of article
    let contentNode = itemrss.querySelector('p');
    removeAllChildren(contentNode);

    let newContentNode = new DOMParser().parseFromString(data.content, 'text/html');
    contentNode.innerHTML = newContentNode.body.innerHTML; // don't have choice, other methods don't work properly
    /*
    for (element of newContentNode.body.childNodes) {
        contentNode.appendChild(element);
    }
    */
    for (let item of contentNode.querySelectorAll('a')) {
        item.target = '_blank';
    }
})

/**
* === Gestion des Listener ===
*/
btnRefresh.addEventListener('click', evtRefresh, false);
btnUnreads.addEventListener('click', evtUnreads, false);

let markNodeList = [];
let imgs = $$('#items-rss > .item-rss > .header > img.state');
let length = imgs.length;
for (let i = 0; i < length; i++) {
    let img = imgs[i];
    markNodeList[i] = img;
    let func = () => {
        self.port.emit('mark-swap', ({itemid: img.itemid, isRead: img.isRead, index: i}))
    }
    img.func = func;
    img.addEventListener('click', func, false);
}
self.port.on('mark-swap', (index) => {
    let img = $$('#items-rss > .item-rss > .header > img.state')[index];
    img.setAttribute('src', img.isRead ? '../img/panel/unread.svg' : '../img/panel/read.svg');
    img.isRead = !img.isRead;
});

function removeImgEventListener() {
    let length = markNodeList.length;
    for (let i = 0; i < length; i++) {
        let img = markNodeList[i];
        img.removeEventListener('click', img.func, false);
        delete img.func;
    }
}
function removeAllEventListener() {
    removeImgEventListener();
    btnRefresh.removeEventListener('click', evtRefresh, false);
    btnUnreads.removeEventListener('click', evtUnreads, false);
}
self.port.on('remove-all-evt-listener', () => {
    removeAllEventListener();
});
