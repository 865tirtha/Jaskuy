# Laporan Arsitektur Backend Jaskuy V3
## Skema Database & Logika Bisnis Kompleks

Laporan ini ditujukan untuk panduan Tim Developer yang memegang Backend (Express.js) & Database Administrator (PostgreSQL). Sistem Jaskuy telah berevolusi ke tahap fitur kompleks tinggi untuk memastikan stabilitas transaksi Gig Economy.

---

### 1. Struktur Database PostgreSQL + PostGIS

Sistem Database V3 berfokus pada fitur **Escrow**, **Pemisahan Uang Tips**, **Dynamic Geofencing**, dan sistem **Recovery Ads**.

```sql
-- Mengaktifkan ekstensi untuk Geofencing Bumi
CREATE EXTENSION IF NOT EXISTS postgis;

-- --------------------------------------------------------
-- 1. ENUMS (Tipe Data Standar Aplikasi)
-- --------------------------------------------------------
CREATE TYPE service_category AS ENUM ('PHYSICAL', 'DIGITAL');
CREATE TYPE tier_badge AS ENUM ('GREEN', 'BLUE', 'RED');
CREATE TYPE account_status AS ENUM ('ACTIVE', 'DISABLED', 'FROZEN', 'BANNED_TEMP', 'BANNED_PERM');
CREATE TYPE user_role AS ENUM ('USER', 'MITRA');
CREATE TYPE booking_status AS ENUM ('SEARCHING', 'MATCHED', 'WORKING', 'AWAITING_CONFIRMATION', 'COMPLETED', 'CANCELLED');
CREATE TYPE mitra_work_status AS ENUM ('AVAILABLE', 'WORKING', 'OFFLINE');
CREATE TYPE ad_tier_rank AS ENUM ('RANK_1_NEWBIE', 'RANK_2_RECOVERY', 'ORGANIC');

CREATE TABLE blacklisted_niks (
    nik VARCHAR(20) PRIMARY KEY,
    reason TEXT NOT NULL,
    banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    strike_count INT DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    status account_status DEFAULT 'ACTIVE',
    suspended_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mitras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nik VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    dob DATE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    is_kyc_verified BOOLEAN DEFAULT FALSE,
    work_status mitra_work_status DEFAULT 'OFFLINE',
    current_location GEOGRAPHY(POINT, 4326),
    
    -- Kapasitas Multitasking (Fisik = max 1, Digital = max N)
    max_concurrent_slots INT DEFAULT 1,
    active_working_slots INT DEFAULT 0,
    
    total_users_served INT DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    badge_tier tier_badge DEFAULT 'GREEN',
    wallet_balance DECIMAL(15,2) DEFAULT 0.00,
    
    strike_count INT DEFAULT 0,
    status account_status DEFAULT 'ACTIVE',
    suspended_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IKLAN PRIORITAS (RANK 1 vs RANK 2)
CREATE TABLE mitra_priority_ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mitra_id UUID REFERENCES mitras(id) ON DELETE CASCADE,
    ad_rank ad_tier_rank NOT NULL, -- Penentu prioritas di Algoritma Search
    amount_paid DECIMAL(15,2) NOT NULL, 
    initial_quota INT DEFAULT 15,
    quota_remaining INT DEFAULT 15,
    visibility_score DECIMAL(5,2) DEFAULT 100.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category service_category NOT NULL,
    avg_market_price DECIMAL(15,2) DEFAULT 0.00
);

CREATE TABLE mitra_services (
    mitra_id UUID REFERENCES mitras(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    base_price DECIMAL(15,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (mitra_id, service_id)
);

-- SISTEM BOOKING & ESCROW
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    mitra_id UUID REFERENCES mitras(id),
    service_id UUID REFERENCES services(id),
    status booking_status DEFAULT 'SEARCHING',
    
    -- Jarak Terhitung Otomatis dari Logika Geofencing Dinamis
    user_booking_location GEOGRAPHY(POINT, 4326),
    distance_km DECIMAL(6,2), 
    is_out_of_range BOOLEAN DEFAULT FALSE, 
    out_of_range_fee DECIMAL(10,2) DEFAULT 0.00,
    priority_ad_consumed_id UUID REFERENCES mitra_priority_ads(id), 
    
    original_service_price DECIMAL(15,2) NOT NULL, -- Kolom untuk perhitungan 20%
    admin_fee DECIMAL(10,2) DEFAULT 1500.00,       
    
    management_cut_percent INT NOT NULL,             
    management_cut_amount DECIMAL(15,2) NOT NULL,    
    insurance_fee_amount DECIMAL(15,2) NOT NULL,     
    cashback_bonus_amount DECIMAL(15,2) DEFAULT 0,   
    
    -- KOLOM TIPS DI PISAH AGAR UANG 100% MASUK KE MITRA
    tips_amount DECIMAL(15,2) DEFAULT 0.00,
    
    -- Accounting
    total_paid_by_user DECIMAL(15,2) NOT NULL,       
    net_earned_by_mitra DECIMAL(15,2) NOT NULL,      
    
    -- Escrow (Hold Payments)
    started_at TIMESTAMP,
    mitra_finished_at TIMESTAMP, -- Mitra klik selesai, status naik ke 'AWAITING_CONFIRMATION'
    completed_at TIMESTAMP,      -- Duit diteruskan saat user klik Konfirmasi / lewat 24 jam bot cron
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    reviewer_role user_role NOT NULL, 
    reviewer_user_id UUID,  
    reviewer_mitra_id UUID, 
    target_user_id UUID,    
    target_mitra_id UUID,   
    rating DECIMAL(2,1) CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (booking_id, reviewer_role)
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    sender_role user_role NOT NULL, 
    sender_id UUID NOT NULL,
    message_content TEXT NOT NULL,
    is_censored BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE regex_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES chat_messages(id),
    violator_role user_role NOT NULL,
    violator_id UUID NOT NULL,
    violation_keyword TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE penalty_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offender_role user_role NOT NULL, 
    offender_id UUID NOT NULL,
    triggered_by UUID,
    strike_number INT NOT NULL, 
    action_taken VARCHAR(100) NOT NULL, 
    reason TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2. Arsitektur Folder Enterprise 

Arsitektur aplikasi ditulis berdasarkan *Domain-Driven*, memisahkan fitur berdasarkan ruang lingkup logika fungsional, bukan hanya tipe teknisnya.

```text
📦 jaskuy-backend (Express.js)
 ┣ 📂 src
 ┃ ┣ 📂 core              # Modul Agnostic & Utility Reusable
 ┃ ┃ ┣ 📂 middlewares     # auth.js (JWT Middleware & Role checking), errorHandler.js
 ┃ ┃ ┣ 📂 utils           # regexModerator.js, geoMath.js
 ┃ ┃ ┗ 📂 constants       # ENUM
 ┃ ┣ 📂 domains           # ✨ BUSINESS LOGIC (Pusat Fungsional Aplikasi)
 ┃ ┃ ┣ 📂 auth            # auth.controller.js, auth.routes.js, auth.service.js
 ┃ ┃ ┣ 📂 users           # Kelola profil, metode bayar (opsional), dan histori strike User
 ┃ ┃ ┣ 📂 mitras          # Algoritma Pencarian Geofencing & Iklan Prioritas
 ┃ ┃ ┃ ┣ 📜 kyc.service.js
 ┃ ┃ ┃ ┣ 📜 mitra.controller.js
 ┃ ┃ ┃ ┣ 📜 mitra.routes.js
 ┃ ┃ ┃ ┗ 📜 mitra.service.js 
 ┃ ┃ ┣ 📂 bookings        # Sistem Escrow, Management Cut (Rupiah Constraints), dan Kalkulasi Tip
 ┃ ┃ ┃ ┣ 📜 escrowWorker.js   # Script Cronjob memindahkan status ke Completed jika lewat 24 Jam
 ┃ ┃ ┃ ┣ 📜 booking.controller.js
 ┃ ┃ ┃ ┣ 📜 booking.routes.js
 ┃ ┃ ┃ ┗ 📜 booking.service.js
 ┃ ┃ ┣ 📂 reviews         # Rating Dua Arah & Dynamic Tiering Sistem
 ┃ ┃ ┃ ┣ 📜 review.controller.js
 ┃ ┃ ┃ ┣ 📜 review.routes.js
 ┃ ┃ ┃ ┗ 📜 review.service.js
 ┃ ┃ ┗ 📂 penalties       # Eksekutor Penalty 3-Strikes (User & Mitra) & Blocking NIK
 ┃ ┣ 📂 infrastructure    # Komunikasi External IO & Database Core
 ┃ ┃ ┣ 📂 database        # Konektivitas Pool Postgres (db.js) & Skema init.sql
 ┃ ┃ ┗ 📂 websocket       # chatModerator.js (Bot AI Regex)
 ┃ ┣ 📜 app.js            # Node API Middleware Router Registry
 ┃ ┗ 📜 server.js         # Titik Endpoint Start Server & Socket.io Binding
