# 🚀 Laporan Implementasi Backend Jaskuy (Fase 1 - 4)

Dokumen ini merangkum seluruh hasil pengembangan REST API, WebSockets, dan Background Workers pada aplikasi Jaskuy yang telah dibangun menggunakan standar kelas *Enterprise* (Arsitektur *Domain-Driven Design* / Service-Controller Pattern), NodeJS, Express, dan PostgreSQL (*node-postgres*).

---

## 🏗️ 1. Arsitektur & Teknologi Utama
- **Framework**: Express.js (REST API Endpoint Server)
- **Database**: PostgreSQL dengan query *native* (`pg`) untuk optimasi perfoma (tanpa ORM) dan **PostGIS** untuk Geofencing koordinat bumi.
- **Real-time Server**: Socket.IO (Chatting & Moderasi AI)
- **Background CronJobs**: `node-cron` (Escrow Worker & Chat Garbage Collector)
- **Security Checkers**: `jsonwebtoken` (JWT), `bcrypt`, Custom API Middlewares (Strike & Hukuman 3-Lapis).
- **Transaction Manager**: DB Pooling dengan pola `BEGIN` & `COMMIT` untuk memastikan integritas aliran uang jika error (Atomicity).

---

## 🔒 2. Fase 1: Setup & Autentikasi (V4 Rules)

- **Strike Middleware (`strike.middleware.js`)**: 
  Pengaman otomatis (Gatekeeper) di tingkat router. Berfungsi memblokir User atau Mitra yang akunnya berstatus terkena sanksi moderasi (`DISABLED`, `FROZEN`, `BANNED_PERM`). Otomatis membaca status _suspended_until_.

- **Mitra Registration / KYC (`auth.controller.js`)**:
  - Hash password `bcrypt`.
  - Sistem Pengecekan *NIK Blacklist* (AI 3-Strike). Jika NIK terdaftar, pendaftaran diblokir.

- **Pembayaran Onboarding (Rp 50.000) & Referral Sales V4 (`registration.service.js`)**:
  - Dibuat sesuai revisi V4 Jaskuy—Biaya pendaftaran dasar di-hardcode di **Rp 50.000**.
  - **Rp 35.000**: Dialihkan sistem sebagai HPP Pembuatan Pin Merchandise (mengubah `merch_status` menjadi 'PENDING').
  - **Rp 15.000 Sisa Bersih**: Jika Mitra memasukkan kode Referral, Sales mendapatkan **10% (Rp 1.500)** yang disuntik langsung ke tabel `sales_commissions` dan update saldo Sales (`sales_agents`). Sisanya **90% (Rp 13.500)** adalah pendapatan Kas Jaskuy.

---

## 📍 3. Fase 2: Core Booking & Geofencing (V4)

- **Search Geofencing Berlapis (`mitra.service.js`)**:  
  - **Jarak Relasional (PostGIS ST_DWithin)**: Di Jasa Fisik, Backend memanipulasi loop dinamis Node.js dengan ekstensi Spasial PostgreSQL. Mulai dari _Scanning_ 5KM. Jika nihil, diperbesar ke 10KM, hingga puncaknya 15KM.
  - Tambahan Flag Otomatis `is_out_of_range: true` dan pembebanan `out_of_range_fee: 15.000` (Jarak > 5KM).
  - **Jasa Digital (*Multitasking Slot*)**: Bypass pembacaan radius bumi. Menyeleksi berdasarkan perbandingan kuota `active_working_slots` vs `max_concurrent_slots`.

- **Sorting Algoritma Prioritas Iklan V4**:
  Peringkat urutan di query SQL dijamin dengan fungsi `CASE WHEN`:
  1. Iklan RANK_1_NEWBIE (Rp 200rb) di posisi satu.
  2. Iklan RANK_2_RECOVERY (Rp 175rb) di posisi dua.
  3. Sisanya diurutkan lewat *Rating Rata-rata* alami.

- **Escrow & Tip Murni (`booking.service.js`)**:  
  - Menjaga Dynamic Pricing V3 (Mitra Biru maks *Markup Limit 1.75x*, Merah *2.0x*, Hijau dilarang ngeset *Service Price* di bawah Rp 50.000).
  - Pada `completeBooking()`, Potongan Manajemen (Management Cut 20% Fisik & 25% Digital_Under_5_Stars) **HANYA DIKENAKAN** pada nilai `original_service_price`.
  - Uang asuransi (*Insurance Fee*) sebesar 10% diambil sistem dari *Management Cut*, lalu Mitra level MERAH mendapatkan bonus **Cashback 5%**!
  - **TIPS**: Masuk kantong Mitra secara murni (100% Bebas Potongan). 

---

## 💸 4. Fase 3: Automated Escrow CronJobs

- **Escrow Release Worker (`escrow.worker.js`)**:
  - Background Job murni Node (`node-cron`).
  - Menyala otomatis pada setiap awal jam (`0 * * * *`).
  - Menyeleksi transaksi yang status di Database adalah `AWAITING_CONFIRMATION` dari User (setelah Mitra memencet tombol Selesai Kerjakan) yang mandek melebih batas **24 Jam**.
  - Membuka Gembok Escrow dan mencairkan uangnya (menambah poin di `wallet_balance` tabel `mitras`) tanpa harus menunggu User mencetaknya secara manual.

---

## 🤖 5. Fase 4: WebSocket AI Moderation & Auto-Delete Chat

- **Regex Terminator Server (`chatModerator.js` & `regexModerator.js`)**:  
  - Terpisah namun bersatu dengan Server Express (Socket.IO).
  - Memiliki *Array Expressions* tajam (Regex) untuk mencegat niat jahat pengguna menyebar kata kunci: WhatsApp, Nomer Handphone licik (`o lapan`, `kosong 8`), Sosmed (IG/FB/Tele), hingga Tautan (Link web luar).
  - Jika dicurigai: Teks asli tidak akan tersebar menuju lawan chat. Melainkan dikonversi menjadi `[Pesan disensor oleh Sistem karena melanggar Aturan]`.

- **Integrasi 3-Strikes System Backend (`penalty.service.js`)**:  
  Server WebSocket tidak hanya melarang pesan, tetapi memanggil Service Penalti:
  - **Pelanggaran Pertama**: Akun di non-aktifkan 48 JAM (`DISABLED_2_DAYS`).
  - **Pelanggaran Kedua**: Akun dibekukan 1 MINGGU (`FROZEN_1_WEEK`).
  - **Pelanggaran Ketiga (MATI)**: Status `BANNED_PERM`. Jika dia bermitra, NIK KTP-nya masuk tabel The Blacklist (`blacklisted_niks`) mencegah pembuatan akun selamanya. Socket langsung melakukan `socket.disconnect()`.
  
- **Auto-Delete Chat (Garbage Collection)**: (`chatGarbageCollector.js`):
  - Job Cron lain yang berjalan pada jadwal *Menit 30* di tiap Jam (`30 * * * *`).
  - Menghemat memory PostgreSQL App Jaskuy secara radikal: Mencari pesanan (`bookings`) dengan status `COMPLETED` yang usianya lewat 24 Jam.
  - Eksekusi `DELETE FROM chat_messages` (Operasi Cascasde/Sweep masal). Keamanan dan privasi (Privacy By Design) tereksekusi paripurna. 

---

### End. 
*Architected and Crafted using Domain-Driven NodeJS Paradigm by Antigravity AI.*
