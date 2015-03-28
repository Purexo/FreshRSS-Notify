/* --- import lib sdk --- */
var { ActionButton } = require("sdk/ui/button/action");
var tabs = require("sdk/tabs"); // ouverture d'onglet
var preferences = require("sdk/simple-prefs").prefs;
var Request = require("sdk/request").Request;
var querystring = require("sdk/querystring");
var notifications = require("sdk/notifications");
/* --- Listener --- */
require("sdk/simple-prefs").on("url", normalizeUserURL);
require("sdk/simple-prefs").on("login", nullAuth);
require("sdk/simple-prefs").on("password", nullAuth);

/* --- variable perso --- */
var api = "p/api/greader.php/"; // le slash de l'adresse est deja mis, s'il est doublé, le formulaire d'inscription bug
var login = "p/i/?a=formLogin";
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
    badgeColor: preferences.badgeError,
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
    if (auth === null) {
        connect();
    } else {
        unread();
    }
}

function connect() {
    var connectionRequest = Request({
        url: preferences.url + api + "/accounts/ClientLogin?Email=" + preferences.login + "&Passwd=" + preferences.password,
        onComplete: connectComplete
    }).get();
}
function connectComplete(response) {
    console.log("connectComplete : \n" + response.text);
    auth = querystring.parse(response.text, '\n', '=').Auth;
    succes = auth !== null;

    if (!succes) {
        console.log("connectComplete : echec");
        error("Connection impossible");
    } else {
        unread();
    }
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
    json = response.json;
    text = response.text;

    if (json !== null) {
        console.log("unreadComplete : Succes ! ");
        nbunread = json.max;

        button.badge = nbunread;
        button.badgeColor = preferences.badgeNoError;
        button.icon = nbunread > 0 ? "./icon.png" : "./empty.png";

        notifications.notify({
            title: "FreshRSS",
            text: "Vous avez : " + nbunread + " articles non lu",
            iconURL: button.icon,
            onClick: function (data) {
                tabs.open(preferences.url + login);
            }
        });
    } else {
        console.log("unreadComplete : echec ! \n" + text);
        error(text);
    }
}

function error(text) {
    nbunread = -1;
    button.badge = nbunread;
    button.badgeColor = preferences.badgeError;
    button.icon = "./error.png";

    notifications.notify({
        title: "FreshRSS",
        text: "Error : " + text,
        iconURL: button.icon,
        onClick: function (data) {
            tabs.open(preferences.url + login);
        }
    });
}

function loop () { // actualise regulierement l'addon
    refreshRSS();
    setTimeout(loop(), preferences.delay * 60 * 1000 / 2);
}

function normalizeUserURL() { // l'URL doi finir par un slash
    var url = preferences.url;
    preferences.url = !url.endsWith("/") ? url + "/" : url;
    console.log(preferences.url);
}

function nullAuth(prefName) {
    auth = null;
    connect();
}

/* --- test ---
preferences.url = "https://purexo.eu/FreshRSS/";
preferences.login = "demo";
preferences.password = "demodemo";
preferences.delay = 15;

/* --- Programmme ---*/
normalizeUserURL();

loop();
/* --- --- */
