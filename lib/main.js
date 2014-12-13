/* --- import lib sdk --- */
var { ActionButton } = require("sdk/ui/button/action");
var tabs = require("sdk/tabs"); // ouverture d'onglet
var preferences = require("sdk/simple-prefs").prefs;
var Request = require("sdk/request").Request;
var querystring = require("sdk/querystring");
var notifications = require("sdk/notifications");

/* --- variable perso --- */
var api = "/p/api/greader.php/";
var auth = null;
var nbunread = 0;
var json = null;
var succes = false;

/* --- Bouton (base du module) --- */
/* cliquer dessus -> actualise (verifie l'existance de nouveau articles non lu) -> lance une notification (cliquable)
/* system de badge dispo a partir de firefox 36
/* --- --- */
var button = ActionButton({
    id: "FreshRSS",
    label: "FreshRSS Notify",
    icon: "./empty.png",
    badge: nbunread,
    badgeColor: preferences.badgeEmpty,
    onClick: clickGauche
});

function clickGauche(state) {
    refreshRSS();
}

function refreshRSS() {
    /* --- Algo --- 
    lecture du nombre d'article non lu
    si pas de resultat (on est pas connecté)
        connection
        si echec de la connection
            indication visuelle
            quit la fonction
        relecture du nombre d'article non lu
    indication visuelle
    /* --- --- */
    if (auth == null) {
        connect();
        if (!succes) {
            console.log("echec de la connection");
            button.badge = -1;
            button.badgeColor = preferences.badgeNotEmpty;
            button.icon = "./error.png";

            notifications.notify({
                text: "Connection impossible",
                iconURL: "./error.png"
            });
            return null;
        }
    }
    unread();
    button.badge = nbunread;
    button.badgeColor = nbunread > 0 ? preferences.badgeNotEmpty : preferences.badgeEmpty;
    button.icon = nbunread > 0 ? "./icon.png" : "./empty.png";

    notifications.notify({
        title: "FreshRSS",
        text: "Vous avez : " + nbunread + " articles non lu",
        onClick: function (data) {
            tabs.open(preferences.url);
        }
    });
}

function connect() {
    var connectionRequest = Request({
        url: preferences.url + api + "/accounts/ClientLogin?Email=" + preferences.login + "&Passwd=" + preferences.password,
        onComplete: connectComplete
    }).get();
}
function connectComplete(response) {
    auth = querystring.parse(response.text, '\n', '=').Auth;
    if (auth != null) succes = true;
}

function unread() {
    var unreadRequest = Request({
        url: preferences.url + api + "/reader/api/0/unread-count?output=json",
        headers: {
            "Authorization":"GoogleLogin auth=" + auth
        },

        onComplete: unreadComplete
    }).get();
}
function unreadComplete(response) {
    console.log(response.text + "\n" + response.json.max);
    nbunread = response.json.max;
    json = response.json;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function loop () { // actualise regulierement l'addon
    refreshRSS();
    setTimeout(loop(), preferences.delay * 60 * 1000);
}

/* --- test --- 
preferences.url = "https://purexo.eu/FreshRSS/";
preferences.login = "Purexo";
preferences.password = "";

/* --- Programmme ---*/
connect();
unread();

loop();
/* --- --- */