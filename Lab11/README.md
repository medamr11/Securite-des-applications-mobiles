# Bypass Root Detection — UnCrackable Level 1

## Objectif

Ce mini rapport explique comment bypasser la détection root de l’application **UnCrackable Level 1** avec **Frida**.

L’application détecte que l’environnement est rooté et affiche le message :

> Root detected! This is unacceptable. The app is now going to exit.

---

## 1. Détection du root par l’application

Au lancement, l’application affiche une alerte indiquant que le root a été détecté.

![Root detected](./Images/01_root_detected.png)

Cette alerte bloque l’utilisation normale de l’application.

---

## 2. Lancement de frida-server

Pour utiliser Frida, il faut d’abord lancer `frida-server` sur l’émulateur Android.

Commande utilisée :

```powershell
adb shell /data/local/tmp/frida-server
```

![Frida server](./Images/02_frida_server.png)

---

## 3. Analyse du code avec JADX

L’APK est ouvert avec **JADX** pour analyser le code Java décompilé.

Dans `MainActivity`, on remarque les vérifications suivantes :

```java
if (c.a() || c.b() || c.c()) {
    a("Root detected!");
}
```

Cela signifie que l’application utilise les méthodes `a()`, `b()` et `c()` de la classe :

```java
sg.vantagepoint.a.c
```

Si une de ces méthodes retourne `true`, l’application considère que le root est détecté.

![JADX MainActivity](./Images/03_jadx_mainactivity.png)

---

## 4. Script Frida utilisé

Le script Frida permet de modifier le comportement de l’application pendant son exécution.

Fichier : `bypass.js`

```javascript
Java.perform(function () {
    console.log("[+] Root detection bypass loaded");

    var System = Java.use("java.lang.System");
    System.exit.implementation = function (code) {
        console.log("[+] Blocked System.exit(" + code + ")");
    };

    var RootCheck = Java.use("sg.vantagepoint.a.c");

    RootCheck.a.implementation = function () {
        console.log("[+] Bypass root check a()");
        return false;
    };

    RootCheck.b.implementation = function () {
        console.log("[+] Bypass root check b()");
        return false;
    };

    RootCheck.c.implementation = function () {
        console.log("[+] Bypass root check c()");
        return false;
    };
});
```

![Bypass script](./Images/04_bypass_script.png)

### Explication rapide

- `Java.perform()` attend que l’environnement Java Android soit prêt.
- `Java.use("java.lang.System")` permet d’intercepter `System.exit()`.
- `System.exit.implementation` empêche l’application de se fermer.
- `Java.use("sg.vantagepoint.a.c")` cible la classe responsable de la détection root.
- Les méthodes `a()`, `b()` et `c()` sont forcées à retourner `false`.
- `false` signifie : **root non détecté**.

---

## 5. Exécution avec Frida

Commande utilisée :

```powershell
python -m frida_tools.repl -U -f owasp.mstg.uncrackable1 -l .\bypass.js
```

Résultat obtenu :

```text
[+] Root detection bypass loaded
[+] Bypass root check a()
[+] Bypass root check b()
[+] Bypass root check c()
```

![Frida execution](./Images/05_frida_execution.png)

Le script est bien chargé et les trois méthodes de détection root sont interceptées.

---

## 6. Résultat final

Après le bypass, l’application ne se ferme plus et l’alerte root ne bloque plus l’interface.

![Bypass success](./Images/06_bypass_success.png)

L’application est maintenant accessible normalement.

---

## Conclusion

Le bypass fonctionne car Frida intercepte les méthodes responsables de la détection root au runtime.

Au lieu de laisser l’application exécuter ses vérifications normalement, le script force les fonctions :

```java
c.a()
c.b()
c.c()
```

à retourner :

```java
false
```

Ainsi, l’application pense que l’appareil n’est pas rooté.

---

## Commandes importantes

```powershell
adb shell /data/local/tmp/frida-server
```

```powershell
python -m frida_tools.repl -U -f owasp.mstg.uncrackable1 -l .\bypass.js
```

Si l’application reste en pause dans Frida :

```javascript
%resume
```
