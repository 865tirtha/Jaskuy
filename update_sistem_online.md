# Update Sistem Online & Program Management Jaskuy

## Ringkasan
Aplikasi Jaskuy (Backend & Admin Panel) sekarang telah dapat diakses secara **online** dari luar jaringan lokal (seperti jaringan seluler). Laptop ini sekarang bertindak sebagai server uji coba (testing server) yang stabil, di mana seluruh program pendukung berjalan otomatis di background menggunakan sistem manajemen proses **PM2**.

---

## 1. Aktivasi Program Management (PM2)
Berdasarkan pembaruan terbaru, backend dan admin panel tidak perlu repot dinyalakan manual lagi, melainkan sudah diatur berjalan nonstop di background laptop.

- **Backend API**: Berjalan di port `3000` (Nama proses di PM2: `jaskuy-backend`)
- **Admin Panel**: Berjalan di port `5173` (Nama proses di PM2: `jaskuy-admin`)

**Perintah (Command) Penting PM2 untuk Monitor Server:**
- `pm2 list` : Melihat status program (Online/Offline) dan memastikan semuanya berjalan.
- `pm2 logs` : Melihat laporan (*log*) aktivitas terkini dari server untuk *debugging*.
- `pm2 monit` : Memantau penggunaan CPU dan RAM dari masing-masing program.

---

## 2. Akses Jaringan Publik (Localtunnel)
Untuk memungkinkan aplikasi Flutter (HP Android/Sales) bisa mengakses server laptop **tanpa** harus berada pada WiFi/jaringan yang sama, kita telah membuka *tunnel* menggunakan fitur Localtunnel yang juga dikelola oleh PM2.

- **URL Publik Backend API**: `https://jaskuyb2026.loca.lt/api`
- **URL Publik Admin Panel**: `https://jaskuya2026.loca.lt`

Karena ditangani PM2, *tunnel* ini akan direstart otomatis apabila sempat terputus koneksinya.

---

## 3. Pembaruan Aplikasi Flutter (Sales App)
Aplikasi di sisi *Sales* telah disesuaikan dengan infrastruktur online yang baru:

### Perubahan File Utama
**File**: `lib/services/api_service.dart`
1. **Perubahan URL IP**: Mengganti `http://10.75.221.93:3000/api` menjadi alamat online `https://jaskuyb2026.loca.lt/api`.
2. **Penanganan Bypass Peringatan Localtunnel**: Menambahkan *header* wajib `Bypass-Tunnel-Reminder: true` pada setiap perintah pemanggilan API standar (GET/POST) maupun API Multipart (Upload Gambar/KTP/Selfie). Tujuannya agar respon yang diterima aplikasi adalah format `JSON` yang sah, bukan terhenti di halaman peringatan Localtunnel.

---
### Status Saat Ini: Siap Uji Coba (Ready to Test)
Sistem sekarang bersifat layaknya *production-ready test server*. File **APK Versi 1.0.2 (Anti Blokir)** telah selesai di-*build* otomatis dan kini berada di laptop Anda pada direktori:
**`C:\Jaskuy\sales-app\build\app\outputs\flutter-apk\app-release.apk`**

Silakan salin/pindahkan file APK tersebut ke perangkat Android Anda yang mempunyai koneksi internet seluler, lalu _install_ dan jalankan aplikasinya. Aplikasi Sales App akan langsung tembus ke database lokal laptop Anda.

---

## 4. Akses Admin Dashboard (Lokal Area Jaringan)
Sempat ada isu di mana Admin Panel gagal dibuka via *localhost*. Ini dikarenakan proses manajemen PM2 di Windows gagal mengeksekusi `npm`. 

Ini sudah diselesaikan dengan menjalankan `kite.js` secara langsung di background dan membuka akses *Host* dari `vite.config.js`.
Sekarang Admin Panel dapat diakses langsung oleh *browser* di laptop ini (atau ponsel di WiFi yang sama) melalui:
`http://localhost:5173`

## 5. Upgrade Fitur Pendaftaran Sales App
Aplikasi Flutter telah ditingkatkan berdasarkan modul Pendaftaran Sales Baru (`register_screen.dart`). 
- Proteksi Localtunnel (Bypass-Tunnel-Reminder & Try-Catch) juga **telah diaplikasikan** pada halaman Pendaftaran Sales.
- Alur ini memungkinkan Sales Senior untuk mendaftarkan akun Sales Junior langsung dari HP tanpa diadang halaman HTML Localtunnel.

---

## 6. Pembaruan Kritis (Bulletproof Localtunnel Fixes)
Pembaruan terkini yang menjamin koneksi Sales App benar-benar lolos dari blokir Localtunnel:

- **Express CORS Dibuka Total**: Menggunakan konfigurasi `allowedHeaders: '*'` agar server Node.js mengizinkan semua custom header tanpa keraguan, memungkinkan Localtunnel pass-through dengan mulus.
- **Header Khusus Localtunnel**: Penambahan *header* `localtunnel-skip-warning: true` pada seluruh _endpoint_ di App Flutter (termasuk unggah file multipart) untuk mem-bypass filter Localtunnel.
- **Sistem Deteksi Error Interaktif**: 
  - Penambahan `try-catch` saat dekode JSON di semua fungsi vital (`login_screen.dart`, `dashboard_screen.dart`, `register_screen.dart`, `mitra_registration_screen.dart`). 
  - Jika aplikasi dicegat HTML peringatan Localtunnel, App tidak akan stuck (loading nge-hang), melainkan akan langsung memunculkan **SnackBar merah** spesifik di bawah layar HP beserta isi respon error-nya. Print console terminal juga sudah aktif sepenuhnya.

---

## 7. Bug Fix: Localtunnel Timeout (PM2 Conflict)
Terdapat *bug* sebelumnya di mana proses Localtunnel (`jaskuy-backend-tunnel`) terus menerus *crash* dan mengalami _timeout_ karena program PM2 di Windows salah mengeksekusi *interpreter* bawaannya (menggunakan `npm.cmd` alih-alih `node`). 

- **Solusi Permanen**: Modul Localtunnel sekarang tidak lagi dijalankan via *command line interface (CLI)*, melainkan dienkapsulasi menggunakan *script Node.js* kustom bernama `api-tunnel.js`. 
- PM2 kini mengeksekusi *script* ini dengan mulus dan merestart koneksi secara halus bila tunnel sempat terputus dari server publik loca.lt.


