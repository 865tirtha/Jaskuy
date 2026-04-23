-- ==============================================================================
-- DATABASE SCHEMA: JASKUY (HIGH-END GIG ECONOMY)
-- FITUR: POSTGIS DYNAMIC GEOFENCING, ESCROW, RECOVERY ADS & 3-STRIKES PENALTY
-- ==============================================================================

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

-- --------------------------------------------------------
-- 2. TABEL BLACKLIST (NIK)
-- --------------------------------------------------------
CREATE TABLE blacklisted_niks (
    nik VARCHAR(20) PRIMARY KEY,
    reason TEXT NOT NULL,
    banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 3. TABEL USER (Konsumen)
-- --------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Strike Penalty & Rating (2-Way Keadilan)
    strike_count INT DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    status account_status DEFAULT 'ACTIVE',
    suspended_until TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 4. TABEL MITRA (Penyedia Jasa)
-- --------------------------------------------------------
CREATE TABLE mitras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nik VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    dob DATE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Status & Lokasi (GPS)
    is_kyc_verified BOOLEAN DEFAULT FALSE,
    work_status mitra_work_status DEFAULT 'OFFLINE',
    current_location GEOGRAPHY(POINT, 4326),
    
    -- Kapasitas Multitasking (Fisik = max 1, Digital = max N)
    max_concurrent_slots INT DEFAULT 1,
    active_working_slots INT DEFAULT 0,
    
    -- Tier & Performa
    total_users_served INT DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    badge_tier tier_badge DEFAULT 'GREEN',
    wallet_balance DECIMAL(15,2) DEFAULT 0.00,
    
    -- 3-Strike Penalty System
    strike_count INT DEFAULT 0,
    status account_status DEFAULT 'ACTIVE',
    suspended_until TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 5. TABEL IKLAN PRIORITAS (DUAL-SYSTEM ONBOARDING & RECOVERY)
-- --------------------------------------------------------
CREATE TABLE mitra_priority_ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mitra_id UUID REFERENCES mitras(id) ON DELETE CASCADE,
    ad_rank ad_tier_rank NOT NULL, -- RANK_1_NEWBIE (Rp 200k) atau RANK_2_RECOVERY (Rp 175k)
    amount_paid DECIMAL(15,2) NOT NULL, 
    initial_quota INT DEFAULT 15,
    quota_remaining INT DEFAULT 15,
    visibility_score DECIMAL(5,2) DEFAULT 100.00, -- (quota_remaining / initial_quota) * 100
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 6. TABEL KATALOG JASA & HARGA MITRA
-- --------------------------------------------------------
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category service_category NOT NULL, -- PHYSICAL (GPS, 1 Slot) vs DIGITAL (Nasional, N Slot)
    avg_market_price DECIMAL(15,2) DEFAULT 0.00
);

CREATE TABLE mitra_services (
    mitra_id UUID REFERENCES mitras(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    base_price DECIMAL(15,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (mitra_id, service_id)
);

-- --------------------------------------------------------
-- 7. TABEL BOOKING (TRANSAKSI, GEOFENCING FLAG, ESCROW & TIPS)
-- --------------------------------------------------------
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    mitra_id UUID REFERENCES mitras(id),
    service_id UUID REFERENCES services(id),
    status booking_status DEFAULT 'SEARCHING',
    
    -- Tracking Lokasi & Ad Quota
    user_booking_location GEOGRAPHY(POINT, 4326),
    distance_km DECIMAL(6,2), 
    is_out_of_range BOOLEAN DEFAULT FALSE, -- TRUE jika jarak > 5 KM (5-15KM)
    out_of_range_fee DECIMAL(10,2) DEFAULT 0.00,
    priority_ad_consumed_id UUID REFERENCES mitra_priority_ads(id), 
    
    -- Ledger Dasar
    original_service_price DECIMAL(15,2) NOT NULL, -- Hanya ini yang kena potongan 20%
    admin_fee DECIMAL(10,2) DEFAULT 1500.00,       -- Flat admin fee
    
    -- Dynamic Management Cut (25% Digital N Rating < 5, 20% Fisik Default)
    management_cut_percent INT NOT NULL,             
    management_cut_amount DECIMAL(15,2) NOT NULL,    
    insurance_fee_amount DECIMAL(15,2) NOT NULL,     
    cashback_bonus_amount DECIMAL(15,2) DEFAULT 0,   
    
    -- FITUR T1PS (100% Untuk Mitra, dipisahkan dari potangan 20%)
    tips_amount DECIMAL(15,2) DEFAULT 0.00,
    
    -- Totals
    total_paid_by_user DECIMAL(15,2) NOT NULL,       -- original_price + out_of_range_fee + admin_fee + tips_amount
    net_earned_by_mitra DECIMAL(15,2) NOT NULL,      -- original_price - management_cut_amount + cashback_bonus_amount + out_of_range_fee + tips_amount
    
    -- Escrow Tracking
    started_at TIMESTAMP,
    mitra_finished_at TIMESTAMP, -- Mitra klik selesai, menunggu user / 24 jam
    completed_at TIMESTAMP,      -- Duit cair ke Mitra
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 8. TABEL REVIEWS (Keadilan Dua Arah)
-- --------------------------------------------------------
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

-- --------------------------------------------------------
-- 9. TABEL MODERASI CHAT (WebSocket AI & Regex Catcher)
-- --------------------------------------------------------
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

-- --------------------------------------------------------
-- 10. TABEL PENALTI 3-STRIKES (Audit Trail Keadilan)
-- --------------------------------------------------------
CREATE TABLE penalty_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offender_role user_role NOT NULL, 
    offender_id UUID NOT NULL,
    triggered_by UUID, -- NULL = System/Bot AI Regex
    strike_number INT NOT NULL, 
    action_taken VARCHAR(100) NOT NULL, 
    reason TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
