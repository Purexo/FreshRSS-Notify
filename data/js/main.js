/**
* Evènements de la page (gestion des boutons)
*/

let btnRefresh = document.getElementById('btn-refresh');
let btnUnreads = document.getElementById('btn-unreads');

let mainLink = document.getElementById('mainLink');
self.port.on('mainlink', (link) => {
    mainLink.href = link;
    mainLink.target = "_blank";
})

/**
 * @author : Taken from https://stackoverflow.com/questions/683366/remove-all-the-children-dom-elements-in-div
 * @param node : Dom Element where you want delete all children node
 */
function removeAllChildren(node){
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

/**
* 1. Force l'actualisation des flux
* 2. Récupère le nombre flux non lus et les 5 derniers items (titre lien résumé) non lu
* 3. Actualise le bouton unreads pour afficher le bon nombre
* 4. Actualise la section #item-rss pour afficher les 5 derniers items non lu
*/
let evtRefresh = function evtRefresh () {
    // lancé quand on clic sur le bouton refresh.
    self.port.emit('refresh', null);
}
self.port.on('refresh-nbunread', (nbunread) => {
    removeAllChildren(btnUnreads);
    var nodeNbUnread = document.createTextNode(nbunread);
    btnUnreads.appendChild(nodeNbUnread);
})
self.port.on('refresh-additem', (data) => {
    // data.id data.link data.title data.content data.isRead
    var itemrss = document.getElementsByClassName('item-rss')[data.id];
    var header = itemrss.getElementsByClassName('header')[0];

    // title of article
    var titleNode = header.getElementsByTagName('span')[0]
    var newTitleNode = document.createTextNode(data.title);
    titleNode.removeChild(titleNode.childNodes[0]);
    titleNode.appendChild(newTitleNode);

    // link of article
    var linkNode = header.getElementsByTagName('a')[0];
    linkNode.setAttribute('href', data.link);
    linkNode.setAttribute('alt', data.originTitle);
    linkNode.setAttribute('target', "_blank");

    // state of article
    var imgTitleNode = header.getElementsByTagName('img')[0];
    imgTitleNode.setAttribute('src', data.isRead ? '../img/panel/read.svg' : '../img/panel/unread.svg');
    imgTitleNode.setAttribute('itemid', data.itemid);
    imgTitleNode.setAttribute('isRead', data.isRead);
    imgTitleNode.setAttribute('onClick', self.port.emit('mark-swap', ({itemid: this.itemid, isRead: this.isRead})));

    // content of article
    var contentNode = itemrss.getElementsByTagName('p')[0];
    removeAllChildren(contentNode);

    var newContentNode = new DOMParser().parseFromString(data.content, 'text/html');
    for (element of newContentNode.body.childNodes) {
        contentNode.appendChild(element);
    }
})

/**
* Redirige vers la page des flux RSS pour les lire.
*/
let evtUnreads = function evtUnreads () {
    // lancé quand on clic sur le bouton unread
    self.port.emit('open-rss', null);
}
/*
function clickimage() {
    // this.itemid
}
var itemsrss = document.getElementsByClassName('item-rss')
var length = itemsrss.length
for (var i = 0; i < length, i++) {
    var header = itemsrss[i].getElementsByClassName('header')[0]
    var img = header.getElementsByTagName('img')[0]

    img.addEventListener("click", clickimage, false)
}
*/
btnRefresh.addEventListener('click', evtRefresh, false);
btnUnreads.addEventListener('click', evtUnreads, false);
