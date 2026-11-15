# Discord Rich Presence for Acode (VS Code Style) 🚀

Plugin resmi untuk aplikasi editor kode Android **Acode**, yang memunculkan status aktivitas coding kamu di Discord dengan tampilan **100% otentik Visual Studio Code Rich Presence**!

---

## ✨ Fitur Unggulan

* **100% Tampilan Otentik VS Code:**
  * Terdeteksi sebagai aplikasi resmi `Visual Studio Code` di Discord.
  * Logo besar resmi VS Code dengan logo kecil (badge) bahasa pemrograman.
* **Deteksi Bahasa Otomatis:**
  * Lebih dari 50+ bahasa didukung otomatis (JavaScript, TypeScript, Python, HTML, CSS, C/C++, Java, Rust, Go, PHP, Kotlin, Dart, Zig, Docker, dll).
* **Realtime File & Line Tracking:**
  * Menampilkan file yang sedang dibuka: `Editing index.js`.
  * Menampilkan workspace folder dan baris kursor: `Workspace: cihuynime - Ln 42, Col 18`.
* **Deteksi Idle Otomatis:**
  * Jika kamu tidak mengetik selama 5 menit, status otomatis berubah menjadi `Idling` dengan icon *idle VS Code*.
* **Tombol Interaktif di Profil Discord:**
  * Tombol link langsung ke repository GitHub project kamu (misal: `https://github.com/myzert/cihuynime`).
  * Tombol link ke Acode Editor.
* **Hours Offset (Flexing Timer):**
  * Fitur iseng buat set timer mulai mundur (misal 200 jam yang lalu) biar kelihatan ngoding marathon!
* **Ringan & Tanpa Dependensi:**
  * Menggunakan native WebSockets browser Acode langsung ke Discord Gateway, tanpa butuh Termux atau Node.js terpisah saat dijalankan.

---

## 📥 Cara Pasang di Aplikasi Acode

1. Unduh atau salin file `acode-discord-rpc.zip` ke penyimpanan HP kamu.
2. Buka aplikasi **Acode**.
3. Buka **Pengaturan (Settings)** ➔ **Plugins**.
4. Tekan tombol titik tiga `⋮` di pojok kanan atas, pilih **Install from storage**.
5. Pilih file `acode-discord-rpc.zip`.
6. Selesai! Plugin langsung aktif.

---

## ⚙️ Cara Konfigurasi

1. Buka file apa saja di Acode.
2. Buka Command Palette (atau tekan shortcut `Ctrl + Alt + D`), ketik `discord_rpc_settings`.
3. Masukkan **Discord User Token** kamu.
4. (Opsional) Masukkan link repository GitHub kamu.
5. Klik Simpan. Begitu terhubung, notifikasi toast bertuliskan `✨ Discord RPC Aktif!` akan muncul di Acode!

---

## ⚠️ Keamanan Token (PENTING)
Token Discord kamu hanya disimpan secara lokal di dalam memori penyimpanan Acode (`localStorage`) di HP kamu sendiri. Jangan pernah membagikan token ini kepada siapa pun!

---

## 👨‍💻 Author
Dibuat dengan ❤️ oleh **[myzert](https://github.com/myzert)**.
Repo: [github.com/myzert/acode-discord-rpc](https://github.com/myzert/acode-discord-rpc)
