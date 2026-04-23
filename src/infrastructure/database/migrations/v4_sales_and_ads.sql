-- ==============================================================================
-- DATABASE MIGRATION: V4 REVISIONS (SALES COMMISSION & PREMIUM ADS)
-- ==============================================================================

-- 1. TABEL SALES AGENT (Tim Internal Perusahaan)
CREATE TABLE sales_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    bank_account VARCHAR(100),
    total_earnings DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ALTER TABEL MITRAS
-- Menambahkan relasi Referral Sales, Kolom Kota (untuk kuota Premium), dan Status Pembayaran Registrasi
ALTER TABLE mitras 
ADD COLUMN referred_by_sales_id UUID REFERENCES sales_agents(id) ON DELETE SET NULL,
ADD COLUMN city VARCHAR(100),
ADD COLUMN registration_paid BOOLEAN DEFAULT FALSE;

-- 3. TABEL KOMISI SALES
CREATE TABLE sales_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_id UUID REFERENCES sales_agents(id) ON DELETE CASCADE,
    mitra_id UUID REFERENCES mitras(id) ON DELETE CASCADE,
    base_fee_net DECIMAL(15,2) NOT NULL, -- Rp 15.000 (Sisa dari Rp 50.000 - Rp 35.000 HPP)
    commission_amount DECIMAL(10,2) NOT NULL, -- 10% dari base_fee_net (Rp 1.500)
    company_revenue DECIMAL(10,2) NOT NULL, -- 90% dari base_fee_net (Rp 13.500)
    status VARCHAR(50) DEFAULT 'PENDING', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL IKLAN PREMIUM PRO (Maks 3 per Kota, Berlaku 1.5 Bulan)
CREATE TABLE premium_pro_ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mitra_id UUID REFERENCES mitras(id) ON DELETE CASCADE,
    city VARCHAR(100) NOT NULL,
    amount_paid DECIMAL(15,2) DEFAULT 3000000.00,
    active_until TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
