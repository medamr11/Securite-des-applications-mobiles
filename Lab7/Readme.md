# MobSF avec Docker Desktop et Android Emulator 

## 📌 Présentation

Ce document présente la mise en place de **MobSF (Mobile Security Framework)** sur **Windows** avec **Docker Desktop** et un **émulateur Android**, puis son utilisation pour réaliser une **analyse statique** et une **analyse dynamique** de l'application **DIVA (Damn Insecure and Vulnerable App)**.

L'objectif est de montrer un workflow simple pour :

* préparer l'environnement
* lancer MobSF dans un conteneur Docker
* connecter un émulateur Android
* analyser une APK en statique
* lancer l'analyse dynamique
* utiliser les tests TLS/SSL
* exploiter les outils Frida intégrés
* consulter les logs et résultats

\---

## 🛠️ Prérequis

Avant de commencer, il faut disposer de :

* **Docker Desktop** installé et démarré
* **Android Studio** avec au moins un **AVD**
* **Git**
* une application APK à analyser
* idéalement **DIVA** pour les tests de sécurité mobile

\---

## 1\. Vérification de Docker Desktop

La première étape consiste à vérifier que **Docker Desktop** est bien lancé et que le moteur Docker fonctionne correctement.

!\[Docker Desktop](./Images/1.png)

**Figure 1 :** Docker Desktop en cours d'exécution sur Windows.

\---

## 2\. Vérification de l'émulateur Android

MobSF Dynamic Analyzer a besoin d'un appareil Android. Ici, un **Android Virtual Device (AVD)** est utilisé depuis Android Studio.

!\[Android Device Manager](./Images/2.png)

**Figure 2 :** Device Manager affichant les émulateurs Android disponibles.

\---

## 3\. Clonage du projet MobSF

Le dépôt officiel de MobSF peut être cloné localement avec Git :

```bash
git clone https://github.com/MobSF/Mobile-Security-Framework-MobSF.git
cd Mobile-Security-Framework-MobSF
```

Une fois le dépôt cloné, on peut vérifier les fichiers principaux du projet.

!\[Clonage du projet MobSF](./Images/3.png)

**Figure 3 :** Clonage du dépôt MobSF et affichage de son contenu.

\---

## 4\. Lancement du conteneur MobSF

MobSF peut être lancé via Docker avec une commande similaire à la suivante :

```powershell
docker run -it `
  -p 8000:8000 -p 1337:1337 `
  -v mobsf\_data:/home/mobsf/.MobSF `
  -e MOBSF\_ANALYZER\_IDENTIFIER=emulator-5554 `
  opensecurity/mobile-security-framework-mobsf:latest
```

Cette commande :

* expose l'interface web de MobSF sur le port **8000**
* prépare l'environnement dynamique via le port **1337**
* utilise un volume Docker pour conserver les données
* indique à MobSF quel émulateur utiliser

