/**
* Evènements de la page (gestion des boutons)
*/

let btnRefresh = document.getElementById('btn-refresh');
let btnUnreads = document.getElementById('btn-unreads');

let mainLink = document.getElementById('mainLink');
self.port.on('mainlink', (link) => {
    mainLink.href = link
    mainLink.target = "_blank"
})

/**
* 1. Force l'actualisation des flux
* 2. Récupère le nombre flux non lus et les 5 derniers items (titre lien résumé) non lu
* 3. Actualise le bouton unreads pour afficher le bon nombre
* 4. Actualise la section #item-rss pour afficher les 5 derniers items non lu
*/
let evtRefresh = function evtRefresh () {
    // lancé quand on clic sur le bouton refresh.
    self.port.emit('refresh', null)
}
self.port.on('refresh-nbunread', (nbunread) => {
    btnUnreads.innerHTML = nbunread
})
self.port.on('refresh-additem', (data) => {
    // data.id data.link data.title data.content data.isRead
    var itemrss = document.getElementsByClassName('item-rss')[data.id]
    var header = itemrss.getElementsByClassName('header')[0]

    var titleNode = header.getElementsByTagName('span')[0]
    var newTitleNode = document.createTextNode(data.title); // + (data.isRead ? " (Lu)" : " (Non lu)")
    titleNode.removeChild(titleNode.childNodes[0]);
    titleNode.appendChild(newTitleNode);
    //titleNode.childNodes[0] = newTitleNode;

    var linkNode = header.getElementsByTagName('a')[0]
    linkNode.href = data.link
    linkNode.target = "_blank"

    var imgTitleNode = header.getElementsByTagName('img')[0]
    //var imgTitleNode = document.createElement('img')
    imgTitleNode.src = data.isRead ? '../img/panel/read.svg' : '../img/panel/unread.svg';
    imgTitleNode.itemid = data.itemid;
    //linkNode.insertBefore(imgTitleNode, titleNode)

    var contentNode = itemrss.getElementsByTagName('p')[0]
    contentNode.innerHTML = data.content;

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
