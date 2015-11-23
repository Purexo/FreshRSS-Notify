let self = require('sdk/self');
let Request = require("sdk/request").Request;
let notifications = require("sdk/notifications");
let querystring = require("sdk/querystring");
let tabs = require("sdk/tabs");
var _ = require("sdk/l10n").get;
let preferences = require("sdk/simple-prefs").prefs;
let UI = require("ui.js");
// require('set-login.js');

let panel = UI.panel;
let button = UI.button;

let auth = null;
let getAPI = function getAPI() {
    return preferences.url + preferences.api;
}
let getAuth = function getAuth() {
    return { "Authorization":"GoogleLogin auth=" + auth }
}

function nullAuth(prefName) {
    auth = null;
    connect(false);
}
function normalizeUserURL() { // l'URL doi finir par un slash
    let url = preferences.url;
    preferences.url = !url.endsWith("/") ? url + "/" : url;
    panel.port.emit('mainlink', preferences.url)
    nullAuth()
    // console.log(preferences.url);
}
normalizeUserURL();

function error(title, text) {
    console.error(title, text);
    notifications.notify({
        title: title,
        text: text,
        iconURL: self.data.url('img/button/error.png')
    });
    button.icon = self.data.url('img/button/error.png')
    button.badge = 0;
    button.badgeColor = button.BAD;
}

function refresh() {
    if (auth)
        getFlux();
    else
        connect(true);
}
function connect(fetchrss) {
    let url = getAPI() + "/accounts/ClientLogin?Email=" + preferences.login + "&Passwd=" + preferences.password
    Request({
        url: url,
        onComplete: (response) => {
            auth = querystring.parse(response.text, '\n', '=').Auth;
            let succes = auth ? true : false;

            if (succes) {
                if (fetchrss) getFlux();
            } else {
                console.error("connect onComplete : fail");
                error(_("Impossible connexion"), _("Check your ids or instance URL"))
            }
        }
    }).get();
}
function getFlux() {
    function getStreamContent(nb, startindex, filter, isRead) {
        nb = nb ? nb : 5;
        if (nb === 0) return null;
        nb = encodeURI("&n=" + nb)
        startindex = startindex ? startindex : 0;
        filter = filter ? filter : "xt=user/-/state/com.google/read"
        filter = encodeURI("&" + filter)
        isRead = isRead ? isRead : false;

        let streamContent = Request({
            url: getAPI() + "/reader/api/0/stream/contents/reading-list?output=json&r=n" + nb + filter,
            headers: getAuth(),
            onComplete: (response) => {
                let json = response.json;

                if (json) {
                    let items = json.items;
                    let length = items.length;
                    for (let i = 0; i < length; i++) {
                        let item = items[i];
                        let rss = {
                            'id' : i + startindex,
                            'link' : item.alternate[0].href,
                            'title' : item.title,
                            'content' : item.summary.content,
                            'isRead' : isRead,
                            'itemid' : item.id
                        }
                        panel.port.emit('refresh-additem', rss);
                    }
                }
                else {
                    console.error('StreamContent : Echec !\n', response.text)
                }
            }
        }).get()
    }
    let unreadNbRequest = Request({
        url: getAPI() + "/reader/api/0/unread-count?output=json",
        headers: getAuth(),
        onComplete: (response) => {
            let json = response.json;
            let text = response.text;

            if (json) {
                console.log("unreadComplete : Succes !\n", json);
                let nbunread = json.max;

                // lance un event pour la page client
                panel.port.emit('refresh-nbunread', _('unread x', nbunread))

                let nbfetchunread = nbunread > 5 ? 5 : nbunread;
                // fetch unreads
                getStreamContent(nbfetchunread)
                // fetch read
                getStreamContent(5 - nbfetchunread, nbfetchunread, "xt=user/-/state/com.google/unread", true)

                // feedback
                button.icon = self.data.url('img/button/icon.png');
                button.badge = nbunread;
                button.badgeColor = nbunread > 0 ? button.BAD : button.OK;
                notifications.notify({
                    title: _('You have x unreads articles', nbunread),
                    iconURL: self.data.url('img/button/icon.png'),
                    onClick: (data) => {
                        tabs.open(preferences.url + "p/i");
                    }
                });
            } else {
                console.error("unreadComplete : echec ! \n" + text);
                error(_('Request Fail, Impossible to fetch unreads count'),text);
            }
        }
    }).get();
}

/**
* écoute du contentScriptFile du panel
*/
panel.port.on("refresh", refresh)
panel.port.on('open-rss', () => {
    tabs.open(preferences.url);
})

/**
* Refresh régulier
*/
let { setTimeout, clearTimeout } = require("sdk/timers");
let idTimeOut;
function loop() {
    refresh()
    idTimeOut = setTimeout(loop, preferences.delay * 60 * 1000)
}
loop()

function resetLoop() {
    clearTimeout(idTimeOut)
    loop()
}

/**
* écoute des préférences
*/
require("sdk/simple-prefs").on("url", normalizeUserURL);
require("sdk/simple-prefs").on("api", nullAuth);
require("sdk/simple-prefs").on("login", nullAuth);
require("sdk/simple-prefs").on("password", nullAuth);
require("sdk/simple-prefs").on("delay", resetLoop);
