# Mobile Application Security Analysis Lab Report

![Screenshot](./Images/15.png)

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android-green">
  <img src="https://img.shields.io/badge/Analysis-SAST-blue">
  <img src="https://img.shields.io/badge/Tool-BeVigil-orange">
  <img src="https://img.shields.io/badge/Tool-Yaazhini-red">
</p>

---

# Overview

This laboratory report presents a mobile application security assessment performed on the vulnerable Android application:

- DIVA (Damn Insecure Vulnerable App)

The analysis focuses on:

- Static analysis (SAST)
- OSINT exposure
- APK inspection
- Permissions review
- Manifest analysis
- Vulnerability triage

---

# Tools Used

| Tool | Purpose |
|------|----------|
| BeVigil | OSINT & APK exposure analysis |
| Yaazhini | Static APK analysis |
| PowerShell | Automation & evidence collection |

---

# Step 0 — Environment Initialization

```powershell
mkdir 00-scope
mkdir 01-bevigil
mkdir 02-yaazhini
mkdir 03-triage
mkdir 04-report
```

![Screenshot](./Images/1.png)

![Screenshot](./Images/8.png)

![Screenshot](./Images/9.png)

---

# Step 1 — Define Scope

```powershell
Get-FileHash -Path "00-scope\diva.apk" -Algorithm SHA256
```

![Screenshot](./Images/10.png)

![Screenshot](./Images/11.png)

![Screenshot](./Images/12.png)

---

# Step 2 — Analysis Information

Preparation of analysis metadata and environment information.

![Screenshot](./Images/13.png)

---

# Step 3 — BeVigil Analysis

Upload and scan the APK using CloudSEK BeVigil.

![Screenshot](./Images/14.png)

![Screenshot](./Images/15.png)

![Screenshot](./Images/2.png)

![Screenshot](./Images/3.png)

---

# Step 4 — BeVigil Findings

Detected findings include:

- SQL Injection indicators
- Sensitive logs
- Hardcoded credentials
- Risky storage permissions

![Screenshot](./Images/4.png)

![Screenshot](./Images/5.png)

---

# Step 5 — Yaazhini Static Analysis

Static analysis of the APK using Yaazhini.

![Screenshot](./Images/6.png)

![Screenshot](./Images/7.png)

![Screenshot](./Images/15.png)

---

# Step 6 — Yaazhini Findings

Main vulnerabilities identified:

- HTTP communication
- Debuggable mode enabled
- Android allowBackup=true
- Exported components
- Insecure external storage
- JavaScript enabled inside WebView

![Screenshot](./Images/4.png)

---

# Step 7 — Triage & Correlation

Normalization and classification of vulnerabilities.

![Screenshot](./Images/8.png)

---

# Main Findings

1. HTTP communication without TLS
2. Debuggable flag enabled
3. Android backups allowed
4. Excessive storage permissions
5. Potential SQL Injection
6. Exported Android components
7. Sensitive logs exposure

---

# Recommendations

- Enforce HTTPS everywhere
- Disable Debuggable mode
- Set allowBackup=false
- Reduce dangerous permissions
- Secure sensitive data storage

---

# Disclaimer

This project is intended for educational and authorized security testing purposes only.

---

# References

- https://owasp.org/www-project-mobile-top-10/
- https://mas.owasp.org/
- https://github.com/payatu/diva-android
