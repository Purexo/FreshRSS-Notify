# FreshRSS Notify
FreshRSS Notify will interact with the API of your FreshRSS instance

develop in javascript with [Add-on SDK](https://developer.mozilla.org/en-US/Add-ons/SDK)    
this v2 is a total rework of the v1 and it now include a panel

# L'add-on
* [release's list](https://github.com/purexo/FreshRSS-Notify/releases)
* [Now on Firefox addon's page](https://addons.mozilla.org/fr/firefox/addon/freshrss-notify/)
	* waiting review for now

### Instalation :
* about:addons in Firefox's adress bar
* click on the gear -> install from file
* select the .xpi download
	* Don't forget to activate API, and set your password API in your instance of FreshRSS
	* And set your module option
	
### Changelog :
You'll found changelog since v2.0.2 [here](changelog.md)

# Compile from sources :
### Prerequire
* [AddonSDK - Instalation](https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm#Installation)

### Test et compilation :
* Test : jpm run
* compilation : jpm xpi
    * generate trucbidule.xpi in folder

### Known Bug :
* the panel will fetch same articles from your RSS if you don't edit greader.php (api) because the Addon need to exclude target unread item. [see here](https://github.com/purexo/FreshRSS/commit/9534ea0e6b54cd899ac4432f1ae8f14258613ae6)
* Incomplete localization, I can't set English language if you can't use French or English, so you'll have some text a bit cryptic. to correct that :
    * go to [about:config](about:config)
    * add to intl.accept_languages "en, en-US".
    * Reboot Firefox
    * Now it's OK
