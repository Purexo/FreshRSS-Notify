# FreshRSS-Notify WebExtension

FreshRSS Notify will interact with the API of your FreshRSS instance
develop in javascript with [WebExtension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
This v3 is a port of the v2 in WebExtension, design change a bit, but functionallity are same

## Develop

- Open Firefox and goto [about:profiles](about:profiles)
- Create a new profile named FreshRSS
- `npm start`

## Install

- From [Github Releases](https://github.com/Purexo/FreshRSS-Notify/releases)
- From [Firefox Add-ons](https://addons.mozilla.org/fr/firefox/addon/freshrss-notify-webextension/)

## Deploy

Prerequisites :

- Get your [API Credentials](https://addons.mozilla.org/en-US/developers/addon/api/key/)

```bash
npm run build -- -api-key YOUR_API_KEY --api-secret YOUR_API_SECRET
```