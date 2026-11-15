# Contributing to Discord Rich Presence for Acode

Thank you for your interest in contributing to **Discord Rich Presence for Acode**! Community contributions are welcome to keep this extension fast, reliable, and feature-rich.

---

## Code of Conduct

Please maintain a welcoming, respectful, and collaborative environment when communicating in discussions, issues, and pull requests.

---

## How Can You Contribute?

### 1. Reporting Bugs
- Search existing issues to ensure the bug hasn't already been reported.
- Open a new issue with a clear title and detailed reproduction steps.
- Include your Android version, Acode version, and file type if relevant.

### 2. Suggesting Features
- Open a feature request issue explaining the proposed functionality and why it benefits mobile developers.

### 3. Adding Language Asset Mappings
- We support 50+ language extensions. If a programming language or framework icon is missing, you can add it to the `LANGUAGE_MAP` object in `main.js`.

---

## Development Workflow

1. **Fork & Clone:**
   ```bash
   git clone https://github.com/myzert/acode-discord-rpc.git
   cd acode-discord-rpc
   ```

2. **Make Changes:**
   Edit `main.js`, `plugin.json`, or documentation files.

3. **Build the Plugin Package:**
   ```bash
   chmod +x ./build.sh
   ./build.sh
   ```
   This generates `plugin.zip` (for the Acode registry) and `acode-discord-rpc.zip` (for manual installation).

4. **Test in Acode:**
   Copy `acode-discord-rpc.zip` to your device and install via **Settings > Plugins > Install from storage**.

5. **Submit a Pull Request:**
   Push your changes to your fork and submit a PR to the `main` branch with a clear description of the improvements.

---

## Guidelines
- Write defensive, asynchronous JavaScript compatible with Android WebView.
- Always wrap file system operations and editor event bindings in `try/catch` blocks.
- Keep dependencies zero — maintain native WebSocket communication without external libraries.
