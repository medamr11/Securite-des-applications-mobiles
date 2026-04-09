# 🔓 Reverse Engineering Lab: UnCrackable Level 2

## 📌 Overview

This lab demonstrates how to reverse engineer an Android application that hides its core logic inside a **native library** (`.so` file). The app appears simple — a text field and a verify button — but the secret validation is performed in **native code** loaded via JNI.

The goal is to recover the secret string by:
- Decompiling the APK with **JADX**
- Extracting the native library `libfoo.so`
- Analyzing the library with **Ghidra**
- Identifying the `strncmp` comparison
- Decoding the hidden secret

---

## 🛠️ Tools Used

- Android Emulator (or physical device)
- `adb` (Android Debug Bridge)
- **JADX** – APK decompiler
- **Ghidra** – Reverse engineering framework
- `unzip` / Python (for decoding)

---

## 📱 Step 1: Install and Observe the App

```bash
adb install UnCrackable-Level2.apk
Check connected devices and install the APK:

https://1.png

Figure 1: ADB showing connected emulator and successful APK installation.

Once installed, the app shows a simple interface with an input field and a VERIFY button.

⚠️ The app detects root and exits if the device is rooted. Use an emulator without root or bypass root detection.

App interface with root detection warning:

https://2.png

Figure 2: The app displays a "Root detected!" message and exits on rooted devices.

🧪 Step 2: Test Invalid Inputs
Entering random strings like test, 1234, hello returns an error message:

"That's not it. Try again."

This confirms the app compares user input against a hidden secret.

🔍 Step 3: Decompile with JADX
Run JADX GUI:

bash
jadx-gui
Open UnCrackable-Level2.apk and navigate to:

sg.vantagepoint.uncrackable2.MainActivity

JADX main view showing the APK structure:

https://3.png

Figure 3: JADX displaying the AndroidManifest.xml and package structure.

The verify method shows:

java
public void verify(View view) {
    String input = ((EditText) findViewById(R.id.edit_text)).getText().toString();
    if (this.m.a(input)) {
        // Success
    } else {
        // Failure
    }
}
this.m is an instance of CodeCheck.

MainActivity decompiled code:

https://4.png

Figure 4: JADX decompilation of MainActivity showing the verify method and CodeCheck usage.

📦 Step 4: Inspect the CodeCheck Class
Inside CodeCheck.java:

java
public class CodeCheck {
    static {
        System.loadLibrary("foo");   // loads libfoo.so
    }
    private native boolean bar(byte[] bArr);
    public boolean a(String str) {
        return bar(str.getBytes());
    }
}
native keyword → implementation is in native code

bar is the JNI function inside libfoo.so

CodeCheck class with native method declaration:

https://5.png

Figure 5: CodeCheck class showing System.loadLibrary("foo") and the native bar() method.

🗂️ Step 5: Extract the Native Library
Extract the APK:

bash
unzip UnCrackable-Level2.apk -d uncrackable_l2
ls -R uncrackable_l2/lib
You'll find libfoo.so for different architectures (x86, armeabi-v7a, etc.). Pick one (e.g., x86/libfoo.so).

🧠 Step 6: Analyze libfoo.so with Ghidra
Launch Ghidra:

bash
ghidraRun
Create a new project and import libfoo.so. Run automatic analysis.

🔎 Find the JNI Function
Search for symbols containing Java_ or bar. You'll find:

text
Java_sg_vantagepoint_uncrackable2_CodeCheck_bar
Open the decompiled view.

Ghidra decompiler showing the native function and the secret string:

https://6.png

Figure 6: Ghidra decompilation of Java_sg_vantagepoint_uncrackable2_CodeCheck_bar showing the secret "Thanks for all the fish" used in strncmp.

🧬 Step 7: Identify strncmp Comparison
Inside the function, look for a call to strncmp. Ghidra's decompiled output shows:

c
buildtim_strncpy(local_30, "Thanks for all the fish", 0x18);
...
if (strncmp(s1, local_34, 0x17) == 0) {
    // success
}
🔓 The secret appears in plaintext in this version:
"Thanks for all the fish"