```

---

### 3. Logika Fungsi Kunci (Core Implementation)

#### A. Algoritma Pencarian Mitra Berbasis Geofencing Radius Dinamis
Fungsi `findAvailableMitras` di dalam `mitra.service.js` akan secara mandiri di-looping saat mencari tukang:
1. Ia menggunakan kueri basis PostGIS *ST_DWithin* untuk Radius dasar `5KM` (5000 Meter).
2. Jika database tidak menemukan Mitra Tukang `AVAILABLE` di dalam lingkaran radius tersebut, Kode di *service* otomatis melakukan extend pencarian dengan `Radius + 5000` (10KM) dan berjalan ulang.
3. Maksimal iterasi radius adalah 3 kali (15KM MAX). Jika ditemukan pada perulangan ke-2 atau ke-3, algoritma mencantumkan Flag `is_out_of_range = true` dan nilai `out_of_range_fee = 15000` Rupiah ke *response body API*.

#### B. Sistem Jasa Digital Multitasking Slots
Jika `service_category` bernilai `DIGITAL`, kode di atas membypass Query GPS. Pengalihan batasannya jatuh kepada jumlah Slot. Cek klausa `WHERE m.active_working_slots < m.max_concurrent_slots`. User Programmer/Drafter bisa diset untuk menangani **4 Job Berbarengan** jika diperlukan.

#### C. Logika Priority Ads Recovery vs Newbie (Sorting Kueri)
Sorting hasil pencarian (`ORDER BY`) telah dipastikan di dalam `mitra.service.js` berdasarkan:
```sql
ORDER BY 
    CASE WHEN pa.ad_rank = 'RANK_1_NEWBIE' THEN 1      
         WHEN pa.ad_rank = 'RANK_2_RECOVERY' THEN 2    
         ELSE 3 END ASC,                               
    pa.visibility_score DESC,                         
    m.rating_avg DESC                                  
