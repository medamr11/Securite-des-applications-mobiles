# Android HTTPS Inspection & SSL Pinning Bypass using Objection

![Screenshot](./Images/10.png)

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android-green">
  <img src="https://img.shields.io/badge/Tool-Frida-black">
  <img src="https://img.shields.io/badge/Tool-Objection-blue">
  <img src="https://img.shields.io/badge/Tool-BurpSuite-orange">
</p>

---

# Overview

This lab demonstrates how to bypass SSL Pinning on Android applications using:

- Frida
- Objection
- Burp Suite
- ADB

The objective is to intercept HTTPS traffic dynamically without modifying the APK.

---

# Features

- Frida installation
- Objection setup
- frida-server deployment
- SSL pinning bypass
- HTTPS interception
- Burp Suite configuration
- Android proxy setup
- Runtime instrumentation

---

# Quick Verification

```powershell
python --version
pip --version
adb version
```

![Screenshot](./Images/1.png)

---

# Install Frida & Objection

## Install tools

```powershell
pip install --upgrade objection frida frida-tools
```

## Verify installation

```powershell
objection --version
frida --version
python -c "import frida; print(frida.__version__)"
```

![Screenshot](./Images/3.png)

![Screenshot](./Images/4.png)

---

# Start frida-server

## Push frida-server

```powershell
adb push frida-server-17.9.1-android-x86 /data/local/tmp/frida-server
```

## Make executable

```powershell
adb shell chmod 755 /data/local/tmp/frida-server
```

## Launch frida-server

```powershell
adb shell "/data/local/tmp/frida-server -l 0.0.0.0"
```

![Screenshot](./Images/5.png)

---

# Verify Device Connection

```powershell
frida-ps -Uai
```

![Screenshot](./Images/6.png)

---

# Configure Burp Suite

## Configure listener

- Port: 8080
- Bind to: All interfaces

![Screenshot](./Images/7.png)

---

# Configure Android Proxy

Set the Android Wi-Fi proxy manually:

- Hostname: Your PC IP
- Port: 8080

![Screenshot](./Images/8.png)

---

# Find Target Application

```powershell
frida-ps -Uai | Select-String -Pattern "firestorm"
```

![Screenshot](./Images/9.png)

---

# Disable SSL Pinning

## Spawn mode (recommended)

```powershell
objection -g com.pwnsec.firestorm explore --startup-command "android sslpinning disable"
```

![Screenshot](./Images/10.png)

---

# Attach mode

```powershell
objection -g com.pwnsec.firestorm explore
```

Inside Objection console:

```powershell
android sslpinning disable
```

![Screenshot](./Images/2.png)

---

# Useful Commands

## Frida

```powershell
frida-ps -Uai
```

```powershell
frida --version
```

---

## Objection

```powershell
objection --help
```

```powershell
objection version
```

```powershell
android sslpinning disable
```

---

## ADB

```powershell
adb devices
```

```powershell
adb shell
```

---

# SSL Pinning Explained

SSL Pinning is used by applications to prevent man-in-the-middle attacks by validating server certificates directly inside the application.

Objection dynamically patches:

- TrustManager
- SSLContext
- verifyChain()
- checkTrustedRecursive()

This allows Burp Suite or mitmproxy certificates to be trusted at runtime.

---

# Project Structure

```text
├── Images/
│   ├── 1.png
│   ├── 2.png
│   ├── 3.png
│   ├── 4.png
│   ├── 5.png
│   ├── 6.png
│   ├── 7.png
│   ├── 8.png
│   ├── 9.png
│   └── 10.png
│
└── README.md
```

---

# Disclaimer

This project is intended for:

- Educational purposes
- Mobile application security testing
- Authorized penetration testing

Do not use these techniques without authorization.

---

# References

- https://frida.re
- https://github.com/sensepost/objection
- https://portswigger.net/burp
- https://developer.android.com/tools/adb
