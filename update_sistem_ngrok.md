# Laporan Perbaikan Sistem Tunnel (Ngrok) & Backend

## Ringkasan Insiden
Sistem manajemen *tunnel* sebelumnya (menggunakan Localtunnel) kembali diubah menggunakan layanan **Ngrok** karena terjadinya *crash* (tidak stabil/timeout) pada aplikasi Sales (APK). Namun, setelah pengembalian ke URL Ngrok (`https://nonmoderately-catechetical-iker.ngrok-free.dev`), timbul *error* akses **`ERR_NGROK_3200`** (Endpoint Offline) saat aplikasi diuji coba.

## Tindakan yang Telah Dilakukan

Berikut adalah rekam jejak langkah-langkah yang baru saja dilakukan untuk menstabilkan dan menghubungkan kembali aplikasi dengan server lokal:

### 1. Build Ulang Aplikasi Sales (APK)
- **Aksi**: Mengeksekusi proses kompilasi rilis APK Flutter (`flutter build apk --release`).
- **Hasil**: APK versi terbaru (48.0MB) yang membawa *endpoint* API Ngrok telah berhasil di-*build* ulang di direktori `C:\Jaskuy\sales-app\build\app\outputs\flutter-apk\app-release.apk`.

### 2. Diagnosis Error `ERR_NGROK_3200`
- Terjadi indikasi bahwa *tunnel* Ngrok tidak mendapat respon dari *localhost* atau proses Ngrok di laptop terhenti.
- **Investigasi Sistem (PM2)**: Dicek melalui perintah `pm2 list`, ditemukan bahwa daftar proses yang berjalan **kosong**. Hal ini mengindikasikan bahwa _daemon_ Node.js (backend) dan tunnel tidak berjalan di *background*, kemungkinan besar akibat proses PM2 terhenti pasca-*restart* komputer atau konflik sebelumnya.

### 3. Pemulihan Backend Server
- **Aksi**: Mengaktifkan ulang server utama aplikasi (`src/server.js`) menggunakan PM2.
- **Hasil**: Server `jaskuy-backend` saat ini telah aktif dan "listening" kembali secara normal di `localhost:3000`.

### 4. Reaktivasi Ngrok Tunnel Statis
- **Aksi**: Menghentikan semua proses Ngrok liar yang *nyangkut* dan memulai ulang aplikasi `ngrok.exe` yang terhubung langsung dengan domain statis (`nonmoderately-catechetical-iker.ngrok-free.dev`) mengarah ke port lokal 3000.
- **Hasil**: Lalu lintas API dari luar jaringan (termasuk internet seluler) sekarang sudah berhasil diteruskan kembali (forwarding) masuk ke aplikasi Node.js lokal di port 3000.
**Catatan Tambahan**: Sempat muncul error `ERR_NGROK_8012` yang disebabkan karena ada proses *background* Ngrok yang secara bawaan (*default*) mencoba meneruskan trafik ke `localhost:80` alih-alih port `3000`. Saya telah berhasil mematikannya paksa dan menjalankan konfigurasi yang benar secara *background*.

### 5. Persistensi Konfigurasi
- **Aksi**: Menjalankan perintah penyimpanan _state_ (`pm2 save`).
- **Hasil**: Proses backend dan konfigurasi saat ini dikunci oleh PM2, sehingga apabila PM2 diaktifkan (atau disetel untuk hidup otomatis), server jaskuy akan langsung siap tanpa perlu di-*start* ulang manual.

---

## Status Sistem Saat Ini:  ✅ **ONLINE & SIAP UJI COBA**
Seluruh jembatan koneksi (*Ngrok Tunnel*) dan jantung aplikasi (*Node.js Backend*) telah hidup. Aplikasi **Sales App (Flutter)** seharusnya sudah bisa melakukan *Login* / *Register* secara nirkabel dari internet luar.

## Rekomendasi Selanjutnya
Apabila halaman **Admin Panel (Vite/React)** ikut tidak bisa diakses di browser, pastikan untuk kembali menyalakan React *development server* (di port 5173), baik secara manual atau mendaftarkannya kembali di PM2 (`pm2 start npm --name "jaskuy-admin" -- run dev`).
