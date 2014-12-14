# FreshRSS Notify
add-on firefox interagissant avec l'api de FreshRSS pour notifier les nouveaux articles

codé en javascript avec le [Add-on SDK](https://developer.mozilla.org/en-US/Add-ons/SDK)

# L'add-on 
* [Liste des realease](https://github.com/purexo/FreshRSS-Notify/releases)

### Instalation :
* about:addons dans la barre d'adresse de firefox
* en haut a droite petite roue cranté : installer un module depuis un fichier.
* sélectionner le .xpi téléchargé préalablement
	* N'oubliez pas de configurer votre mdp api pour FreshNews
	* et de remplir les champs nécessaires (adresse, login, password) dans les options du module.

# Compiler via les sources :
### Prerequis
* [Add-on SDK - Instalation](https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Installation)

### Test et compilation :
* Test : cfx run
* compilation : cfx xpi
    * genere trucbidule.xpi dans le dossier

### Bug Connu :
* Fucking bug : pour que les variables (auth nbunread json succes) s'instancie correctement, il faut actualiser 2-3 fois ... (corrigé !)