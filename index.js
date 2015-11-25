let self = require('sdk/self');
let Request = require("sdk/request").Request;
let notifications = require("sdk/notifications");
let querystring = require("sdk/querystring");
let tabs = require("sdk/tabs");
var _ = require("sdk/l10n").get;
let { setTimeout, clearTimeout } = require("sdk/timers");
let prefs = require("sdk/simple-prefs");
let preferences = prefs.prefs;

/**
* @author : A FUCKING THANKS TO YOU Wladimir Palant : http://stackoverflow.com/a/13303591
*/
let { Cc, Ci } = require("chrome");
var parser = Cc["@mozilla.org/parserutils;1"].getService(Ci.nsIParserUtils);
/* --- Really Thank You --- */

let UI = require("ui.js");
// require('set-login.js');

let panel = UI.panel;
let button = UI.button;

let auth = null;
let getAPI = function getAPI() {
    return preferences.api + "greader.php";
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
    let api = preferences.api;
    preferences.url = !url.endsWith("/") ? url + "/" : url;
    preferences.api = !api.endsWith("/") ? api + "/" : api;
    panel.port.emit('mainlink', preferences.url);
    nullAuth();
}

function error(title, text) {
    console.error(title, text);
    notifications.notify({
        title: title,
        text: text,
        iconURL: self.data.url('img/button/error.png')
    });
    button.icon = self.data.url('img/button/error.png');
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
    let url = getAPI() + "/accounts/ClientLogin?Email=" + preferences.login + "&Passwd=" + preferences.password;
    Request({
        url: url,
        onComplete: (response) => {
            auth = querystring.parse(response.text, '\n', '=').Auth;
            let succes = auth ? true : false;

            if (succes) {
                if (fetchrss) getFlux();
            } else {
                console.error("connect onComplete : fail");
                error(_("Impossible connexion"), _("Check your ids or instance URL"));
            }
        }
    }).get();
}
function getFlux() {
    function getStreamContent(nb, startindex, filter, isRead) {
        nb = nb ? nb : 5;
        if (nb === 0) return null;
        nb = encodeURI("&n=" + nb);
        startindex = startindex ? startindex : 0;
        filter = filter ? filter : "xt=user/-/state/com.google/read";
        filter = encodeURI("&" + filter);
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
                        let html = parser.sanitize(item.summary.content, parser.SanitizerAllowComments);
                        let rss = {
                            'id' : i + startindex,
                            'link' : item.alternate[0].href,
                            'title' : item.title,
                            'originTitle' : item.origin.title,
                            'content' : html,
                            'isRead' : isRead,
                            'itemid' : item.id
                        }
                        panel.port.emit('refresh-additem', rss);
                    }
                }
                else {
                    console.error('StreamContent : Echec !\n', response.text);
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
                panel.port.emit('refresh-nbunread', _('unread x', nbunread));

                let nbfetchunread = nbunread > 5 ? 5 : nbunread;
                // fetch unreads
                getStreamContent(nbfetchunread);
                // fetch read
                getStreamContent(5 - nbfetchunread, nbfetchunread, "xt=user/-/state/com.google/unread", true);

                // feedback
                button.icon = self.data.url('img/button/icon.png');
                button.badge = nbunread;
                if (nbunread > 0) {
                    button.badgeColor = button.BAD;
                    notifications.notify({
                        title: _('You have x unreads articles', nbunread),
                        iconURL: self.data.url('img/button/icon.png'),
                        onClick: (data) => {
                            tabs.open(preferences.url + "p/i");
                        }
                    });
                } else {
                    button.badgeColor = button.OK;
                }
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
panel.port.on("refresh", refresh);
panel.port.on('open-rss', () => {
    tabs.open(preferences.url);
});

panel.port.on('mark-swap', (data) => {
    // data.itemid data.isRead
    function swapeState(token, itemid, isRead, index) {
        let req = 'i=' + encodeURI('tag:google.com,2005:reader/item/' + itemid) + '&';
        req += 'T=' + token + '&';
        req += isRead ?
               'r=' + encodeURI('user/-/state/com.google/read') :
               'a=' + encodeURI('user/-/state/com.google/read');
        Request({
            url: getAPI() + '/reader/api/0/edit-tag',
            content: req,
            headers: getAuth(),
            onComplete: (rep) => {
                panel.port.emit('mark-swap', index);
                button.badge += isRead ? 1 : -1;
                panel.port.emit('refresh-nbunread', _('unread x', button.badge));
            }
        }).post();
    }

    Request({
        url: getAPI() + '/reader/api/0/token',
        headers: getAuth(),
        onComplete: (response) => {
            if (response.status == 200) { // OK
                swapeState(response.text, data.itemid, data.isRead, data.index);
            } else {
                error(_("Can't get Token"), _("check your ids"));
                // nullAuth();
            }
        }
    }).get();
});

/**
* Refresh régulier
*/
let idTimeOut;
function loop() {
    refresh();
    idTimeOut = setTimeout(loop, preferences.delay * 60 * 1000);
}

function resetLoop() {
    clearTimeout(idTimeOut);
    loop();
}

/**
* écoute des préférences
*/
prefs.on("url", normalizeUserURL);
prefs.on("api", normalizeUserURL);
prefs.on("login", nullAuth);
prefs.on("password", nullAuth);
prefs.on("delay", resetLoop);
prefs.on("height", () => {
    panel.height = preferences.height;
});
prefs.on("width", () => {
    panel.width = preferences.width;
});

/**
 * Load and Unload Addon
 */
exports.main = (reason, callback) => {
    panel.height = preferences.height;
    panel.width = preferences.width;
    normalizeUserURL();
    loop();
    callback();
}
exports.onUnload = (reason) => {
    clearTimeout(idTimeOut);
}
