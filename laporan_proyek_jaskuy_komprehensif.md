# 🚀 Laporan Komprehensif Pengembangan Jaskuy (V3 - V4)

Dokumen ini merupakan rangkuman terintegrasi dari seluruh fase pengembangan Backend, Infrastruktur, dan Business Logic aplikasi Jaskuy. Laporan ini menggabungkan detail teknis arsitektur, skema database, aturan bisnis terbaru (V4), hingga sistem manajemen tunnel yang digunakan untuk stabilitas aplikasi.

---

## 🏗️ 1. Arsitektur & Teknologi Utama
Sistem Jaskuy dibangun dengan standar *Enterprise* menggunakan arsitektur **Domain-Driven Design (DDD)** untuk memisahkan logika fungsional secara modular.

- **Backend Stack**: Node.js & Express.js (REST API).
- **Database**: PostgreSQL dengan ekstensi **PostGIS** untuk kalkulasi jarak geografis (Geofencing).
- **Real-time**: Socket.IO untuk sistem Chatting & Moderasi AI instan.
- **Worker**: `node-cron` untuk menangani *Escrow Release* dan *Chat Garbage Collection*.
- **Security**: JWT Authentication, bcrypt, dan Middleware Penalti 3-Lapis.
- **Process Management**: **PM2** untuk menjamin persistensi server (Backend, Admin, & Tunnel).

---

## 📊 2. Skema Database & Logika Bisnis Kompleks

### A. Geofencing Radius Dinamis (PostGIS)
Untuk Jasa Fisik, sistem menggunakan algoritma pencarian bertingkat di `mitra.service.js`:
1. **Radius Awal**: 5 KM.
2. **Iterasi**: Jika tidak ditemukan, radius diperluas ke 10 KM, lalu maksimal 15 KM.
3. **Biaya Tambahan**: Jika ditemukan di luar 5 KM, flag `is_out_of_range` diset `true` dengan biaya tambahan `out_of_range_fee` sebesar **Rp 15.000**.

### B. Multitasking Jasa Digital
Untuk Jasa Digital, batasan geografis diabaikan. Validasi berpindah ke **Slot Kapasitas**:
- `active_working_slots` vs `max_concurrent_slots`.
- Memungkinkan satu Mitra (misal: Drafter/Programmer) menangani hingga **4 Job sekaligus**.

### C. Sistem Escrow & Tips Murni
- **Escrow**: Dana ditahan sistem hingga pekerjaan selesai. Jika User tidak konfirmasi dalam **24 Jam**, CronJob `escrow.worker.js` akan mencairkan dana otomatis ke dompet Mitra.
- **Tips**: 100% dana Tips masuk ke Mitra tanpa potongan.
- **Management Cut**: Potongan 20% (Fisik) atau 25% (Digital) **hanya** dikenakan pada harga layanan asli (`original_service_price`).

---

## 💰 3. Aturan Bisnis V4 (Registration & Iklan)

### A. Biaya Pendaftaran & Referral Sales
Berdasarkan revisi terbaru, biaya pendaftaran Mitra disederhanakan:
- **Total Biaya**: **Rp 50.000**.
- **HPP Merchandise**: Rp 35.000 (Pembuatan Pin & Kit).
- **Sisa Bersih**: Rp 15.000.
- **Komisi Sales**: Jika menggunakan kode referral, Sales mendapatkan **10% (Rp 1.500)**. Sisa **90% (Rp 13.500)** masuk ke pendapatan perusahaan.

### B. Tiering Iklan (Sorting Priority)
Algoritma pencarian mengurutkan mitra berdasarkan status iklan mereka:
1. **RANK_1_NEWBIE (Rp 200.000)**: Prioritas tertinggi, kuota 15 pelanggan.
2. **RANK_2_RECOVERY (Rp 175.000)**: Untuk mitra dengan rating < 3.0 guna memulihkan reputasi.
3. **PREMIUM PRO (Rp 3.000.000)**: Eksklusif untuk Badge Biru/Merah (Maks 3 mitra per kota).

---

## 🤖 4. Moderasi AI & Keamanan

### A. Chat Moderation (Regex System)
Sistem menggunakan `chatModerator.js` untuk mencegah transaksi di luar platform (off-platform):
- Mencegat kata kunci: WhatsApp, nomor HP, link eksternal, dan username media sosial.
- Pesan yang melanggar akan otomatis disensor: `[Pesan disensor oleh Sistem karena melanggar Aturan]`.

### B. Sistem Penalti 3-Strikes
Pelanggaran moderasi atau perilaku buruk akan memicu sanksi otomatis:
- **Strike 1**: Non-aktif 48 Jam.
- **Strike 2**: Beku 1 Minggu.
- **Strike 3 (Permanent)**: Banned Permanen & NIK masuk ke `blacklisted_niks`.

---

## 🌐 5. Infrastruktur Online & Tunnel Management

### A. Migrasi Tunnel (Ngrok)
Setelah mengalami ketidakstabilan dengan Localtunnel, sistem kini beralih menggunakan **Ngrok** dengan domain statis untuk menjamin koneksi Sales App (APK) yang selalu aktif.
- **Domain API**: `https://nonmoderately-catechetical-iker.ngrok-free.dev`

### B. Konfigurasi Client (Flutter)
Aplikasi Sales telah diperbarui dengan logic "Bypass Tunnel Reminder":
- Header `Bypass-Tunnel-Reminder: true` dan `localtunnel-skip-warning: true` disematkan pada setiap request API.
- Proteksi `try-catch` pada parsing JSON untuk menangani error jaringan secara elegan dengan SnackBar merah.

### C. Persistensi via PM2
Seluruh jantung aplikasi dikelola oleh PM2 agar hidup otomatis saat server/laptop restart:
- `jaskuy-backend`: Server utama (Port 3000).
- `jaskuy-admin`: Dashboard React/Vite (Port 5173).
- `api-tunnel`: Script monitoring tunnel.

---

## ✅ Status Sistem: ONLINE & SIAP UJI COBA
Semua komponen kini terhubung. Aplikasi **Sales App (Flutter)** versi terbaru siap digunakan untuk pendaftaran dan pengelolaan Mitra secara real-time melalui jaringan internet publik.

---
*Laporan ini dihasilkan secara otomatis oleh Antigravity AI sebagai dokumentasi final proyek Jaskuy.*