!\[Téléchargement de l'image Docker MobSF](./Images/4.png)

**Figure 4 :** Téléchargement de l'image Docker MobSF lors du premier lancement.

\---

## 5\. Démarrage de MobSF

Après le lancement du conteneur, MobSF initialise son environnement et démarre son serveur web.

Les logs montrent notamment :

* le chargement de la configuration
* la version de MobSF
* l'environnement système
* l'écoute sur le port 8000

!\[Logs de démarrage MobSF](./Images/4-2.png)

**Figure 5 :** Logs de démarrage de MobSF dans le conteneur Docker.

\---

## 6\. Analyse statique de l'APK

Une fois MobSF accessible dans le navigateur, il suffit d'importer une APK pour lancer l'analyse statique.

Dans cet exemple, l'application analysée est **DivaApplication.apk**.

L'analyse statique permet d'obtenir rapidement :

* le score de sécurité
* les informations de l'application
* les activités exportées
* les services exportés
* les receivers et providers exportés
* l'accès au manifeste Android
* le code décompilé Java et Smali

!\[Analyse statique DIVA](./Images/5.png)

**Figure 6 :** Résultat de l'analyse statique de l'application DIVA dans MobSF.

\---

## 7\. Lancement de l'analyse dynamique

Après l'analyse statique, on peut cliquer sur **Start Dynamic Analysis** pour préparer l'instrumentation de l'application sur l'émulateur Android.

MobSF initialise alors :

* le proxy HTTP(S)
* les agents MobSF
* l'instrumentation Frida
* l'environnement d'observation de l'application

On retrouve également plusieurs scripts par défaut très utiles :

* **API Monitoring**
* **SSL Pinning Bypass**
* **Root Detection Bypass**
* **Debugger Check Bypass**
* **Clipboard Monitor**

!\[Préparation de l'analyse dynamique](./Images/6(4).png)

**Figure 7 :** Interface d'analyse dynamique prête à instrumenter l'application.

\---

## 8\. Consultation des logs Logcat

MobSF permet de consulter les logs système de l'application via **Logcat**.

Ces logs sont utiles pour :

* observer le comportement de l'application
* identifier des erreurs runtime
* repérer des actions déclenchées lors du lancement
* suivre les composants Android utilisés

!\[Logs Logcat](./Images/7(4).png)

**Figure 8 :** Affichage des logs Logcat liés à l'application DIVA.

\---

## 9\. Tests TLS/SSL

MobSF intègre un **TLS/SSL Security Tester** qui permet d'évaluer le comportement réseau de l'application.

Ces tests permettent notamment d'identifier :

* les problèmes de configuration TLS
* les faiblesses liées au pinning certificat
* les possibilités de bypass
* l'usage éventuel de trafic en clair

Dans ce cas, les tests affichés sont :

* **TLS Misconfiguration Test**
* **TLS Pinning/Certificate Transparency Test**
* **TLS Pinning/Certificate Transparency Bypass Test**
* **Cleartext Traffic Test**

!\[Exécution des tests TLS SSL](./Images/8(3).png)

**Figure 9 :** Exécution des tests TLS/SSL depuis MobSF.

!\[Résultats des tests TLS SSL](./Images/14.png)

**Figure 10 :** Résultats finaux du module TLS/SSL Security Tester.

\---

## 10\. Interaction avec l'application sur l'émulateur

Pendant l'analyse dynamique, MobSF affiche l'écran de l'émulateur et permet d'interagir avec l'application analysée.

Cela permet de :

* naviguer dans les différentes activités
* déclencher des comportements vulnérables
* tester les écrans exportés
* observer les effets en temps réel

Exemple d'écran affichant des identifiants API :

!\[Écran API Credentials](./Images/9(3).png)

**Figure 11 :** Interaction avec une activité de l'application DIVA dans l'émulateur.

Exemple d'écran lié à un problème de validation d'entrée :

!\[Écran Input Validation Issues](./Images/10.png)

**Figure 12 :** Navigation manuelle dans une activité vulnérable de DIVA.

\---

## 11\. Utilisation de scripts Frida auxiliaires

MobSF propose plusieurs scripts Frida auxiliaires pour faciliter l'analyse dynamique avancée.

Par exemple, un script de **bypass de détection d'émulateur** peut être chargé pour contourner les mécanismes anti-analyse.

Ces scripts permettent de :

* bypasser certaines protections
* tracer des classes et méthodes
* capturer des chaînes sensibles
* surveiller des appels API

!\[Chargement d'un script Frida de bypass émulateur](./Images/11.png)

**Figure 13 :** Chargement d'un script Frida auxiliaire pour contourner la détection d'émulateur.

\---

## 12\. Injection et instrumentation Frida

Après chargement du script, MobSF permet d'injecter le code avec :

* **Spawn \& Inject**
* **Inject**
* **Attach**

Il est aussi possible de sélectionner une activité précise à lancer, ce qui est pratique pour tester des composants spécifiques.

Dans l'exemple ci-dessous, une activité liée aux **API credentials** est ciblée.

!\[Injection et sélection d'activité](./Images/12.png)

**Figure 14 :** Interface d'instrumentation Frida avec sélection d'une activité ciblée.

\---

## 13\. Visualisation du script injecté

MobSF permet également d'afficher le script Frida effectivement injecté dans le processus cible.

Cette fonctionnalité est utile pour :

* vérifier le contenu chargé
* comprendre la logique d'instrumentation
* déboguer les hooks appliqués

!\[Script Frida injecté](./Images/13.png)

**Figure 15 :** Fenêtre affichant le script Frida injecté par MobSF.

\---

## 14\. Fonctions complémentaires de l'analyse dynamique

L'interface dynamique de MobSF fournit plusieurs fonctionnalités supplémentaires très intéressantes :

* **HTTP(S) Traffic** pour observer le trafic réseau
* **Logcat Logs** pour suivre les logs Android
* **Dumpsys Logs** pour collecter des informations système
* **Application Data** pour examiner les données internes
* **Shell Access** pour interagir avec l'environnement Android

!\[Vue d'ensemble des outils dynamiques](./Images/14.png)

**Figure 16 :** Vue générale des outils mis à disposition pendant l'analyse dynamique.

\---

## 🚀 Commandes utiles

### Cloner MobSF

```bash
git clone https://github.com/MobSF/Mobile-Security-Framework-MobSF.git
cd Mobile-Security-Framework-MobSF
```

### Lancer MobSF avec Docker

```powershell
docker run -it `
  -p 8000:8000 -p 1337:1337 `
  -v mobsf\_data:/home/mobsf/.MobSF `
  -e MOBSF\_ANALYZER\_IDENTIFIER=emulator-5554 `
  opensecurity/mobile-security-framework-mobsf:latest
```

### Accéder à l'interface web

```text
http://127.0.0.1:8000
```

\---

