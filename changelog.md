# 2.0.3
- Code Improvement :
    - use exports.onReady and onUnload on Addon (thx @ZatsuneNoMoku)
    - use EventListener instead onClick attribute
    - in content script : use let instead var
- Fonctionalities
    - Can now click on image to switch item state (read/unread)
        - it will call api and update item

# 2.0.2
- Code improvement :
    - content rss are sanitize before is sent to content script
    - better cache code
        - ```let prefs = require("sdk/simple-prefs");```
        - ```let preferences = prefs.prefs;```
        - ```prefs.on("url", normalizeUserURL);```
        - instead of
        - ```let preferences = require("sdk/simple-prefs").prefs;```
        - ```require("sdk/simple-prefs").on("url", normalizeUserURL)```
    - use more ';'
- Notifications :
    - the nbunread notification appear if they are one or more unreads articles
- Functionalities :
    - fragment code to mark as read/unread an item in panel
    - to see the origin of an item in panel, hover the item title, it will display the origin name (with title attribute in link)
    - set the panel's size
- Panel improvement :
    - better css, why just print 3 lines of an article when you can scroll
    - panel print all content of article
