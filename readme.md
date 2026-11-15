# Discord Rich Presence for Acode (Android) 📱✨

Plugin Rich Presence (RPC) untuk aplikasi editor kode Android **Acode**, menampilkan aktivitas coding kamu secara langsung di Discord dengan status dan logo resmi **Acode**!

---

## 📖 Cara Kerja Arsitektur (Technical Overview)

Banyak yang bertanya mengapa aplikasi di Android tidak bisa menggunakan cara RPC konvensional:
1. **Di PC (Desktop):** Aplikasi Discord Desktop membuka IPC socket lokal (`discord-ipc-0` atau port `127.0.0.1:6463`). Game atau teks editor di PC cukup melempar data ke port lokal tersebut tanpa perlu login token.
2. **Di HP (Android):** Aplikasi resmi Discord Android **tidak pernah membuka port atau socket lokal**. Selain itu, Discord belum menyediakan Web REST API publik untuk mengubah status profil via OAuth2 dari jarak jauh.
3. **Solusi Plugin Ini:**
   Plugin ini menggunakan **Native WebSocket** di dalam WebView Acode untuk terhubung langsung ke **Discord Gateway** (`wss://gateway.discord.gg`). Menggunakan identifikasi aman (*Opcode 2*) dan pengiriman status (*Opcode 3*), plugin ini dapat memancarkan status coding secara mandiri, hemat daya, dan realtime tanpa memerlukan Node.js atau Termux tambahan.

---

## 🌟 Fitur Utama

* **🎨 Logo & Branding Resmi Acode:**
  * Terintegrasi dengan Bot Application Acode ID: `1571462947983593595`.
  * Memiliki 2 opsi logo: `acode-ada-bg-biru` dan `acode-bg-transparan`.
* **🎧 Mode Fleksibel (Playing vs Listening):**
  * Kamu bisa memilih menampilkan status sebagai **Playing Acode** (Type 0) atau **Listening to Acode** (Type 2).
* **🔴 Fitur Matikan / Nyalakan RPC (Toggle Switch):**
  * Tekan shortcut **`Ctrl + Alt + T`** untuk mematikan atau mengaktifkan status RPC secara instan tanpa perlu uninstall plugin.
  * Saat dimatikan, plugin langsung menghapus aktivitas dari profil Discord kamu.
* **📂 Deteksi Workspace Otomatis:**
  * Secara cerdas mendeteksi nama folder project tempat file kamu berada.
* **🔗 Tombol Interaktif Profil:**
  * Default link mengarah ke repository RPC resmi: `https://github.com/myzert/acode-discord-rpc`.
  * Bisa kamu ganti dengan link repository GitHub project yang sedang kamu kerjakan.
  * Tombol kedua mengarah ke website resmi Acode Editor.
* **⚡ Realtime File, Line & Column Tracking:**
  * **Baris 1:** `Editing index.js (154 lines)` (menampilkan nama file beserta total baris).
  * **Baris 2:** `Workspace: acode-discord-rpc - Ln 42, Col 18`.
* **💤 Deteksi Idle Otomatis:**
  * Jika kamu meninggalkan editor selama 5 menit tanpa mengetik, status otomatis beralih menjadi `Idling`.
* **⏳ Hours Offset (Flexing Timer):**
  * Fitur tambahan untuk mengatur start timer mundur (misal 200 jam yang lalu) agar terlihat ngoding marathon!

---

## ⌨️ Daftar Shortcut / Command Palette

Buka Command Palette di Acode atau gunakan shortcut berikut:
* **`Ctrl + Alt + D`** : Membuka jendela pengaturan (*Settings Dialog*).
* **`Ctrl + Alt + T`** : Menyalakan / Mematikan status Discord RPC secara instan.
* Perintah **`discord_rpc_reconnect`** : Memaksa koneksi ulang ke Discord Gateway.

---

## 📥 Panduan Instalasi di Acode

1. Unduh file **`acode-discord-rpc.zip`** (tersedia di folder Download HP kamu).
2. Buka aplikasi **Acode**.
3. Buka menu **Settings (Pengaturan)** ➔ **Plugins**.
4. Tekan ikon titik tiga `⋮` di kanan atas ➔ pilih **Install from storage**.
5. Pilih file **`acode-discord-rpc.zip`**.
6. Tekan **`Ctrl + Alt + D`** untuk memasukkan User Token akun Discord kamu.
7. Selesai! Status Acode langsung live di profil Discord kamu.

---

## 🔒 Privasi dan Keamanan
* Token Discord kamu hanya disimpan secara lokal di memori privat HP kamu (`localStorage` Acode).
* Token tidak pernah dikirim ke server pihak ketiga mana pun dan tidak masuk ke dalam repository GitHub.

---

## 👨‍💻 Kontributor
Dibuat dengan ❤️ oleh **[myzert](https://github.com/myzert)**.  
Repository: [github.com/myzert/acode-discord-rpc](https://github.com/myzert/acode-discord-rpc)
