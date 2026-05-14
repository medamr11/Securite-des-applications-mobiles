# LAB 13 : Android Root Detection Bypass with Objection


# Overview

This lab demonstrates Android root detection bypass using Frida and Objection.

---

# Step 1 — Verify Environment

```powershell
python --version
pip --version
adb devices
frida --version
```

![Environment](./Images/1.png)

---

# Step 2 — Install Objection

```powershell
pip install --upgrade objection
```

![Install](./Images/2.png)

---

# Step 3 — Verify Objection

```powershell
objection --help
objection version
```

![Objection](./Images/3.png)

---

# Step 4 — Start frida-server

```powershell
adb push frida-server-17.9.1-android-x86 /data/local/tmp/frida-server
adb shell chmod 755 /data/local/tmp/frida-server
adb shell "/data/local/tmp/frida-server -l 0.0.0.0"
```

![Frida Server](./Images/4.png)

---

# Step 5 — Verify Applications

```powershell
frida-ps -Uai
```

![Processes](./Images/5.png)

---

# Step 6 — Attach Objection

```powershell
objection -n com.pwnsec.firestorm explore
```

![Attach](./Images/6.png)

---

# Step 7 — Search Root Detection Methods

```bash
android hooking search classes root
android hooking search methods isRoot
```

![Search](./Images/7.png)

---

# Step 8 — Disable Root Detection & SSL Pinning

```bash
android root disable
android sslpinning disable
```

![Bypass](./Images/8.png)

---

# Features

- Root detection bypass
- SSL pinning bypass
- Runtime instrumentation
- Java method hooking
- Frida integration

---


---

# Disclaimer

For educational and authorized security testing only.
