/**
 * Discord Rich Presence for Acode (Android)
 * High-performance, feature-packed Discord RPC for Acode Editor.
 * Author: myzert (https://github.com/myzert)
 * Repository: https://github.com/myzert/acode-discord-rpc
 */

(() => {
  const PLUGIN_ID = 'myzert.acode.discord.rpc';
  const VSCODE_APP_ID = '383226320970055681';

  // 50+ Bahasa Pemrograman yang didukung otomatis
  const LANGUAGE_ASSETS = {
    // JavaScript / TypeScript / Web
    js: { id: '1359299016025964687', name: 'JavaScript' },
    mjs: { id: '1359299016025964687', name: 'JavaScript' },
    cjs: { id: '1359299016025964687', name: 'JavaScript' },
    jsx: { id: '1359299015983894651', name: 'React JSX' },
    ts: { id: '1359299427059236984', name: 'TypeScript' },
    tsx: { id: '1359299426262319284', name: 'React TSX' },
    html: { id: '1359298971646038066', name: 'HTML' },
    htm: { id: '1359298971646038066', name: 'HTML' },
    css: { id: '1359298399085527152', name: 'CSS' },
    scss: { id: '1359299338932584549', name: 'SCSS' },
    less: { id: '1359299073168904372', name: 'Less' },
    vue: { id: '1359299519573131545', name: 'Vue' },
    svelte: { id: '1359299371639771367', name: 'Svelte' },

    // Python & Machine Learning
    py: { id: '1359299282380918886', name: 'Python' },
    ipynb: { id: '1359299015988084927', name: 'Jupyter' },

    // Systems & Mobile
    c: { id: '1359298290058789037', name: 'C' },
    h: { id: '1359298290058789037', name: 'C Header' },
    cpp: { id: '1359298399379390484', name: 'C++' },
    hpp: { id: '1359298399379390484', name: 'C++ Header' },
    cs: { id: '1359298403259121674', name: 'C#' },
    java: { id: '1359298971738050570', name: 'Java' },
    kt: { id: '1359299073122766999', name: 'Kotlin' },
    rs: { id: '1359299338907549887', name: 'Rust' },
    go: { id: '1359298884043800586', name: 'Go' },
    php: { id: '1359299228186312897', name: 'PHP' },
    rb: { id: '1359299282435571752', name: 'Ruby' },
    dart: { id: '1359298399483990157', name: 'Dart' },
    lua: { id: '1359299073148059749', name: 'Lua' },
    zig: { id: '1359299561897721957', name: 'Zig' },

    // Scripts, Configs, Databases
    sh: { id: '1359299339071131708', name: 'Shell Script' },
    bash: { id: '1359299339071131708', name: 'Bash' },
    zsh: { id: '1359299339071131708', name: 'Zsh' },
    json: { id: '1359299015484768338', name: 'JSON' },
    md: { id: '1359299128655347824', name: 'Markdown' },
    yaml: { id: '1359299519124078724', name: 'YAML' },
    yml: { id: '1359299519124078724', name: 'YAML' },
    toml: { id: '1359299426157461678', name: 'TOML' },
    xml: { id: '1359299519522672701', name: 'XML' },
    sql: { id: '1359299339075321937', name: 'SQL' },
    dockerfile: { id: '1359298813092823040', name: 'Docker' },
  };

  const ASSET_VSCODE_MAIN = '1359299466493956258';
  const ASSET_VSCODE_IDLE = '1359298971905822881';

  class DiscordRPCPlugin {
    constructor() {
      this.ws = null;
      this.heartbeatTimer = null;
      this.lastSequence = null;
      this.sessionStartTime = Date.now();
      this.lastUserActivity = Date.now();
      this.isIdle = false;
      this.isConnected = false;
      this.lastPresenceSent = 0;
      this.pendingUpdateTimeout = null;

      // Konfigurasi Default Lengkap
      this.settings = {
        enabled: true,
        token: '',
        appName: 'Acode', // 'Acode' atau 'Visual Studio Code'
        applicationId: VSCODE_APP_ID,
        repoUrl: 'https://github.com/myzert/cihuynime',
        repoLabel: 'View Repository',
        workspaceOverride: '',
        showLineCount: true,
        showCursorPosition: true,
        idleTimeoutMinutes: 5,
        hoursOffset: 0,
      };
    }

    async init($page) {
      this.loadSettings();

      // Daftarkan shortcut & command palette
      if (window.editorManager && editorManager.editor) {
        editorManager.editor.commands.addCommand({
          name: 'discord_rpc_settings',
          bindKey: { win: 'Ctrl-Alt-D', mac: 'Command-Alt-D' },
          exec: () => this.showSettingsDialog(),
        });
      }

      this.registerHeaderIcon();
      this.bindEditorEvents();

      // Cek status idle setiap 30 detik
      setInterval(() => this.checkIdleStatus(), 30000);

      // Otomatis konek jika token tersedia
      if (this.settings.enabled && this.settings.token) {
        this.connect();
      } else if (!this.settings.token) {
        this.showToast('Discord RPC: Tekan Ctrl+Alt+D untuk mengatur Token Discord kamu.');
      }
    }

    loadSettings() {
      try {
        const saved = localStorage.getItem('myzert_acode_discord_rpc_v2');
        if (saved) {
          this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.error('[Discord RPC] Gagal membaca setting:', e);
      }
    }

    saveSettings() {
      try {
        localStorage.setItem('myzert_acode_discord_rpc_v2', JSON.stringify(this.settings));
      } catch (e) {
        console.error('[Discord RPC] Gagal menyimpan setting:', e);
      }
    }

    registerHeaderIcon() {
      if (window.acode && typeof acode.addIcon === 'function') {
        // Icon Acode Teal / Cyan
        acode.addIcon(
          'acode-discord-icon',
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%2300B4D8"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>'
        );
      }
    }

    bindEditorEvents() {
      if (!window.editorManager) return;

      const triggerActivity = (delay = 3000) => {
        this.lastUserActivity = Date.now();
        if (this.isIdle) this.isIdle = false;
        this.schedulePresenceUpdate(delay);
      };

      editorManager.on('switch-file', () => triggerActivity(1500));
      editorManager.on('rename-file', () => triggerActivity(1500));
      editorManager.on('save-file', () => triggerActivity(1000));

      if (editorManager.editor) {
        editorManager.editor.on('change', () => triggerActivity(4000));
        editorManager.editor.selection.on('changeCursor', () => triggerActivity(8000));
      }
    }

    checkIdleStatus() {
      if (!this.settings.enabled || !this.isConnected) return;
      const idleLimitMs = (this.settings.idleTimeoutMinutes || 5) * 60 * 1000;
      if (Date.now() - this.lastUserActivity > idleLimitMs && !this.isIdle) {
        this.isIdle = true;
        this.schedulePresenceUpdate(0);
      }
    }

    schedulePresenceUpdate(delay = 3000) {
      if (this.pendingUpdateTimeout) {
        clearTimeout(this.pendingUpdateTimeout);
      }

      const now = Date.now();
      const timeSinceLast = now - this.lastPresenceSent;
      const minInterval = 5000; // Rate limit protection: minimal 5 detik antar update

      let waitTime = delay;
      if (timeSinceLast < minInterval) {
        waitTime = Math.max(delay, minInterval - timeSinceLast);
      }

      this.pendingUpdateTimeout = setTimeout(() => {
        this.sendPresenceUpdate();
      }, waitTime);
    }

    getActiveFileInfo() {
      let fileName = 'No File Open';
      let extension = '';
      let line = 1;
      let col = 1;
      let totalLines = 1;
      let workspace = this.settings.workspaceOverride || 'cihuynime';

      if (window.editorManager && editorManager.activeFile) {
        const file = editorManager.activeFile;
        fileName = file.name || 'Untitled';

        const parts = fileName.split('.');
        if (parts.length > 1) {
          extension = parts.pop().toLowerCase();
        }

        if (file.uri) {
          const pathSegments = file.uri.split('/');
          if (pathSegments.length > 2) {
            workspace = this.settings.workspaceOverride || pathSegments[pathSegments.length - 2];
          }
        }

        if (editorManager.editor) {
          const pos = editorManager.editor.getCursorPosition();
          line = (pos.row || 0) + 1;
          col = (pos.column || 0) + 1;
          if (editorManager.editor.session) {
            totalLines = editorManager.editor.session.getLength() || 1;
          }
        }
      }

      const lang = LANGUAGE_ASSETS[extension] || {
        id: ASSET_VSCODE_MAIN,
        name: extension ? extension.toUpperCase() : 'Code',
      };

      return { fileName, extension, line, col, totalLines, workspace, lang };
    }

    buildPresencePayload() {
      const fileInfo = this.getActiveFileInfo();
      const offsetMs = (this.settings.hoursOffset || 0) * 3600 * 1000;
      const startTimestamp = this.sessionStartTime - offsetMs;

      // Status Title: Acode
      const appTitle = this.settings.appName || 'Acode';

      // Baris 1 (Details)
      let details = `Editing ${fileInfo.fileName}`;
      if (this.settings.showLineCount && fileInfo.totalLines > 1) {
        details += ` (${fileInfo.totalLines} lines)`;
      }

      // Baris 2 (State)
      let state = `Workspace: ${fileInfo.workspace}`;
      if (this.settings.showCursorPosition) {
        state += ` - Ln ${fileInfo.line}, Col ${fileInfo.col}`;
      }

      let largeImage = ASSET_VSCODE_MAIN;
      let largeText = `${appTitle} - Code Editor on Android`;
      let smallImage = fileInfo.lang.id;
      let smallText = `Editing ${fileInfo.lang.name}`;

      if (this.isIdle) {
        details = `Idling in ${fileInfo.workspace}`;
        state = 'Idle';
        largeImage = ASSET_VSCODE_IDLE;
        largeText = `${appTitle} (Idle)`;
        smallImage = null;
        smallText = null;
      }

      const activity = {
        name: appTitle,
        type: 0,
        application_id: this.settings.applicationId || VSCODE_APP_ID,
        details: details,
        state: state,
        timestamps: {
          start: startTimestamp,
        },
        assets: {
          large_image: largeImage,
          large_text: largeText,
        },
      };

      if (smallImage) {
        activity.assets.small_image = smallImage;
        activity.assets.small_text = smallText;
      }

      // Tombol Interaktif
      const buttons = [];
      const buttonUrls = [];

      if (this.settings.repoUrl) {
        buttons.push(this.settings.repoLabel || 'View Repository');
        buttonUrls.push(this.settings.repoUrl);
      }

      buttons.push('Get Acode');
      buttonUrls.push('https://acode.foxdebug.com');

      activity.buttons = buttons;
      activity.metadata = { button_urls: buttonUrls };

      return activity;
    }

    sendPresenceUpdate() {
      if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return;
      }

      const activity = this.buildPresencePayload();
      const payload = {
        op: 3,
        d: {
          since: 0,
          activities: [activity],
          status: 'online',
          afk: this.isIdle,
        },
      };

      try {
        this.ws.send(JSON.stringify(payload));
        this.lastPresenceSent = Date.now();
      } catch (err) {
        console.error('[Discord RPC] Gagal mengirim packet presence:', err);
      }
    }

    connect() {
      if (this.ws) {
        this.disconnect();
      }

      if (!this.settings.token) return;

      try {
        this.ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');

        this.ws.onopen = () => {
          console.log('[Discord RPC] Terhubung ke Discord Gateway.');
        };

        this.ws.onmessage = (event) => {
          this.handleGatewayMessage(event.data);
        };

        this.ws.onerror = (err) => {
          console.error('[Discord RPC] WebSocket Error:', err);
        };

        this.ws.onclose = (event) => {
          console.warn(`[Discord RPC] Koneksi tertutup (${event.code}). Menghubungkan ulang...`);
          this.cleanupHeartbeat();
          this.isConnected = false;

          if (this.settings.enabled && this.settings.token) {
            setTimeout(() => this.connect(), 8000);
          }
        };
      } catch (e) {
        console.error('[Discord RPC] Inisialisasi WebSocket gagal:', e);
      }
    }

    handleGatewayMessage(raw) {
      try {
        const msg = JSON.parse(raw);
        if (msg.s) this.lastSequence = msg.s;

        switch (msg.op) {
          case 10: // Hello
            this.heartbeatInterval = msg.d.heartbeat_interval;
            this.startHeartbeat();
            this.sendIdentify();
            break;

          case 11: // Heartbeat ACK
            break;

          case 0: // Event Dispatch
            if (msg.t === 'READY') {
              this.isConnected = true;
              const user = msg.d.user;
              this.showToast(`✨ Discord RPC Aktif! (${user.username})`);
              console.log(`[Discord RPC] Siap sebagai ${user.username}`);
              this.sendPresenceUpdate();
            }
            break;

          case 7: // Reconnect
          case 9: // Invalid Session
            this.disconnect();
            setTimeout(() => this.connect(), 4000);
            break;
        }
      } catch (err) {
        console.error('[Discord RPC] Error parsing gateway:', err);
      }
    }

    startHeartbeat() {
      this.cleanupHeartbeat();
      this.heartbeatTimer = setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ op: 1, d: this.lastSequence }));
        }
      }, this.heartbeatInterval);
    }

    cleanupHeartbeat() {
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
    }

    sendIdentify() {
      const initialActivity = this.buildPresencePayload();

      const payload = {
        op: 2,
        d: {
          token: this.settings.token,
          capabilities: 16381,
          properties: {
            os: 'Android',
            browser: 'Acode Editor',
            device: 'Acode Mobile',
            system_locale: 'id-ID',
          },
          presence: {
            status: 'online',
            since: 0,
            activities: [initialActivity],
            afk: false,
          },
        },
      };

      this.ws.send(JSON.stringify(payload));
    }

    disconnect() {
      this.cleanupHeartbeat();
      if (this.pendingUpdateTimeout) {
        clearTimeout(this.pendingUpdateTimeout);
        this.pendingUpdateTimeout = null;
      }
      if (this.ws) {
        this.ws.onclose = null;
        this.ws.onerror = null;
        this.ws.close();
        this.ws = null;
      }
      this.isConnected = false;
    }

    showToast(message) {
      if (window.acode && typeof acode.require === 'function') {
        const toast = acode.require('toast');
        if (toast) {
          toast(message);
          return;
        }
      }
      console.log('[Discord RPC Toast]:', message);
    }

    async showSettingsDialog() {
      const multiPrompt = window.acode && acode.require('multiPrompt');
      const prompt = window.acode && acode.require('prompt');

      if (multiPrompt) {
        const res = await multiPrompt('Discord RPC Configuration (Acode)', [
          {
            id: 'token',
            placeholder: 'Discord User Token',
            type: 'password',
            value: this.settings.token,
            text: 'Discord User Token:',
          },
          {
            id: 'appName',
            placeholder: 'Acode atau Visual Studio Code',
            type: 'text',
            value: this.settings.appName || 'Acode',
            text: 'Nama Status Aplikasi:',
          },
          {
            id: 'repoUrl',
            placeholder: 'https://github.com/myzert/cihuynime',
            type: 'text',
            value: this.settings.repoUrl,
            text: 'GitHub Repository URL (Tombol 1):',
          },
          {
            id: 'workspaceOverride',
            placeholder: 'Kosongkan untuk otomatis deteksi folder',
            type: 'text',
            value: this.settings.workspaceOverride,
            text: 'Nama Workspace (Opsional):',
          },
          {
            id: 'hoursOffset',
            placeholder: '0 (atau 200 buat flexing timer)',
            type: 'number',
            value: this.settings.hoursOffset || 0,
            text: 'Hours Offset (Jam Mundur):',
          },
        ]);

        if (res) {
          this.settings.token = (res.token || '').trim();
          this.settings.appName = (res.appName || 'Acode').trim();
          this.settings.repoUrl = (res.repoUrl || '').trim();
          this.settings.workspaceOverride = (res.workspaceOverride || '').trim();
          this.settings.hoursOffset = parseFloat(res.hoursOffset) || 0;
          this.saveSettings();

          this.showToast('Pengaturan disimpan! Menyambung ulang...');
          this.connect();
        }
      } else if (prompt) {
        const token = await prompt('Masukkan Discord User Token:', this.settings.token, 'password');
        if (token !== undefined) {
          this.settings.token = token.trim();
          this.saveSettings();
          this.showToast('Token disimpan! Menyambung...');
          this.connect();
        }
      } else {
        const token = window.prompt('Masukkan Discord User Token:', this.settings.token);
        if (token !== null) {
          this.settings.token = token.trim();
          this.saveSettings();
          this.connect();
        }
      }
    }

    destroy() {
      this.disconnect();
    }
  }

  // Register Plugin ke Acode
  if (window.acode) {
    const rpcPlugin = new DiscordRPCPlugin();
    acode.setPluginInit(PLUGIN_ID, async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
      rpcPlugin.baseUrl = baseUrl;
      await rpcPlugin.init($page, cacheFile, cacheFileUrl);
    });

    acode.setPluginUnmount(PLUGIN_ID, () => {
      rpcPlugin.destroy();
    });
  }
})();
