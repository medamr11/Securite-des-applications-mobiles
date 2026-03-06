
# 🖥️ LAB 1 — Mise en place du laboratoire Mobexler

## 📋 Description

Ce laboratoire consiste à préparer l’environnement de test pour le cours de **sécurité des applications mobiles**.

Nous allons installer la machine virtuelle **Mobexler**, configurer le réseau et connecter un appareil Android afin de pouvoir effectuer des tests de sécurité.

---

## 🎯 Objectifs pédagogiques

À la fin de ce laboratoire, vous serez capable de :

- Installer une machine virtuelle avec **VirtualBox**
- Configurer le réseau (**NAT + Host-Only Adapter**)
- Vérifier la **connectivité Internet**
- Créer un **snapshot propre (baseline)**
- Connecter un **appareil Android via ADB**

---

# 📸 Étapes du laboratoire

## Étape 1 — Connexion à Mobexler

Après avoir importé la machine virtuelle et l’avoir démarrée, connectez-vous avec les identifiants suivants :

Username : mobexler  
Password : mobexler

![Connexion Mobexler](Images/login_mobexler.png)

---

## Étape 2 — Vérification de la connectivité réseau

Une fois connecté, vérifiez que la machine virtuelle possède bien un accès Internet.

Commande utilisée :

```bash
ping -c 2 8.8.8.8
```

Cette commande permet de vérifier que la VM peut communiquer avec Internet.

![Test réseau](Images/test_reseau.png)

---

## Étape 3 — Création d’un snapshot CLEAN

Afin de pouvoir revenir à un état stable du système en cas de problème, il est recommandé de créer un **snapshot**.

Nom du snapshot :

CLEAN_BASELINE_TP1

Ce snapshot permettra de restaurer rapidement l’environnement initial du laboratoire.

![Snapshot](Images/snapshot_clean.png)

---

## Étape 4 — Connexion de l’appareil Android

Pour vérifier que l’appareil Android est correctement connecté, utilisez **ADB (Android Debug Bridge)**.

Commandes utilisées :

```bash
adb version
adb devices
```

Si tout fonctionne correctement, votre appareil Android apparaîtra dans la liste des périphériques connectés.

![ADB Devices](Images/adb_devices.png)

---

# ✅ Résultat

À la fin de ce laboratoire, l’environnement doit être correctement configuré :

- Machine virtuelle **Mobexler fonctionnelle**
- **Connexion Internet** opérationnelle
- **Snapshot CLEAN** créé
- **Appareil Android connecté via ADB**

Cet environnement servira de base pour les prochains travaux pratiques de **sécurité des applications mobiles**.
