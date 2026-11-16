# Discord Rich Presence for Acode (Unofficial)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform: Acode (Android)](https://img.shields.io/badge/Platform-Acode%20(Android)-teal.svg)](https://acode.app)
[![Release](https://img.shields.io/badge/Release-v1.2.1-blue.svg)](https://github.com/myzert/acode-discord-rpc/releases)
[![Author](https://img.shields.io/badge/Author-myzert-purple.svg)](https://github.com/myzert)

> [!WARNING]
> **Important Security and Account Risk Notice:**
> This plugin connects directly to the Discord Gateway WebSocket using a personal Discord user account token.
>
> 1. **Discord Terms of Service Notice:** Automating user accounts or connecting personal user tokens outside official Discord client applications is considered self-botting and operates against the Discord Terms of Service.
> 2. **Account Standing Risk:** While this plugin strictly transmits Rich Presence activity updates (Opcode 3) and never reads private messages, sends chat spam, or accesses unauthorized data, using a user token carries an inherent risk of account limitation, warning, or termination by Discord.
> 3. **Usage Recommendation:** Use this plugin at your own discretion and responsibility. If you have concerns regarding your primary Discord account standing, we strongly advise testing or using this extension with an alternate or secondary account.
> 4. **Token Storage Safety:** Your token is stored exclusively within Acode's local private sandboxed storage (`localStorage`). It is never transmitted to third-party servers, intermediate proxies, or telemetry endpoints. Never disclose your token to anyone.

An authentic, unofficial Discord Rich Presence (RPC) plugin for the [Acode](https://acode.app) code editor on Android. Displays real-time mobile coding activity on your Discord profile with genuine Visual Studio Code layout fidelity.

> [!NOTE]
> This is an unofficial, community-developed plugin and is not affiliated with, maintained by, or endorsed by Acode or Discord.

---

## Architecture Overview

Traditional desktop Discord RPC solutions communicate via local Inter-Process Communication (IPC) sockets (`discord-ipc-0` or `127.0.0.1:6463`). Because the official mobile Discord client for Android does not expose local IPC sockets or WebSocket listening ports, standard desktop RPC bridges cannot function on mobile devices.

### Native Gateway Implementation

This plugin establishes a direct, lightweight connection to the Discord Gateway WebSocket (`wss://gateway.discord.gg`) through the Android WebView environment:

* **Opcode 2 (Identify):** Authenticates the session securely using your token.
* **Opcode 3 (Presence Update):** Dispatches real-time activity payloads including file names, language icons, workspace names, and repository action buttons.
* **Opcode 1 (Heartbeat):** Preserves an uninterrupted, energy-efficient connection without external background daemons or secondary runtimes.

---

## Features

### Visual Studio Code Layout Fidelity
* **Application Identity:** Appears as `Acode` with the editor logo.
* **Details Line:** Formatted as `Editing <filename>`.
* **State Line:** Formatted cleanly as `Workspace: <workspace>`.
* **Action Buttons:** Includes a dynamic `View Repository` button linking directly to your project's repository and a `Get Acode` button linking to `https://acode.app`.

### Dynamic Language Badges
* File extensions are dynamically detected and matched with high-resolution language badges.
* Supports JavaScript, React (JSX/TSX), TypeScript, PHP, Python, HTML, CSS, SCSS, C, C++, Rust, Go, Java, Kotlin, Dart, Vue, Svelte, Markdown, Plain Text, Log files, Config files, and others.

### Automatic Git Repository Detection
* Parses `.git/config` asynchronously to discover the remote repository URL and dynamically assign it to the `View Repository` profile button.
* Automatically falls back to directory names when working outside a Git repository.

### Workspace Tracking
* Hooks into Acode's workspace APIs (`window.addedFolder`) to report the exact folder opened in the project sidebar.

### Idle and AFK Detection
* Switches automatically to an idle status (`Idling in <workspace>`) and sleeping icon asset when no file or editor activity occurs for a configurable duration (default: 5 minutes).

### Instant Toggle Switch
* Quickly enable or disable the presence using the `Ctrl + Alt + T` shortcut without unlinking your token or uninstalling the extension.

### Activity Modes
* Choose between `Playing Acode` (Type 0) or `Listening to Acode` (Type 2) depending on personal preference.

### Privacy Mode
* Hides sensitive file names when enabled, displaying `Editing Protected File` for proprietary or confidential codebases.

---

## Keyboard Shortcuts and Commands

| Shortcut / Command | Action |
| --- | --- |
| `Ctrl + Alt + D` | Open the Settings Dialog (Token, Mode, Fallback Repo, Offset) |
| `Ctrl + Alt + T` | Toggle Discord Rich Presence On / Off immediately |
| `discord_rpc_reconnect` | Command Palette action to reconnect to the Discord Gateway |

---

## Installation

### Method 1: Acode Plugin Registry (Recommended)
1. Open **Acode** and go to **Settings** > **Plugins**.
2. Select the **Explore** tab and search for **Discord Rich Presence**.
3. Tap **Install**.
4. Configure your token via **Ctrl + Alt + D**.

### Method 2: Manual Package Installation
1. Download `acode-discord-rpc.zip` from the latest [GitHub Release](https://github.com/myzert/acode-discord-rpc/releases).
2. Open **Acode** > **Settings** > **Plugins**.
3. Tap the overflow menu (three vertical dots) and choose **Install from storage**.
4. Select `acode-discord-rpc.zip`.
5. Press **Ctrl + Alt + D** to input your token and activate presence tracking.

---

## Security and Safety Notice

### Local Credential Storage
Your Discord token is stored exclusively in Acode's private, sandboxed device storage (`localStorage`). No credentials, telemetry, or user metrics are transmitted to any remote servers, intermediary proxies, or external databases.

### Version Control Best Practices
Never commit personal authentication tokens, `.env` files, or binary archives (`.zip`) to public version control. Build packages are strictly ignored by `.gitignore` to prevent repository pollution and accidental credential exposure.

### Discord Platform Compliance
Using user tokens for self-managed presence connections operates outside the official Discord OAuth2 Bot Application API. Although Rich Presence clients of this type are widely utilized across custom mobile environments, users should review Discord Terms of Service guidelines and exercise appropriate discretion.

---

## Contributing

Contributions, bug reports, and asset additions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and review [SECURITY.md](SECURITY.md) before submitting pull requests.

---

## License

This project is open-source software licensed under the [MIT License](LICENSE).  
Copyright (c) 2026 [myzert](https://github.com/myzert).
