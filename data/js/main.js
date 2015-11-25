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
* Définition des boutons
*/
let btnRefresh = document.getElementById('btn-refresh');
let btnUnreads = document.getElementById('btn-unreads');

let mainLink = document.getElementById('mainLink');
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
    removeAllChildren(btnUnreads);
    let nodeNbUnread = document.createTextNode(nbunread);
    btnUnreads.appendChild(nodeNbUnread);
})
// met à jours les cards : affiche les 5 derniers flux (en priorisant les non lus)
self.port.on('refresh-additem', (data) => {
    // data.id data.link data.title data.content data.isRead
    let itemrss = document.getElementsByClassName('item-rss')[data.id];
    let header = itemrss.getElementsByClassName('header')[0];

    // title of article
    let titleNode = header.getElementsByTagName('span')[0]
    let newTitleNode = document.createTextNode(data.title);
    titleNode.removeChild(titleNode.childNodes[0]);
    titleNode.appendChild(newTitleNode);

    // link of article
    let linkNode = header.getElementsByTagName('a')[0];
    linkNode.setAttribute('href', data.link);
    linkNode.setAttribute('alt', data.originTitle);
    linkNode.setAttribute('target', "_blank");

    // state of article
    let imgTitleNode = header.getElementsByTagName('img')[0];
    imgTitleNode.setAttribute('src', data.isRead ? '../img/panel/read.svg' : '../img/panel/unread.svg');
    imgTitleNode.setAttribute('itemid', data.itemid);
    imgTitleNode.setAttribute('isRead', data.isRead);
    imgTitleNode.itemid = data.itemid;
    imgTitleNode.isRead = data.isRead;

    // content of article
    let contentNode = itemrss.getElementsByTagName('p')[0];
    removeAllChildren(contentNode);

    let newContentNode = new DOMParser().parseFromString(data.content, 'text/html');
    for (element of newContentNode.body.childNodes) {
        contentNode.appendChild(element);
    }
})

let markNode = [];
/**
* === Gestion des Listener ===
*/
btnRefresh.addEventListener('click', evtRefresh, false);
btnUnreads.addEventListener('click', evtUnreads, false);

let imgs = document.getElementsByClassName('state');
let length = imgs.length;
for (let i = 0; i < length; i++) {
    let img = imgs[i];
    markNode[i] = img;
    img.addEventListener('click', () => {
        self.port.emit('mark-swap', ({itemid: img.itemid, isRead: img.isRead, index: i}))
    }, false);
}
self.port.on('mark-swap', (index) => {
    let img = document.getElementsByClassName('state')[index]
    img.setAttribute('src', img.isRead ? '../img/panel/unread.svg' : '../img/panel/read.svg');
    img.isRead = !img.isRead;
});
