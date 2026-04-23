# Panduan Migrasi Supabase V2 (IPv4 Connection Pooler)

Panduan ini berisi langkah-langkah final untuk migrasi PostgreSQL server lokal agan menuju **Supabase Cloud**, lengkap beserta struktur tabel yang dibutuhkan agar aplikasi *backend* dan Flutter Sales App agan tidak mengalami Error 500 / 502 Bad Gateway.

---

## 1. Perbaikan File `.env` (Selesai)

Saya baru saja memperbarui file `.env` di sistem agan untuk menggunakan Connection Pooler (Jaringan IPv4) dari Supabase sesuai yang agan instruksikan:

```env
DATABASE_URL="postgresql://postgres.acepmeqeomyfxzkxenou:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```
**LANGKAH AGAN:** Buka file `.env` di laptop agan, lalu ganti teks `[YOUR-PASSWORD]` dengan kata sandi Supabase agan dan **Save/Simpan**.

---

## 2. Perbaikan Konfigurasi Koneksi SSL (Selesai)

Saya **sudah menyematkan aturan SSL Wajib** (`ssl: { rejectUnauthorized: false }`) pada kedua file koneksi Node.js agan di langkah sebelumnya.
Kode di `src/config/db.js` dan `src/infrastructure/database/db.js` sudah sepenuhnya kompatibel dan tidak akan menolak koneksi dari Supabase:

```javascript
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // KODE INI SUDAH TERPASANG
    // ...
});
```
Agan **tidak perlu mengubah file kode Node.js apa pun lagi**.

---

## 3. Pembuatan Tabel Awal (SQL Migration)

Karena Supabase yang agan buat masih kosongan, API backend untuk registrasi Sales akan otomatis *crash* jika tidak menemukan tabel dan kolom yang sesuai.

Silakan **Copy - Paste kueri SQL di bawah ini ke SQL Editor di dashboard Supabase agan** lalu jalankan (Run).
Kueri ini akan membuat tabel khusus agen *sales* lengkap dengan 4 kolom wajib (`name, email, password_hash, phone_number`):

```sql
-- Mengaktifkan ekstensi UUID generator bawaan PostgreSQL/Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Membuat struktur tabel sales_agents yang sejalan dengan kode backend agan
CREATE TABLE IF NOT EXISTS sales_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone_number VARCHAR(20),       -- Tambahan kolom nomor handphone
    password_hash VARCHAR(255) NOT NULL,
    referral_code VARCHAR(50) UNIQUE NOT NULL, -- Di-generate auto oleh Backend
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## ✅ Langkah Terakhir Instalasi
1. Ganti `[YOUR-PASSWORD]` di `.env`.
2. Eksekusi Kueri `CREATE TABLE` di atas melalui Dashboard Supabase.
3. Kabari saya lagi, agar saya merestart *server backend* agan (`pm2 restart`) dan melakukan testing pendaftaran API melalui Node.js.
