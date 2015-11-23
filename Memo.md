# Indication pour user
https://github.com/FreshRSS/FreshRSS/issues/704#issuecomment-158750428
petite édition à faire dans greader.php

# Stylesheet
- Theme : https://www.google.com/design/spec/style/color.html#color-themes
    - Dark theme
    - Roboto Font : http://www.fontsquirrel.com/fonts/roboto
        - roboto Regular
        - roboto Medium
        - roboto Light
- button : https://www.google.com/design/spec/components/buttons.html#buttons-flat-raised-buttons
    - Flat Dark/Dark theme : pour les boutons de la barre du haut

# Not Use innerHTML:
- https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/DOM_Building_and_HTML_Insertion#Safely_Using_Remote_HTML
- https://developer.mozilla.org/fr/docs/Web/API/DOMParser#Browser_compatibility
- https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIParserUtils#sanitize%28%29
- http://stackoverflow.com/a/13303591
- http://stackoverflow.com/a/3104237

# Greader API

## Authentification (GET)
- https://purexo.eu/FreshRSS/p/api/greader.php/accounts/ClientLogin?Email=XXXXXX&Passwd=XXXXXXX
## unread (GET)
- https://purexo.eu/FreshRSS/p/api/greader.php/reader/api/0/unread-count?output=json

```json
{
    "max": 1,
    "unreadcounts": [
        {
            "id": "feed/109",
            "count": 0,
            "newestItemTimestampUsec": "1447708543000000"
        } ...
    ]
}
```

## Stream
- https://purexo.eu/FreshRSS/p/api/greader.php/reader/api/0/stream/contents/reading-list?output=json

```
xt=user/-/state/com.google/read // on exclu les lu
s=user/-/state/com.google/read // on prends les lu
user/-/state/com.google/reading-list
n=5
r=n

user%2F-%2Fstate%2Fcom.google%2Fread?
```

```json
{
    "id": "user/-/state/com.google/reading-list",
    "updated": 1447936266,
    "items": [
        {
            "id": "000524e3b5e3fac9",
            "crawlTimeMsec": "1447935311346",
            "timestampUsec": "1447935311346377",
            "published": 1447933080,
            "title": "Note : Liberté contre sécurité",
            "summary": {
                "content": "Je suis sidéré par la volonté des gens à sacrifier leurs libertés sur l'autel du terrorisme. Comme si vivre dans un état policier était préférable à subir des attentats. <br>\nBen vous savez quoi ? Les réfugiés fuient un état policier. Vous voulez les accompagner pour les y renvoyer ? <br><br><br>\nAlors donner un cadre législatif adapté et moderne pour permettre aux services anti-terroristes de faire leur boulot, oui, à 100%.<br><br>\nMais leur donner les plein pouvoirs afin de bafouer les libertés et les droits de tout le monde, non.<br><br>\nIl y a d'autres façons de faire, peut-être déjà en augmentant l'efficacité et le nombre de tribunaux, histoire que les perquisition et les condamnations soient plus rapides et ne mettent pas 3 ans pour se faire.<br><br>\nBien sûr, ça coutera plus cher et sera plus compliqué, mais c'est le prix à payer pour vivre en démocratie plutôt que dans un état policier.<br><br>\n(mais j'imagine que chacun a ses priorités)"
            },
            "alternate": [
                {
                    "href": "http://lehollandaisvolant.net/?mode=links&amp;id=20151119123833"
                }
            ],
            "categories": [
                "user/-/state/com.google/reading-list",
                "user/-/label/Internet : Débat - Liberté d'expression"
            ],
            "origin": {
                "streamId": "feed/30",
                "title": "le hollandais volant - Shaarli"
            }
        }
    ],
    "continuation": "1447920949783050"
}
```

## List ID (GET)
- https://purexo.eu/FreshRSS/p/api/greader.php/reader/api/0/stream/items/ids?output=json

```
s=user/-/state/com.google/reading-list
n=5
```

```json
{"itemRefs":[{"id":"1447604145591397"},{"id":"1447503318677675"},{"id":"1447499711565370"},{"id":"1447449313580180"},{"id":"1447341310807494"}]}
```

## Item contents (POST)
- https://purexo.eu/FreshRSS/p/api/greader.php/reader/api/0/stream/items/contents?output=json

```
i=tag:google.com,2005:reader/item/00157a17b192950b65be3791
i=1447604145591397
```

## Stream contents (GET)
- https://purexo.eu/FreshRSS/p/api/greader.php/reader/api/0/stream/contents?output=json

```
i=tag:google.com,2005:reader/item/1447604145591397
```
