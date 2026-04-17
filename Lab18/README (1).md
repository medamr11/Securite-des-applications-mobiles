# 🔥 FireStorm Mobile Security Lab

## 📌 Overview

This lab demonstrates the analysis of an Android application named **FireStorm** using both **static analysis** and **dynamic analysis**.


---

## 🛠️ Tools Used

- **Android Studio Emulator**
- **ADB**
- **JADX-GUI**
- **Frida**
- **Python**
- **Pyrebase**

---

## 🚀 Step 1 — Install the APK on the Emulator

The APK was installed on the Android emulator using `adb`, then the package name was confirmed using Frida.

```bash
adb install FireStorm.apk
python -m frida_tools.ps -Uai
```

This confirmed that the application was installed under the package:

```text
com.pwnsec.firestorm
```

![Installation and package identification](./Images/installation.png)

**Figure 1:** Successful installation of `FireStorm.apk` and identification of the package name using Frida.

---

## 📱 Step 2 — Launch the Application

After installation, the application was opened inside the emulator to observe its interface and ensure that it launched correctly.

![FireStorm running on emulator](./Images/emulator.png)

**Figure 2:** FireStorm application running inside the Android emulator.

---

## 🔍 Step 3 — Static Analysis with JADX

The APK was opened in **JADX-GUI** for static analysis.

### Important findings

- **Main package:** `com.pwnsec.firestorm`
- **Main class:** `MainActivity`
- **Native library loaded:** `firestorm`

Inside `MainActivity`, a suspicious method named `Password()` was identified.  
This method is interesting because it is **not called in the normal application flow**, yet it builds a string from multiple resources and sends it to a native function.

```java
public String Password() {
    StringBuilder sb = new StringBuilder();
    String string = getString(R.string.Friday_Night);
    String string2 = getString(R.string.Author);
    String string3 = getString(R.string.JustRandomString);
    String string4 = getString(R.string.URL);
    String string5 = getString(R.string.IDKMaybethepasswordpassowrd);
    String string6 = getString(R.string.Token);

    sb.append(string.substring(5, 9));
    sb.append(string4.substring(1, 6));
    sb.append(string2.substring(2, 6));
    sb.append(string5.substring(5, 8));
    sb.append(string3);
    sb.append(string6.substring(18, 26));

    return generateRandomString(String.valueOf(sb));
}
```

![MainActivity in JADX](./Images/mainactivity.png)

**Figure 3:** Decompiled `MainActivity` showing the hidden `Password()` method and the native function `generateRandomString()`.

---

## 🧩 Step 4 — Native Library Inspection

The application loads a native library:

```java
System.loadLibrary("firestorm");
```

This means that part of the password generation logic is implemented in native code inside `libfirestorm.so`.

Although the library was visible in JADX, fully reversing it was not necessary for this lab because Frida allowed us to let the app compute the final password itself.

![libfirestorm.so in JADX](./Images/libfirestorm.png)

**Figure 4:** Native library `libfirestorm.so` identified inside the APK.

---

## ☁️ Step 5 — Firebase Configuration Discovery

By inspecting `res/values/strings.xml`, Firebase-related values were found inside the application resources.

Important entries included:

```xml
<string name="firebase_api_key">AIzaSyAXsK0qsx4RuLSA9C8IPSWd0eQ67HVHuJY</string>
<string name="firebase_email">TK757567@pwnsec.xyz</string>
<string name="firebase_database_url">https://firestorm-9d3db-default-rtdb.firebaseio.com</string>
```

These values strongly suggested that the app relies on **Firebase Authentication** and the **Firebase Realtime Database**.

![Firebase values in strings.xml](./Images/strings_xml.png)

**Figure 5:** Firebase configuration extracted from `strings.xml`.

---

## 🧪 Step 6 — Start Frida Server on the Emulator

To dynamically instrument the application, the correct **Frida server** binary was pushed to the emulator and executed from `/data/local/tmp/`.

Typical commands used:

```bash
adb push frida-server-17.9.1-android-x86_64 /data/local/tmp/frida-server
adb shell chmod 755 /data/local/tmp/frida-server
adb shell "/data/local/tmp/frida-server"
```

This allowed Frida running on the host machine to communicate with the emulator.

![Frida server setup](./Images/frida_server.png)

**Figure 6:** Uploading and running `frida-server` on the Android emulator.

---

## 🪝 Step 7 — Dynamic Analysis with Frida

A Frida script was created to search for a live instance of `MainActivity` and manually invoke the hidden `Password()` method.

### Frida script

```javascript
Java.perform(function () {

    function getPassword() {
        console.log("[*] Début de la recherche d'instances de MainActivity...");

        Java.choose("com.pwnsec.firestorm.MainActivity", {
            onMatch: function (instance) {
                console.log("[+] Instance de MainActivity trouvée : " + instance);

                try {
                    var pass = instance.Password();
                    console.log("[+] Mot de passe Firebase généré : " + pass);
                } catch (e) {
                    console.log("[-] Erreur lors de l'appel de Password() : " + e);
                }
            },

            onComplete: function () {
                console.log("[*] Recherche des instances terminée.");
            }
        });
    }

    console.log("[*] Script chargé. Attente de 3 secondes avant exécution...");
    setTimeout(getPassword, 3000);
});
```

The script was executed with:

```bash
python -m frida_tools.repl -U -f com.pwnsec.firestorm -l .\frida_firestorm.js
```

Frida successfully found an instance of `MainActivity` and printed the generated Firebase password.

![Frida script result](./Images/frida_firestorm-js.png)

**Figure 7:** Frida output showing successful execution of `Password()` and recovery of the Firebase password.

---

## 🔐 Step 8 — Authenticate to Firebase

Using the extracted Firebase configuration and the password recovered dynamically through Frida, a Python script (`get_flag.py`) was used to authenticate and query the backend.

The authentication succeeded, and the flag was retrieved successfully.

![Flag retrieval](./Images/flag.png)

**Figure 8:** Successful Firebase authentication and flag recovery.

---

## 🏁 Flag

```text
PWNSEC{C0ngr4ts_Th4t_w45_4N_345y_P4$$w0rd_t0_G3t!!!_0R_!5_!t???}
```

---

## ✅ Conclusion

This lab showed how combining **static analysis** and **dynamic instrumentation** can reveal secrets hidden in Android applications.

### Key takeaways

- JADX helped identify hidden Java logic
- `Password()` was present but unused in the normal application flow
- `libfirestorm.so` handled part of the password generation
- Frida allowed direct runtime invocation of the hidden method
- Firebase credentials were exposed in `strings.xml`
- The final password was used to authenticate and retrieve the flag

This challenge is a good example of how Android applications may hide sensitive logic across both **Java** and **native code**, and how runtime instrumentation can be used to bypass difficult native reverse engineering.


---
