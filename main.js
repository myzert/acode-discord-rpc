/**
 * Discord Rich Presence for Acode (Android)
 * Full-featured, native Discord RPC with authentic Acode branding.
 * Author: myzert (https://github.com/myzert)
 * Repository: https://github.com/myzert/acode-discord-rpc
 */

(() => {
  const PLUGIN_ID = 'myzert.acode.discord.rpc';

  // ID Aplikasi Acode Resmi & Asset Logo
  const DEFAULT_APP_ID = '1571462947983593595';
  const ACODE_ASSETS = {
    blue_bg: '1571468057010905220', // acode-ada-bg-biru
    transparent: '1571468057639915630', // acode-bg-transparan
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

      // Konfigurasi Lengkap
      this.settings = {
        enabled: true,
        token: '',
        appName: 'Acode',
        applicationId: DEFAULT_APP_ID,
        activityType: 0, // 0 = PLAYING, 2 = LISTENING, 3 = WATCHING, 5 = COMPETING
        logoStyle: 'blue_bg', // 'blue_bg' atau 'transparent'
        repoUrl: 'https://github.com/myzert/acode-discord-rpc',
        repoLabel: 'View Repository',
        workspaceOverride: '',
        privacyMode: false, // Sembunyikan nama file asli
        showLineCount: true,
        showCursorPosition: true,
        idleTimeoutMinutes: 5,
        hoursOffset: 0,
      };
    }

    async init($page) {
      this.loadSettings();

      // Daftarkan Perintah Command Palette Acode
      this.registerCommands();

      // Tambahkan Icon di Header Acode
      this.registerHeaderIcon();

      // Pasang Event Hook Editor
      this.bindEditorEvents();

      // Timer Pengecekan Idle Status
      setInterval(() => this.checkIdleStatus(), 30000);

      // Mulai koneksi jika diaktifkan dan token tersedia
      if (this.settings.enabled && this.settings.token) {
        this.connect();
      } else if (!this.settings.token) {
        this.showToast('Discord RPC: Tekan Ctrl+Alt+D untuk memasukkan Token Discord.');
      }
    }

    loadSettings() {
      try {
        const saved = localStorage.getItem('myzert_acode_discord_rpc_v3');
        if (saved) {
          this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.error('[Discord RPC] Gagal membaca konfigurasi:', e);
      }
    }

    saveSettings() {
      try {
        localStorage.setItem('myzert_acode_discord_rpc_v3', JSON.stringify(this.settings));
      } catch (e) {
        console.error('[Discord RPC] Gagal menyimpan konfigurasi:', e);
      }
    }

    registerCommands() {
      if (!window.editorManager || !editorManager.editor || !editorManager.editor.commands) return;

      // 1. Pengaturan Utama
      editorManager.editor.commands.addCommand({
        name: 'discord_rpc_settings',
        bindKey: { win: 'Ctrl-Alt-D', mac: 'Command-Alt-D' },
        exec: () => this.showSettingsDialog(),
      });

      // 2. Toggle On / Off
      editorManager.editor.commands.addCommand({
        name: 'discord_rpc_toggle',
        bindKey: { win: 'Ctrl-Alt-T', mac: 'Command-Alt-T' },
        exec: () => this.toggleRPC(),
      });

      // 3. Paksa Hubungkan Ulang (Reconnect)
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
          // Kirim payload kosong untuk menghapus aktivitas di Discord
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

      // Auto update line/column setiap 15 detik
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

    getActiveFileInfo() {
      let fileName = 'No File Open';
      let extension = '';
      let line = 1;
      let col = 1;
      let totalLines = 1;
      let workspace = this.settings.workspaceOverride || '';

      try {
        if (window.editorManager && editorManager.activeFile) {
          const file = editorManager.activeFile;
          fileName = file.name || file.filename || 'Untitled';

          const parts = fileName.split('.');
          if (parts.length > 1) {
            extension = parts.pop().toLowerCase();
          }

          // Deteksi Workspace Otomatis dari folder path
          if (!workspace && (file.uri || file.location)) {
            const fileUri = file.uri || file.location;
            const pathSegments = fileUri.split('/').filter(Boolean);
            if (pathSegments.length > 1) {
              workspace = pathSegments[pathSegments.length - 2];
            }
          }

          const editor = editorManager.editor;
          if (editor) {
            // Ace Editor Cursor
            if (typeof editor.getCursorPosition === 'function') {
              const pos = editor.getCursorPosition();
              line = (pos.row || 0) + 1;
              col = (pos.column || 0) + 1;
            } else if (editor.state && editor.state.selection) {
              // CodeMirror Cursor
              const pos = editor.state.selection.main.head;
              const lineObj = editor.state.doc.lineAt(pos);
              line = lineObj.number;
              col = pos - lineObj.from + 1;
            }

            // Total lines
            if (editor.session && typeof editor.session.getLength === 'function') {
              totalLines = editor.session.getLength();
            } else if (editor.state && editor.state.doc) {
              totalLines = editor.state.doc.lines;
            }
          }
        }
      } catch (err) {
        console.warn('[Discord RPC] Error reading active file info:', err);
      }

      if (!workspace) {
        workspace = 'Acode Project';
      }

      return { fileName, extension, line, col, totalLines, workspace };
    }

    buildPresencePayload() {
      const fileInfo = this.getActiveFileInfo();
      const offsetMs = (this.settings.hoursOffset || 0) * 3600 * 1000;
      const startTimestamp = this.sessionStartTime - offsetMs;

      const appTitle = this.settings.appName || 'Acode';

      // Baris 1 (Details)
      let displayFileName = this.settings.privacyMode ? 'Protected File' : fileInfo.fileName;
      let details = `Editing ${displayFileName}`;
      if (this.settings.showLineCount && fileInfo.totalLines > 1 && !this.settings.privacyMode) {
        details += ` (${fileInfo.totalLines} lines)`;
      }

      // Baris 2 (State)
      let state = `Workspace: ${fileInfo.workspace}`;
      if (this.settings.showCursorPosition && !this.settings.privacyMode) {
        state += ` - Ln ${fileInfo.line}, Col ${fileInfo.col}`;
      }

      // Pilih Asset Logo Acode
      const largeImageId =
        this.settings.logoStyle === 'transparent' ? ACODE_ASSETS.transparent : ACODE_ASSETS.blue_bg;

      let largeText = `${appTitle} - Powerful Code Editor for Android`;

      if (this.isIdle) {
        details = `Idling in ${fileInfo.workspace}`;
        state = 'Idle';
        largeText = `${appTitle} (Idle)`;
      }

      // Activity Type: 0 = Playing, 2 = Listening to, 3 = Watching, 5 = Competing
      const activityType = parseInt(this.settings.activityType || 0, 10);

      const activity = {
        name: appTitle,
        type: activityType,
        application_id: this.settings.applicationId || DEFAULT_APP_ID,
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
      if (!this.settings.enabled || !this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
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

          // Reconnect otomatis jika masih aktif
          if (this.settings.enabled && this.settings.token) {
            setTimeout(() => this.connect(), 8000);
          }
        };
      } catch (e) {
        console.error('[Discord RPC] Gagal menginisialisasi WebSocket:', e);
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
            text: 'Mode Tipe Status (0: Playing, 2: Listening to):',
          },
          {
            id: 'repoUrl',
            placeholder: 'https://github.com/myzert/acode-discord-rpc',
            type: 'text',
            value: this.settings.repoUrl,
            text: 'Link Repository (Tombol Profil):',
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
