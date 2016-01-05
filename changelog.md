# 2.1.1
- Bugfix :
    - hardcode add some unlogical when open FreshRSS instance ('/p/i') with new url system, we don't need to add this
    - use local img instead hotlink FreshRSS Logo
    - all imported link (from rss stream) are now target \_blank
- Code :
    - use querySelector insteal getElement...
    - use $ for document.querySelector and $$ for document.querySelectorAll
- Improvements :
    - The Addon can unload EventListener when shutdown/desactivate
    - parser and sanitizer work well, but should use innerHTML twice, really don't have choice.
        - Now with innerHTML, I don't have any bug with pictures or link who don't appear.
    - replace some text in panel to icon.
    - Add .jpmignore (don't package useless assets)

# 2.1.0
- Bugfix :
    - Link in panel are now all target \_blank
- Compatibilities
    - /!\\ breaking changes :
        - Now, APIUrl should be absolute and point to API Folder (http://example.com/FreshRSS/p/api/)
            - Don't Forget to set this

# 2.0.3
- Code Improvement :
    - use exports.main and onUnload on Addon (thx @ZatsuneNoMoku)
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
    - img in content flux have now max-width: 100%;
    - panel print all content of article
