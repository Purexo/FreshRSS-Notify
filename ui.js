let self = require('sdk/self');
let { ToggleButton } = require('sdk/ui/button/toggle');
let panels = require("sdk/panel");

/**
* Lancement du Bouton et du Panel
*/
let button = ToggleButton({
    id: "FreshRSSAddonButton",
    label: "FreshRSS-Notify Addon",
    icon: self.data.url("img/button/error.png"),
    badge: 0,
    badgeColor: "#00A801",
    onChange: handleChange
});
button.OK = "#00A801";
button.BAD = "#EE0101"
exports.button = button;

let panel = panels.Panel({
    height: 600,
    width: 600,
    contentURL: self.data.url("tpl/main.html"),
    contentScriptFile: self.data.url("js/main.js"),
    contextMenu: true,
    onHide: handleHide
});
exports.panel = panel;

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}
