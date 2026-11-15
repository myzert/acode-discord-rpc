/**
 * Discord Rich Presence for Acode (Android)
 * Authentic Visual Studio Code layout, featuring official Acode branding
 * with real dynamic programming language badge icons.
 * Author: myzert (https://github.com/myzert)
 * Repository: https://github.com/myzert/acode-discord-rpc
 */

(() => {
  const PLUGIN_ID = 'myzert.acode.discord.rpc';

  // ID Aplikasi Acode Resmi & Asset Logo
  const ACODE_APP_ID = '1571462947983593595';
  const ACODE_ASSETS = {
    blue_bg: '1571468057010905220', // acode-ada-bg-biru
    transparent: '1571468057639915630', // acode-bg-transparan
  };

  // Official Language Asset IDs (50+ Bahasa Pemrograman untuk Small Image Badge)
  const LANGUAGE_MAP = {
    // JavaScript / TypeScript / Web
    js: { id: '1359299016025964687', name: 'JavaScript' },
    mjs: { id: '1359299016025964687', name: 'JavaScript' },
    cjs: { id: '1359299016025964687', name: 'JavaScript' },
    jsx: { id: '1359299015983894651', name: 'React JSX' },
    ts: { id: '1359299427059236984', name: 'TypeScript' },
    tsx: { id: '1359299426262319284', name: 'React TSX' },
    vue: { id: '1359299519573131545', name: 'Vue' },
    svelte: { id: '1359299371639771367', name: 'Svelte' },
    html: { id: '1359298971646038066', name: 'HTML' },
    htm: { id: '1359298971646038066', name: 'HTML' },
    css: { id: '1359298399085527152', name: 'CSS' },
    scss: { id: '1359299338932584549', name: 'SCSS' },
    less: { id: '1359299073168904372', name: 'Less' },

    // Backend & Languages
    php: { id: '1359299228186312897', name: 'PHP' },
    phtml: { id: '1359299228186312897', name: 'PHP' },
    py: { id: '1359299282380918886', name: 'Python' },
    ipynb: { id: '1359299015988084927', name: 'Jupyter' },
    rb: { id: '1359299282435571752', name: 'Ruby' },
    java: { id: '1359298971738050570', name: 'Java' },
    kt: { id: '1359299073122766999', name: 'Kotlin' },
    kts: { id: '1359299073122766999', name: 'Kotlin' },
    cs: { id: '1359298403259121674', name: 'C#' },
    c: { id: '1359298290058789037', name: 'C' },
    h: { id: '1359298290058789037', name: 'C Header' },
    cpp: { id: '1359298399379390484', name: 'C++' },
    cc: { id: '1359298399379390484', name: 'C++' },
    cxx: { id: '1359298399379390484', name: 'C++' },
    hpp: { id: '1359298399379390484', name: 'C++ Header' },
    rs: { id: '1359299338907549887', name: 'Rust' },
    go: { id: '1359298884043800586', name: 'Go' },
    dart: { id: '1359298399483990157', name: 'Dart' },
    lua: { id: '1359299073148059749', name: 'Lua' },
    zig: { id: '1359299561897721957', name: 'Zig' },

    // Shell & Config
    sh: { id: '1359299339071131708', name: 'Shell' },
    bash: { id: '1359299339071131708', name: 'Bash' },
    zsh: { id: '1359299339071131708', name: 'Zsh' },
    json: { id: '1359299015484768338', name: 'JSON' },
    md: { id: '1359299128655347824', name: 'Markdown' },
    markdown: { id: '1359299128655347824', name: 'Markdown' },
    yaml: { id: '1359299519124078724', name: 'YAML' },
    yml: { id: '1359299519124078724', name: 'YAML' },
    toml: { id: '1359299426157461678', name: 'TOML' },
    xml: { id: '1359299519522672701', name: 'XML' },
    sql: { id: '1359299339075321937', name: 'SQL' },
    dockerfile: { id: '1359298813092823040', name: 'Docker' },
  };

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

      this.gitCache = {};

      this.settings = {
        enabled: true,
        token: '',
        appName: 'Acode',
        applicationId: ACODE_APP_ID,
        activityType: 0, // 0 = PLAYING, 2 = LISTENING
        logoStyle: 'blue_bg',
        repoUrl: 'https://github.com/myzert/acode-discord-rpc',
        repoLabel: 'View Repository',
        workspaceOverride: '',
        privacyMode: false,
        showLineCount: false, // Mirip VS Code resmi (Details hanya: Editing <filename>)
        showCursorPosition: true,
        idleTimeoutMinutes: 5,
        hoursOffset: 0,
      };
    }

    async init($page) {
      this.loadSettings();

      this.registerCommands();
      this.registerHeaderIcon();
      this.bindEditorEvents();

      setInterval(() => this.checkIdleStatus(), 30000);

      if (this.settings.enabled && this.settings.token) {
        this.connect();
      } else if (!this.settings.token) {
        this.showToast('Discord RPC: Tekan Ctrl+Alt+D untuk memasukkan Token Discord.');
      }
    }

    loadSettings() {
      try {
        const saved = localStorage.getItem('myzert_acode_discord_rpc_v5');
        if (saved) {
          this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.error('[Discord RPC] Gagal membaca setting:', e);
      }
    }

    saveSettings() {
      try {
        localStorage.setItem('myzert_acode_discord_rpc_v5', JSON.stringify(this.settings));
      } catch (e) {
        console.error('[Discord RPC] Gagal menyimpan setting:', e);
      }
    }

    registerCommands() {
      if (!window.editorManager || !editorManager.editor || !editorManager.editor.commands) return;

      editorManager.editor.commands.addCommand({
        name: 'discord_rpc_settings',
        bindKey: { win: 'Ctrl-Alt-D', mac: 'Command-Alt-D' },
        exec: () => this.showSettingsDialog(),
      });

      editorManager.editor.commands.addCommand({
        name: 'discord_rpc_toggle',
        bindKey: { win: 'Ctrl-Alt-T', mac: 'Command-Alt-T' },
        exec: () => this.toggleRPC(),
      });

      editorManager.editor.commands.addCommand({
        name: 'discord_rpc_reconnect',
        exec: () => {
          this.showToast('Menghubungkan ulang Discord RPC...');
          this.connect();
        },
      });
    }

    registerHeaderIcon() {
      if (window.acode && typeof acode.addIcon === 'function') {
        acode.addIcon(
          'acode-rpc-icon',
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%2300B4D8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>'
        );
      }
    }

    toggleRPC() {
      this.settings.enabled = !this.settings.enabled;
      this.saveSettings();

      if (this.settings.enabled) {
        this.showToast('🟢 Discord RPC Diaktifkan! Menyambungkan...');
        this.connect();
      } else {
        this.clearPresenceAndDisconnect();
        this.showToast('🔴 Discord RPC Dimatikan.');
      }
    }

    clearPresenceAndDisconnect() {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(
            JSON.stringify({
              op: 3,
              d: {
                since: 0,
                activities: [],
                status: 'online',
                afk: false,
              },
            })
          );
        } catch (e) {}
      }
      this.disconnect();
    }

    bindEditorEvents() {
      if (!window.editorManager) return;

      const triggerActivity = (delay = 3000) => {
        this.lastUserActivity = Date.now();
        if (this.isIdle) this.isIdle = false;
        this.schedulePresenceUpdate(delay);
      };

      try {
        if (typeof editorManager.on === 'function') {
          editorManager.on('switch-file', () => triggerActivity(1500));
          editorManager.on('rename-file', () => triggerActivity(1500));
          editorManager.on('save-file', () => triggerActivity(1000));
          editorManager.on('update', () => triggerActivity(3000));
        }
      } catch (err) {
        console.warn('[Discord RPC] Error binding editorManager:', err);
      }

      try {
        const editor = editorManager.editor;
        if (editor) {
          if (editor.session && typeof editor.session.on === 'function') {
            editor.session.on('change', () => triggerActivity(4000));
          } else if (typeof editor.addEventListener === 'function') {
            editor.addEventListener('change', () => triggerActivity(4000));
          }
        }
      } catch (err) {
        console.warn('[Discord RPC] Error binding editor changes:', err);
      }

      setInterval(() => {
        if (this.isConnected && !this.isIdle && this.settings.enabled) {
          this.schedulePresenceUpdate(0);
        }
      }, 15000);
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
      if (!this.settings.enabled) return;

      if (this.pendingUpdateTimeout) {
        clearTimeout(this.pendingUpdateTimeout);
      }

      const now = Date.now();
      const timeSinceLast = now - this.lastPresenceSent;
      const minInterval = 5000;

      let waitTime = delay;
      if (timeSinceLast < minInterval) {
        waitTime = Math.max(delay, minInterval - timeSinceLast);
      }

      this.pendingUpdateTimeout = setTimeout(() => {
        this.sendPresenceUpdate();
      }, waitTime);
    }

    /**
     * Membaca informasi .git/config dan .git/HEAD dari direktori project
     */
    async detectGitRepository(fileUri) {
      if (!fileUri) return null;

      if (this.gitCache[fileUri]) {
        return this.gitCache[fileUri];
      }

      const fsOperation = window.fsOperation || (window.acode && acode.require('fsOperation'));
      if (!fsOperation) return null;

      try {
        let currentUri = fileUri;
        for (let i = 0; i < 4; i++) {
          const lastSlash = currentUri.lastIndexOf('/');
          if (lastSlash === -1) break;
          currentUri = currentUri.substring(0, lastSlash);

          const gitConfigUri = `${currentUri}/.git/config`;
          const gitHeadUri = `${currentUri}/.git/HEAD`;

          try {
            const configText = await fsOperation(gitConfigUri).readFile('utf-8');
            if (configText) {
              let repoUrl = null;
              const urlMatch = configText.match(/url\s*=\s*(.+)/);
              if (urlMatch) {
                repoUrl = urlMatch[1].trim();
                if (repoUrl.startsWith('git@')) {
                  repoUrl = repoUrl.replace('git@', 'https://').replace(':', '/');
                }
                if (repoUrl.endsWith('.git')) {
                  repoUrl = repoUrl.slice(0, -4);
                }
              }

              let branch = null;
              try {
                const headText = await fsOperation(gitHeadUri).readFile('utf-8');
                if (headText) {
                  const trimmedHead = headText.trim();
                  if (trimmedHead.startsWith('ref: refs/heads/')) {
                    branch = trimmedHead.replace('ref: refs/heads/', '').trim();
                  } else {
                    branch = trimmedHead.slice(0, 7);
                  }
                }
              } catch (e) {}

              const folderSegments = currentUri.split('/').filter(Boolean);
              const folderName = folderSegments[folderSegments.length - 1] || 'Project';

              const result = {
                workspace: folderName,
                repoUrl: repoUrl,
                branch: branch,
              };

              this.gitCache[fileUri] = result;
              return result;
            }
          } catch (e) {}
        }
      } catch (err) {
        console.warn('[Discord RPC] Gagal membaca git info:', err);
      }

      return null;
    }

    async getActiveFileInfo() {
      let fileName = 'No File Open';
      let extension = '';
      let line = 1;
      let col = 1;
      let totalLines = 1;
      let fileUri = null;
      let workspace = this.settings.workspaceOverride || '';
      let detectedRepoUrl = null;
      let gitBranch = null;

      try {
        if (window.editorManager && editorManager.activeFile) {
          const file = editorManager.activeFile;
          fileName = file.name || file.filename || 'Untitled';
          fileUri = file.uri || file.location;

          const parts = fileName.split('.');
          if (parts.length > 1) {
            extension = parts.pop().toLowerCase();
          }

          if (fileUri) {
            const gitInfo = await this.detectGitRepository(fileUri);
            if (gitInfo) {
              if (!workspace) workspace = gitInfo.workspace;
              detectedRepoUrl = gitInfo.repoUrl;
              gitBranch = gitInfo.branch;
            } else if (!workspace) {
              const segments = fileUri.split('/').filter(Boolean);
              if (segments.length > 1) {
                workspace = segments[segments.length - 2];
              }
            }
          }

          const editor = editorManager.editor;
          if (editor) {
            if (typeof editor.getCursorPosition === 'function') {
              const pos = editor.getCursorPosition();
              line = (pos.row || 0) + 1;
              col = (pos.column || 0) + 1;
            } else if (editor.state && editor.state.selection) {
              const pos = editor.state.selection.main.head;
              const lineObj = editor.state.doc.lineAt(pos);
              line = lineObj.number;
              col = pos - lineObj.from + 1;
            }

            if (editor.session && typeof editor.session.getLength === 'function') {
              totalLines = editor.session.getLength();
            } else if (editor.state && editor.state.doc) {
              totalLines = editor.state.doc.lines;
            }
          }
        }
      } catch (err) {
        console.warn('[Discord RPC] Error reading file info:', err);
      }

      if (!workspace) {
        workspace = 'Acode Project';
      }

      const langData = LANGUAGE_MAP[extension] || {
        id: '1359299466493956258',
        name: extension ? extension.toUpperCase() : 'Code',
      };

      return {
        fileName,
        extension,
        langData,
        line,
        col,
        totalLines,
        workspace,
        detectedRepoUrl,
        gitBranch,
      };
    }

    async buildPresencePayload() {
      const fileInfo = await this.getActiveFileInfo();
      const offsetMs = (this.settings.hoursOffset || 0) * 3600 * 1000;
      const startTimestamp = this.sessionStartTime - offsetMs;

      const appTitle = this.settings.appName || 'Acode';

      // ==========================================
      // STRUKTUR 100% PERSIS VS CODE RPC:
      // Baris 1: Editing <filename>
      // Baris 2: Workspace: <workspace> [<branch>] - Ln <line>, Col <col>
      // ==========================================
      let displayFileName = this.settings.privacyMode ? 'Protected File' : fileInfo.fileName;
      let details = `Editing ${displayFileName}`;

      let state = `Workspace: ${fileInfo.workspace}`;
      if (fileInfo.gitBranch && !this.settings.privacyMode) {
        state += ` [${fileInfo.gitBranch}]`;
      }
      if (this.settings.showCursorPosition && !this.settings.privacyMode) {
        state += ` - Ln ${fileInfo.line}, Col ${fileInfo.col}`;
      }

      // ==========================================
      // ASSET GAMBAR (MIRIP VS CODE):
      // Large Image : Logo Editor (Acode)
      // Small Image : Badge Logo Bahasa (JS, PHP, Python, React, dll)
      // ==========================================
      const largeImageId =
        this.settings.logoStyle === 'transparent' ? ACODE_ASSETS.transparent : ACODE_ASSETS.blue_bg;

      let largeText = `${appTitle} - Powerful Code Editor for Android`;
      let smallImage = `mp:app-assets/383226320970055681/${fileInfo.langData.id}.png`;
      let smallText = `Editing ${fileInfo.langData.name}`;

      if (this.isIdle) {
        details = `Idling in ${fileInfo.workspace}`;
        state = 'Idle';
        largeText = `${appTitle} (Idle)`;
        smallImage = null;
        smallText = null;
      }

      const activityType = parseInt(this.settings.activityType || 0, 10);

      const activity = {
        name: appTitle,
        type: activityType,
        application_id: this.settings.applicationId || ACODE_APP_ID,
        details: details,
        state: state,
        timestamps: {
          start: startTimestamp,
        },
        assets: {
          large_image: largeImageId,
          large_text: largeText,
        },
      };

      if (smallImage) {
        activity.assets.small_image = smallImage;
        activity.assets.small_text = smallText;
      }

      // Tombol Interaktif Profil
      const buttons = [];
      const buttonUrls = [];

      const finalRepoUrl = fileInfo.detectedRepoUrl || this.settings.repoUrl;
      if (finalRepoUrl) {
        buttons.push(this.settings.repoLabel || 'View Repository');
        buttonUrls.push(finalRepoUrl);
      }

      buttons.push('Get Acode');
      buttonUrls.push('https://acode.foxdebug.com');

      activity.buttons = buttons;
      activity.metadata = { button_urls: buttonUrls };

      return activity;
    }

    async sendPresenceUpdate() {
      if (!this.settings.enabled || !this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return;
      }

      const activity = await this.buildPresencePayload();
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
        console.error('[Discord RPC] Gagal mengirim paket presence:', err);
      }
    }

    connect() {
      if (this.ws) {
        this.disconnect();
      }

      if (!this.settings.enabled || !this.settings.token) return;

      try {
        this.ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');

        this.ws.onopen = () => {
          console.log('[Discord RPC] WebSocket terhubung ke Discord Gateway.');
        };

        this.ws.onmessage = (event) => {
          this.handleGatewayMessage(event.data);
        };

        this.ws.onerror = (err) => {
          console.error('[Discord RPC] WebSocket Error:', err);
        };

        this.ws.onclose = (event) => {
          console.warn(`[Discord RPC] Koneksi ditutup (${event.code}).`);
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

          case 0: // Dispatch
            if (msg.t === 'READY') {
              this.isConnected = true;
              const user = msg.d.user;
              this.showToast(`✨ Acode Discord RPC Aktif! (${user.username})`);
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
        console.error('[Discord RPC] Error parsing gateway message:', err);
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

    async sendIdentify() {
      const initialActivity = await this.buildPresencePayload();

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
        const res = await multiPrompt('Acode Discord RPC Settings', [
          {
            id: 'token',
            placeholder: 'Discord User Token',
            type: 'password',
            value: this.settings.token,
            text: 'Discord User Token:',
          },
          {
            id: 'activityType',
            placeholder: '0 = Playing, 2 = Listening to',
            type: 'text',
            value: String(this.settings.activityType || 0),
            text: 'Mode Status (0: Playing, 2: Listening to):',
          },
          {
            id: 'repoUrl',
            placeholder: 'Fallback jika tidak ada .git',
            type: 'text',
            value: this.settings.repoUrl,
            text: 'Fallback Repo URL (jika folder tidak ada .git):',
          },
          {
            id: 'workspaceOverride',
            placeholder: 'Kosongkan untuk otomatis deteksi folder',
            type: 'text',
            value: this.settings.workspaceOverride,
            text: 'Nama Workspace (Kosongkan jika auto):',
          },
          {
            id: 'hoursOffset',
            placeholder: '0 (atau 200 untuk flexing timer)',
            type: 'number',
            value: this.settings.hoursOffset || 0,
            text: 'Hours Offset (Jam Mundur):',
          },
        ]);

        if (res) {
          this.settings.token = (res.token || '').trim();
          this.settings.activityType = parseInt(res.activityType || 0, 10);
          this.settings.repoUrl = (res.repoUrl || '').trim();
          this.settings.workspaceOverride = (res.workspaceOverride || '').trim();
          this.settings.hoursOffset = parseFloat(res.hoursOffset) || 0;
          this.saveSettings();

          this.showToast('Pengaturan disimpan! Menyambung kembali...');
          this.connect();
        }
      } else if (prompt) {
        const token = await prompt('Masukkan Discord User Token:', this.settings.token, 'password');
        if (token !== undefined) {
          this.settings.token = token.trim();
          this.saveSettings();
          this.showToast('Token disimpan!');
          this.connect();
        }
      }
    }

    destroy() {
      this.clearPresenceAndDisconnect();
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
