# Discord Rich Presence for Acode (Android) 📱✨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform: Acode (Android)](https://img.shields.io/badge/Platform-Acode%20(Android)-teal.svg)](https://acode.app)
[![Release](https://img.shields.io/badge/Release-v1.2.0-blue.svg)](https://github.com/myzert/acode-discord-rpc/releases)
[![Author](https://img.shields.io/badge/Author-myzert-purple.svg)](https://github.com/myzert)

An authentic, feature-packed **Discord Rich Presence (RPC)** plugin for the [Acode](https://acode.app) code editor on Android. Broadcast your live mobile coding sessions directly to your Discord profile with genuine Visual Studio Code layout fidelity and official Acode branding!

---

## 🏗️ Architecture & How It Works

Traditional desktop Discord RPC operates through a local IPC socket (`discord-ipc-0` or `127.0.0.1:6463`). Because the official mobile Discord app on Android **does not expose local IPC sockets or WebSocket ports**, mobile code editors cannot use desktop RPC bridges directly.

### The Solution:
This plugin connects directly to the **Discord Gateway WebSocket** (`wss://gateway.discord.gg`) via native WebView WebSockets. It uses:
* **Opcode 2 (Identify):** Authenticates securely with your token.
* **Opcode 3 (Presence Update):** Dispatches real-time activity payloads including file names, language badges, line positions, workspace names, and repository URLs.
* **Opcode 1 (Heartbeat):** Maintains an active, low-power session without requiring external background daemons or Node.js runtimes.

---

## 🌟 Key Features

* **🎨 Official Acode Branding with VS Code Layout:**
  * Displays as `Acode` with the official Acode editor logo (`acode-ada-bg-biru`).
  * Replicates the exact layout of the PC Visual Studio Code Rich Presence extension.
* **🏷️ Dynamic Language Badge (Small Image Icon):**
  * Automatically detects the active file extension and displays the authentic language icon badge (JavaScript, React JSX, TypeScript, PHP, Python, HTML, CSS, C++, Rust, Go, Kotlin, Dart, etc.).
  * Dedicated icons for plain text (`.txt`), Markdown (`.md`), logs (`.log`), and environment configs (`.env`).
* **🧠 Automatic Git Repository & Branch Detection:**
  * Reads `.git/config` to dynamically set the **View Repository** profile button to your active project URL.
  * Reads `.git/HEAD` to display the active Git branch: `Workspace: project-name [main] - Ln 42, Col 18`.
  * Seamlessly falls back to standard folder names when working outside a Git repository.
* **📂 Accurate Workspace Tracking:**
  * Integrates with Acode's `window.addedFolder` API to track the exact directory opened in your sidebar.
* **💤 Automatic Idle / AFK Mode:**
  * Switches automatically to an **Idle Zzz** sleeping icon and `Idling in [workspace]` status when inactive for 5 minutes.
* **🔴 Instant On/Off Toggle Switch:**
  * Use the **`Ctrl + Alt + T`** shortcut to instantly turn Discord RPC on or off and clear your profile presence without uninstalling.
* **🎧 Flexible Activity Modes:**
  * Supports both **Playing Acode** (Type 0) and **Listening to Acode** (Type 2).
* **⏳ Hours Offset (Flexing Timer):**
  * Optional timer offset feature to simulate marathon coding sessions.
* **🛡️ Privacy Mode:**
  * Option to hide sensitive file names and show `Editing Protected File` when working on private projects.

---

## ⌨️ Keyboard Shortcuts & Commands

Access these commands via Acode's Command Palette or keyboard shortcuts:
* **`Ctrl + Alt + D`** : Open Settings Dialog (Token, Mode, Fallback Repo, Offset).
* **`Ctrl + Alt + T`** : Toggle RPC On / Off instantly.
* **`discord_rpc_reconnect`** : Force reconnect to Discord Gateway.

---

## 📥 Installation Guide

### Method 1: In-App Store (acode.app)
1. Open **Acode** ➔ **Settings** ➔ **Plugins**.
2. Search for **Discord Rich Presence**.
3. Tap **Install**.

### Method 2: Manual ZIP Installation
1. Download **`acode-discord-rpc.zip`** from the latest [GitHub Release](https://github.com/myzert/acode-discord-rpc/releases).
2. In Acode, navigate to **Settings** ➔ **Plugins**.
3. Tap the three dots menu `⋮` in the top right corner ➔ **Install from storage**.
4. Select the downloaded `acode-discord-rpc.zip` file.
5. Press **`Ctrl + Alt + D`** to input your Discord User Token.
6. Done! Your live presence will appear on Discord immediately.

---

## 🔒 Security & Privacy

* Your Discord token is stored strictly inside Acode's sandboxed local storage (`localStorage`).
* No data is sent to intermediate servers or third-party analytical endpoints.
* Review our [SECURITY.md](SECURITY.md) for vulnerability reporting and safety guidelines.

---

## 🤝 Contributing

Contributions, bug reports, and asset additions are warmly welcome! Please review our [CONTRIBUTING.md](CONTRIBUTING.md) before submitting pull requests.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).  
Copyright (c) 2026 [myzert](https://github.com/myzert).
