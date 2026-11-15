# Contributing to Discord Rich Presence for Acode

Thank you for your interest in contributing to Discord Rich Presence for Acode. Community contributions help maintain reliability, performance, and compatibility across Android devices and Acode versions.

---

## Code of Conduct

Maintain a professional, collaborative, and constructive atmosphere in all discussions, issues, and pull requests.

---

## Contribution Areas

### 1. Issue Reporting
- Search existing issues before creating a new ticket to prevent duplicates.
- Provide comprehensive reproduction steps, including device model, Android version, Acode version, and file types affected.

### 2. Feature Requests
- Submit feature suggestions with clear rationale and use cases highlighting advantages for mobile development workflows.

### 3. Language Icon Assets
- Over 50 programming language file extensions are currently supported. To propose or add new language extensions, update the `LANGUAGE_MAP` registry located in `main.js`.

---

## Development Workflow

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/myzert/acode-discord-rpc.git
   cd acode-discord-rpc
   ```

2. Implement changes in `main.js`, `plugin.json`, or documentation files.

3. Build the distribution package locally:
   ```bash
   chmod +x ./build.sh
   ./build.sh
   ```
   Note: Built archive packages (`plugin.zip`, `acode-discord-rpc.zip`) are automatically ignored by git and should not be committed to the repository.

4. Validate the plugin in Acode:
   Install the generated archive package via **Settings > Plugins > Install from storage**.

5. Submit a Pull Request:
   Push changes to your fork and submit a pull request against the `main` branch with an explanation of your modifications.

---

## Engineering Guidelines
- Write defensive, asynchronous JavaScript compatible with the Android WebView runtime.
- Wrap file system and editor event interactions in appropriate error-handling blocks.
- Maintain zero external runtime dependencies by relying on native WebSocket implementations.
