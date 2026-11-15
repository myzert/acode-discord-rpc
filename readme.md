# Discord Rich Presence for Acode (Android) 📱✨

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/myzert/acode-discord-rpc)
[![Platform](https://img.shields.io/badge/platform-Acode%20(Android)-teal.svg)](https://acode.foxdebug.com)
[![Author](https://img.shields.io/badge/author-myzert-purple.svg)](https://github.com/myzert)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Plugin resmi untuk aplikasi editor kode Android **Acode**, yang memunculkan status aktivitas coding kamu di Discord secara realtime dengan status **Acode**!

---

## 🌟 Fitur Utama

* **📱 Status Acode Otentik:**
  * Di Discord tampil sebagai `Acode` (atau bisa diganti ke `Visual Studio Code`).
  * Large Text: `Acode - Code Editor on Android`.
* **📂 Deteksi Bahasa Otomatis (50+ Bahasa):**
  * Otomatis mengenali ekstensi file: JavaScript, TypeScript, Python, HTML, CSS, C/C++, Java, Rust, Go, PHP, Kotlin, Dart, Zig, Docker, JSON, Markdown, YAML, dan banyak lagi.
* **⚡ Realtime File, Line & Column Tracking:**
  * **Details:** `Editing index.js (154 lines)`
  * **State:** `Workspace: cihuynime - Ln 42, Col 18`
* **💤 Deteksi Idle Otomatis:**
  * Jika kamu istirahat atau tidak mengetik selama 5 menit, status otomatis berubah jadi `Idling in cihuynime`.
* **🔗 Tombol Interaktif di Profil:**
  * **Tombol 1:** Link langsung ke repository GitHub kamu (misal: [github.com/myzert/cihuynime](https://github.com/myzert/cihuynime)).
  * **Tombol 2:** Link ke Acode Editor (`https://acode.foxdebug.com`).
* **⏳ Hours Offset (Flexing Timer):**
  * Fitur iseng untuk mengatur timer mundur (misal: 200 jam yang lalu) agar terlihat ngoding marathon tanpa henti!
* **⚙️ Built-in Settings Menu:**
  * Atur token, ganti nama status, link repository, dan offset waktu langsung di dalam aplikasi Acode via shortcut `Ctrl + Alt + D`.
* **🔋 Super Ringan & Hemat Daya:**
  * Menggunakan WebSocket native Android WebView tanpa memerlukan Termux atau Node.js tambahan saat dijalankan.

---

## 📥 Cara Pasang di Aplikasi Acode

1. Unduh file `acode-discord-rpc.zip` dari halaman [Releases](https://github.com/myzert/acode-discord-rpc/releases) (atau ambil dari folder `Download` di HP kamu).
2. Buka aplikasi **Acode**.
3. Masuk ke **Settings (Pengaturan)** ➔ **Plugins**.
4. Tekan tombol titik tiga `⋮` di pojok kanan atas ➔ pilih **Install from storage**.
5. Pilih file `acode-discord-rpc.zip`.
6. Selesai! Plugin langsung aktif.

---

## ⚙️ Cara Konfigurasi

1. Buka file apa saja di Acode.
2. Buka Command Palette (atau tekan `Ctrl + Alt + D`).
3. Masukkan **Discord User Token** kamu.
4. Masukkan link repository kamu (default: `https://github.com/myzert/cihuynime`).
5. Simpan pengaturan. Status kamu di Discord akan langsung live!

---

## ⚠️ Keamanan Token (PENTING)
Token Discord kamu hanya disimpan secara lokal di dalam memori penyimpanan Acode (`localStorage`) di HP kamu sendiri. Jangan pernah membagikan token ini kepada siapa pun!

---

## 👨‍💻 Author & Lisensi
Dibuat dengan ❤️ oleh **[myzert](https://github.com/myzert)**.  
Lisensi: MIT.
