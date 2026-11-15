# Discord Rich Presence for Acode (Android) 📱✨

Plugin Rich Presence (RPC) resmi untuk aplikasi editor kode Android **Acode**, menampilkan aktivitas coding kamu secara langsung di Discord dengan status dan logo resmi **Acode**!

---

## 🌟 Fitur Utama

* **🎨 Logo & Branding Resmi Acode:**
  * Terintegrasi dengan Bot Application Acode ID: `1571462947983593595`.
  * Memiliki opsi logo resmi `acode-ada-bg-biru` dan `acode-bg-transparan`.
* **🧠 Auto-Detect Git Repository & Branch (.git):**
  * Membaca `.git/config` secara otomatis untuk mendeteksi link repository project (GitHub, GitLab, dll).
  * Tombol **View Repository** di profil Discord kamu akan otomatis mengarah ke repo project yang sedang dibuka!
  * Membaca `.git/HEAD` untuk menampilkan nama branch yang aktif (misal: `[main]`).
  * Jika folder project **tidak memiliki `.git`**, otomatis menggunakan nama folder biasa dan tombol fallback ke repo RPC.
* **🏷️ Deteksi Bahasa Pemrograman Lengkap:**
  * Menampilkan nama bahasa secara eksplisit pada status:
    * `Editing index.jsx [React JSX] (154 lines)`
    * `Editing server.php [PHP] (80 lines)`
    * `Editing app.js [JavaScript]`
    * Mendukung JS, JSX, TS, TSX, PHP, Python, HTML, CSS, C++, Rust, Go, Dart, Kotlin, dll.
* **🎧 Mode Fleksibel (Playing vs Listening):**
  * Kamu bisa memilih menampilkan status sebagai **Playing Acode** (Type 0) atau **Listening to Acode** (Type 2).
* **🔴 Fitur Matikan / Nyalakan RPC (Toggle Switch):**
  * Tekan shortcut **`Ctrl + Alt + T`** di Acode untuk mematikan atau menyalakan status RPC secara instan.
  * Saat dimatikan, plugin langsung menghapus aktivitas dari profil Discord kamu (*clear presence*).
* **⚡ Realtime Cursor & Line Tracking:**
  * Menampilkan file aktif, jumlah baris kode, serta nomor baris dan kolom kursor (`Ln 42, Col 18`).
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
