# LAB 2 — Rooting Android


---

## 1. Objectif du laboratoire

L’objectif de ce laboratoire est de comprendre l’impact du **rooting** sur la sécurité Android, de vérifier l’accès root sur un émulateur, d’installer une application de test, d’inspecter son stockage local et de remettre l’environnement à zéro à la fin de la séance.

---

## 2. Environnement de test

| Champ | Valeur |
|---|---|
| Émulateur | rooted_avd |
| Appareil | Pixel 6 |
| Version Android | API 36 |
| Image système | Google APIs x86_64 |
| Application testée | `ma.ens.myapplication` |
| Version de l’application | 1.0 |
| Données utilisées | Fictives uniquement |
| Réseau | Environnement isolé |

---

## 3. Vérification du root

Les commandes suivantes ont été utilisées pour vérifier si l’AVD est rooté :

```powershell
adb root
adb remount
adb shell id
adb shell getprop ro.boot.verifiedbootstate
adb shell getprop ro.boot.veritymode
adb shell getprop ro.boot.vbmeta.device_state
adb shell "su -c id"
Résultats observés
adb shell id retourne uid=0(root)
ro.boot.verifiedbootstate = orange
ro.boot.veritymode = enforcing
ro.boot.vbmeta.device_state retourne vide
su -c id n’était pas nécessaire car le shell était déjà root
Interprétation

Ces résultats montrent que :

l’émulateur fonctionne avec les privilèges root
verity a été désactivé après adb remount
l’état de confiance du système est passé à orange, ce qui est attendu après le rooting
Capture

4. Export des logs

Pour garder une trace du test, les logs ont été exportés avec :

adb logcat -d | Select-Object -Last 200 | Out-File logcat_root_check.txt
Capture

5. Vérification de l’émulateur connecté

La commande suivante a permis de confirmer que l’AVD était bien détecté :

adb devices
Résultat
emulator-5554    device
Capture

6. Installation de l’application

L’application APK a été installée sur l’AVD avec :

adb install C:\Users\elaam\OneDrive\Bureau\apklab2\app-debug.apk
adb shell pm list packages -3
Résultat

L’application ma.ens.myapplication a été installée avec succès.

Capture

7. Exécution de l’application

L’application contient un formulaire simple avec :

un champ Nom
un champ Prénom
un bouton Envoyer
Scénario 1 — Ouverture de l’application

L’application démarre correctement et affiche l’interface du formulaire.

Scénario 2 — Saisie des données fictives

Les valeurs suivantes ont été saisies :

Nom : EL AAMRANI
Prénom : Mohamed

Scénario 3 — Vérification du résultat

Après soumission, l’application affiche une notification contenant les données saisies.

8. Inspection du stockage local de l’application

Les commandes suivantes ont été utilisées pour inspecter les données locales :

adb shell ls /data/data/ma.ens.myapplication/
adb shell ls /data/data/ma.ens.myapplication/shared_prefs/
adb shell cat /data/data/ma.ens.myapplication/files/profileInstalled
Observations
Le dossier de l’application contient :
cache
code_cache
files
Aucun dossier shared_prefs/ n’a été trouvé
Le fichier profileInstalled existe dans files/
Son contenu semble être binaire / sérialisé, et non du texte clair
Interprétation

Cela montre que l’application ne stocke pas les données du formulaire dans des SharedPreferences lisibles en clair.

Capture

9. Rappel sur la sécurité Android

La sécurité Android repose sur plusieurs mécanismes :

Le sandboxing : chaque application est isolée des autres
Le modèle de permissions : l’accès aux ressources sensibles demande une autorisation
L’intégrité du système : les partitions système sont protégées contre les modifications non autorisées

Le rooting contourne ces protections en donnant un accès privilégié au système.

10. Verified Boot
Rôle de Verified Boot

Verified Boot garantit que le système démarré est celui attendu, sans modification malveillante.

Vérification dans le laboratoire
ro.boot.verifiedbootstate = orange
Signification
Couleur	Signification
Green	Système vérifié et intact
Orange	Système modifié, intégrité non garantie
Red	Intégrité compromise

Dans notre cas, orange indique que le système a été modifié, ce qui est cohérent avec un environnement rooté.

11. AVB (Android Verified Boot)

AVB est une version moderne de Verified Boot.
Il ajoute une vérification cryptographique des partitions au démarrage et permet aussi de limiter certains risques comme le rollback vers une ancienne version vulnérable du système.

12. Risques liés au rooting

Un environnement rooté présente plusieurs risques :

réduction de l’intégrité du système
augmentation de la surface d’attaque
exposition potentielle des données locales
résultats de test moins proches d’un appareil utilisateur normal
persistance de modifications si l’environnement n’est pas nettoyé

C’est pour cela que le rooting doit rester limité à un cadre de test contrôlé.

13. Mesures défensives appliquées

Dans ce laboratoire, plusieurs précautions ont été respectées :

utilisation d’un AVD dédié
emploi de données fictives uniquement
aucun compte personnel utilisé
conservation des logs et captures
remise à zéro de l’environnement à la fin
14. Remise à zéro de l’AVD

À la fin du laboratoire, l’AVD a été réinitialisé avec l’option Wipe Data dans Android Studio Device Manager.

Cette étape permet de :

supprimer les données de test
repartir sur un environnement propre
garantir la reproductibilité du laboratoire
Capture

15. Commandes principales utilisées
adb root
adb remount
adb shell id
adb shell getprop ro.boot.verifiedbootstate
adb shell getprop ro.boot.veritymode
adb devices
adb install app-debug.apk
adb shell pm list packages -3
adb shell ls /data/data/ma.ens.myapplication/
adb shell cat /data/data/ma.ens.myapplication/files/profileInstalled
adb logcat -d | Select-Object -Last 200 | Out-File logcat_root_check.txt
16. Conclusion

Ce laboratoire a permis de montrer concrètement comment le rooting modifie le modèle de sécurité Android.
Les tests ont confirmé l’accès root, mis en évidence l’état orange de Verified Boot, permis l’installation et l’analyse d’une application simple, puis l’inspection de son stockage local.

Enfin, la remise à zéro de l’AVD a permis de terminer la séance dans un état propre et contrôlé.