LIMIT 20
```
Jika tukang AC memiliki Rating 2.9 (Hancur), dia bebas membeli lagi Iklan pemulihan (*Rank_2_Recovery*) seharga 175rb melalui App/Web Admin, asalkan masih ada slot. Selama dia punya Priority Ads Aktif, ia akan terus menduduki ranking di bawah tukang baru namun jauh di atas algoritma organik.

#### D. Sistem Pembayaran & Tips Escrow
`total_paid_by_user` terdiri dari: `original_service_price` + `admin_fee` + `out_of_range_fee` (jika ada) + `tips_amount`.  
Namun, Backend memastikan bahwa potongan persen 20/25% (Management Cut) HANYA dikenakan pada angka di dalam kolom `original_service_price`. Tips Murni 100% dialirkan kepada parameter hitungan `net_earned_by_mitra`.

---

### 4. V4 Revisions (Onboarding & Iklan)

#### A. Biaya Pendaftaran Rp 50.000 & Komisi Sales (Referral)
Mitra baru tidak lagi dipaksa membeli Iklan Rp 200.000 di awal. Biaya pendaftaran (Base Fee) ditekan menjadi **Rp 50.000**, di mana **Rp 35.000** adalah Harga Pokok Penjualan (HPP) untuk pembuatan Pin Merchandise. 

Sisa bersih **Rp 15.000** dibagi secara otomatis oleh Backend di `registration.service.js` saat route `POST /api/mitra/registration-payment` dipanggil:
- Jika Mendaftar dengan kode Referral Sales Internal: Sales mendapatkan **10% Komisi** (Rp 1.500) yang tercatat di tabel `sales_commissions`. Sisanya **90%** (Rp 13.500) menjadi Revenue Kas OTT / Perusahaan.

#### B. Sistem Tier Iklan (Add-ons)
Iklan tidak lagi wajib di awal, melainkan Opsional:
1. **RANK_1_NEWBIE (Rp 200.000)**: Kuota 15 Pelanggan, tampil paling atas.
2. **RANK_2_RECOVERY (Rp 175.000)**: Khusus Mitra dengan rating di bawah 3.0 untuk memulihkan skor. Tampil di bawah iklan Newbie.
3. **PREMIUM PRO (Rp 3.000.000)**: Endpoint `POST /api/mitra/premium-ads`. Dikunci secara eksklusif untuk Badge **BIRU** & **MERAH**. Backend akan memvalidasi *maksimal 3 Mitra Premium PRO* per kota (`city`) yang memiliki status keaktifan dalam batas rentang waktu **1.5 Bulan**.
