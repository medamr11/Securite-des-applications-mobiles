# UnCrackable Level 3 – Writeup

## Overview

This writeup explains the process used to solve **OWASP MSTG UnCrackable Level 3**.

The goal of the challenge is to bypass the application protections, reverse the native library, recover the secret string, and validate it inside the app.

---

## Tools Used

- ADB
- JADX
- Apktool
- Android Studio / IntelliJ IDEA
- keytool
- apksigner
- Ghidra
- Python

---

## 1. APK Installation

The APK was installed successfully on the Android emulator using ADB.

```powershell
adb install UnCrackable-Level3.apk
adb devices
```

The emulator was detected as:

```text
emulator-5554    device
```

![APK installation and device detection](<Images/1(9).png>)

---

## 2. First Launch

After launching the application, a protection message appears:

```text
Rooting or tampering detected.
This is unacceptable. The app is now going to exit.
```

This means the application contains anti-root, anti-debugging, and anti-tampering protections.

![Rooting or tampering detected](<Images/2(9).png>)

---

## 3. Static Analysis with JADX

The APK was opened with **JADX** to inspect the Java code.

The main package is:

```text
sg.vantagepoint.uncrackable3
```

Important classes found:

```text
MainActivity
CodeCheck
BuildConfig
```

---

## 4. Integrity Check Analysis

Inside `MainActivity`, the method `verifyLibs()` checks the CRC values of native libraries and `classes.dex`.

The application compares the real CRC values with expected values stored in the resources.

If the CRC value is different, the app considers itself tampered.

![JADX verifyLibs method](<Images/3(9).png>)

---

## 5. Root, Debug, and Tamper Detection

Inside the `onCreate()` method, the app calls multiple protection checks:

```java
RootDetection.checkRoot1()
RootDetection.checkRoot2()
RootDetection.checkRoot3()
IntegrityCheck.isDebuggable(getApplicationContext())
tampered
```

If one of these checks returns true, the application shows the tampering dialog.

![JADX onCreate checks](<Images/4(8).png>)

The condition finally triggers:

```java
showDialog("Rooting or tampering detected.");
```

![Root detection logic](<Images/5(8).png>)

---

## 6. Secret Verification Function

The `verify(View view)` method is responsible for checking the user input.

It reads the text entered by the user and calls:

```java
this.check.check_code(string)
```

If the secret is correct, the app displays:

```text
Success!
This is the correct secret.
```

![JADX verify method](<Images/6(6).png>)

---

## 7. Decompile the APK with Apktool

To patch the protection logic, the APK was decompiled using Apktool.

```powershell
apktool d UnCrackable-Level3.apk -o uncrackable3
```

![Apktool decompilation](<Images/7(6).png>)

The decompiled project contains:

```text
lib/
res/
smali/
AndroidManifest.xml
apktool.yml
```

![Decompiled project structure](<Images/8(5).png>)

---

## 8. Smali Code Analysis

The main smali file is located at:

```text
smali/sg/vantagepoint/uncrackable3/MainActivity.smali
```

The detection dialog is called using:

```smali
const-string v0, "Rooting or tampering detected."
invoke-direct {p0, v0}, Lsg/vantagepoint/uncrackable3/MainActivity;->showDialog(Ljava/lang/String;)V
```

![Smali detection dialog](<Images/9(5).png>)

The root/debug/tamper checks are executed before the application continues normally.

![Smali root checks](<Images/10(2).png>)

---

## 9. Patch the Application

The smali code was modified to bypass the protection logic and allow the app to continue execution without showing the tampering dialog.

The goal was to skip the detection block and continue to the normal initialization code.

---

## 10. Rebuild the Patched APK

After modifying the smali code, the APK was rebuilt:

```powershell
apktool b uncrackable3 -o UnCrackable-Level3-patched.apk
```

![Rebuild patched APK](<Images/11(1).png>)

---

## 11. Generate a Keystore

Since the rebuilt APK is unsigned, a new keystore was generated using `keytool`.

```powershell
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias
```

![Generate keystore](<Images/12(1).png>)

---

## 12. Sign the APK

The patched APK was signed using `apksigner`.

```powershell
apksigner sign --ks my-release-key.jks --out UnCrackable-Level3-final.apk UnCrackable-Level3-aligned.apk
```

![Sign APK](<Images/13(1).png>)

---

## 13. Install the Final APK

The final signed APK was installed successfully on the emulator.

```powershell
adb install UnCrackable-Level3-final.apk
```

![Install final APK](<Images/14(1).png>)

After installation, the app opens normally without showing the tampering alert.

![Patched application running](<Images/16.png>)

---

## 14. Native Library Analysis with Ghidra

The app loads a native library:

```java
System.loadLibrary("foo");
```

The native library `libfoo.so` was opened in **Ghidra**.

The native code contains anti-Frida checks and the logic used to hide or verify the secret.

![Ghidra native analysis](<Images/17.png>)

---

## 15. Decode the Secret with Python

After analyzing the native code, an encoded byte sequence and XOR key were recovered.

A Python script was created to decode the secret:

```python
# === DÉCODAGE INVERSE DE LA CLÉ ENCODÉE (MODE XOR) ===
# Constante encodée sous matrice par le code C natif
encoded = bytes.fromhex("1d0811130f1749150d0003195a1d1315080e5a0017081314")

# Le masque itératif qui a originellement crypté le code, codé à la volée.
xor_key = b"pizzapizzapizzapizzapizza"

# Un bitwise XOR dynamique zip() décrypte séquentiellement la clé pour révéler la string claire.
secret = bytes(a ^ b for a, b in zip(encoded, xor_key))
print("Clé secrète trouvée :", secret.decode())
```

![Python decode script](<Images/18.png>)

Running the script reveals the secret:

```text
making owasp great again
```

![Recovered secret](<Images/19.png>)

---

## 16. Validate the Secret

The recovered secret was entered into the application:

```text
making owasp great again
```

The app displayed:

```text
Success!
This is the correct secret.
```

![Success message](<Images/19.png>)

---

## Final Secret

```text
making owasp great again
```

---

## Conclusion

This challenge demonstrates multiple Android reverse engineering techniques:

- Static analysis with JADX
- APK decompilation with Apktool
- Smali patching
- APK rebuilding and signing
- Native library analysis with Ghidra
- XOR-based secret recovery with Python

The protection mechanisms were successfully bypassed, the secret was recovered from the native library, and the application accepted the correct input.
