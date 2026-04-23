# Panduan Lengkap Migrasi Database ke Supabase

Laporan ini ditujukan sebagai dokumentasi panduan perpindahan lingkungan database dari lokal (PostgreSQL) ke Cloud menggunakan **Supabase**. Langkah ini krusial untuk meringankan beban *laptop/server* lokal dan sebagai pondasi dasar menuju *Production Phase*.

---

## 1. Perbaikan File `.env` (Environment Variables)

Untuk menggunakan URL Connection String yang ringkas, tambahkan variabel baru `DATABASE_URL` ke dalam file `.env` proyek agan:

```env
# Tambahkan ini di file .env agan:
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.acepmeqeomyfxzkxenou.supabase.co:5432/postgres"

# Jangan lupa ganti [YOUR-PASSWORD] dengan password database Supabase agan.
```

---

## 2. Pembaruan Konfigurasi Koneksi (Node.js/Express)

Supabase mewajibkan koneksi dienskripsi menggunakan mode SSL. Oleh karena itu, semua file konfigurasi *Connection Pool* Node.js harus diperbarui.
Saya akan langsung **memperbaiki dua file database** milik agan, yaitu:
1. `src/config/db.js`
2. `src/infrastructure/database/db.js`

Kedua file tersebut akan saya perbarui logic `new Pool(...)`-nya menjadi seperti ini:

```javascript
const pool = new Pool({
    // Menggunakan Connection String Supabase jika ada
    connectionString: process.env.DATABASE_URL,
    
    // Atau fallback ke credentials lama jika DATABASE_URL tidak diset
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    
    // [WAJIB SUPABASE] Menambahkan konfigurasi SSL agar tidak ditolak
    ssl: { 
        rejectUnauthorized: false 
    }
});
```

---

## 3. Pembuatan Tabel Awal (SQL Migration untuk Supabase)

Karena Supabase agan saat ini kosong melompong secara struktur tabel, untuk mencegah *error 500* saat registrasi Sales App, agan harus membuat ulang tabel `sales_agents` terlebih dahulu. 

Silakan **Copy - Paste** *script* SQL di bawah ini ke fitur **SQL Editor di Dashboard Supabase** agan lalu jalankan (Run):

```sql
-- Mengaktifkan ekstensi utilitas uuid (Opsional namun direkomendasikan Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Membuat tabel utama Sales Agent
CREATE TABLE IF NOT EXISTS sales_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone_number VARCHAR(20),       -- Menambahkan kolom nomor HP sesuai instruksi
    password_hash VARCHAR(255) NOT NULL,
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

Setelah tabel ini terbentuk, *endpoint* POST `/api/auth/sales/register` tidak lagi mengalami error 500 asalkan koneksi `.env` telah sesuai.
