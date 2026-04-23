const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

class AuthController {

    // ==========================================
    // REGISTER USER
    // ==========================================
    async registerUser(req, res, next) {
        try {
            const { name, phone, email, password } = req.body;

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const result = await db.query(`
                INSERT INTO users (name, phone, email, password_hash)
                VALUES ($1, $2, $3, $4)
                RETURNING id, name, email
            `, [name, phone, email, passwordHash]);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result.rows[0]
            });
        } catch (error) {
            if (error.code === '23505') { // Unique violation Postgres
                return res.status(400).json({ success: false, message: 'Email or phone already exists' });
            }
            next(error);
        }
    }

    // ==========================================
    // LOGIN USER
    // ==========================================
    async loginUser(req, res, next) {
        try {
            const { email, password } = req.body;

            const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rowCount === 0) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, role: 'USER' }, process.env.JWT_SECRET, { expiresIn: '30d' });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: { id: user.id, name: user.name, status: user.status }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // ==========================================
    // REGISTER MITRA (is_kyc_verified = FALSE default)
    // ==========================================
    async registerMitra(req, res, next) {
        try {
            const { nik, name, dob, phone, email, password, referred_by_sales_code } = req.body;

            // 1. Cek NIK di tabel blacklisted_niks
            const blacklistRes = await db.query('SELECT reason FROM blacklisted_niks WHERE nik = $1', [nik]);
            if (blacklistRes.rowCount > 0) {
                return res.status(403).json({
                    success: false,
                    message: `NIK is blacklisted. Reason: ${blacklistRes.rows[0].reason}`
                });
            }

            // 2. Cek Referral Code (Opsional)
            let salesId = null;
            if (referred_by_sales_code) {
                const salesRes = await db.query('SELECT id FROM sales_agents WHERE referral_code = $1', [referred_by_sales_code]);
                if (salesRes.rowCount === 0) {
                    return res.status(400).json({ success: false, message: 'Invalid sales referral code' });
                }
                salesId = salesRes.rows[0].id;
            }

            // 3. Hash Password & Insert
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // Perhatikan kolom: merch_status (jika ada, defaultnya 'NONE'), registration_paid (default false) di schema V4
            // Cek status schema dan insert
            const result = await db.query(`
                INSERT INTO mitras (nik, name, dob, phone, email, password_hash, referred_by_sales_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, name, email, registration_paid
            `, [nik, name, dob, phone, email, passwordHash, salesId]);

            const newMitraId = result.rows[0].id;

            // Jika mendaftar lewat Sales, auto-generate hak komisi Sales & Revenue Perusahaan
            if (salesId) {
                const netRevenue = 15000;
                const salesCommission = 1500;
                const companyRevenue = 13500;

                await db.query(`
                  INSERT INTO sales_commissions (
                      sales_id, mitra_id, base_fee_net, commission_amount, company_revenue, status
                  ) VALUES ($1, $2, $3, $4, $5, 'PENDING')
                `, [salesId, newMitraId, netRevenue, salesCommission, companyRevenue]);

                await db.query(`
                  UPDATE sales_agents 
                  SET total_earnings = total_earnings + $1 
                  WHERE id = $2
                `, [salesCommission, salesId]);
            }

            res.status(201).json({
                success: true,
                message: 'Mitra registered successfully. Please proceed to pay the Rp 50.000 registration fee.',
                data: result.rows[0]
            });

        } catch (error) {
            if (error.code === '23505') {
                return res.status(400).json({ success: false, message: 'NIK, Email or phone already exists' });
            }
            next(error);
        }
    }

    // ==========================================
    // LOGIN MITRA
    // ==========================================
    async loginMitra(req, res, next) {
        try {
            const { email, password } = req.body;

            const result = await db.query('SELECT * FROM mitras WHERE email = $1', [email]);
            if (result.rowCount === 0) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const mitra = result.rows[0];
            const isMatch = await bcrypt.compare(password, mitra.password_hash);

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: mitra.id, role: 'MITRA' }, process.env.JWT_SECRET, { expiresIn: '30d' });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    mitra: {
                        id: mitra.id,
                        name: mitra.name,
                        status: mitra.status,
                        is_kyc_verified: mitra.is_kyc_verified,
                        registration_paid: mitra.registration_paid
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // ==========================================
    // REGISTER SALES APP
    // ==========================================
    async registerSales(req, res, next) {
        try {
            const { name, email, password } = req.body;

            // Input Validation
            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Kolom Nama, Email, dan Password wajib diisi!"
                });
            }

            // Generate referral code based on name (mock)
            const referralCode = name.replace(/\s+/g, '').toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const result = await db.query(`
                INSERT INTO sales_agents (name, email, password_hash, referral_code)
                VALUES ($1, $2, $3, $4)
                RETURNING id, name, email, referral_code
            `, [name, email, passwordHash, referralCode]);

            res.status(201).json({
                success: true,
                message: 'Sales registered successfully',
                data: result.rows[0]
            });
        } catch (error) {
            console.error("ERROR REGISTRASI:", error);

            if (error.code === '23505') {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }

            // Safe Response 500
            res.status(500).json({
                success: false,
                message: "Terjadi kesalahan di server",
                error: error.message
            });
        }
    }

    // ==========================================
    // LOGIN SALES APP
    // ==========================================
    async loginSales(req, res, next) {
        try {
            const { email_or_name, password } = req.body;

            const result = await db.query('SELECT * FROM sales_agents WHERE email = $1 OR name = $1', [email_or_name]);
            if (result.rowCount === 0) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const sales = result.rows[0];
            const isMatch = await bcrypt.compare(password, sales.password_hash);

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: sales.id, role: 'SALES' }, process.env.JWT_SECRET, { expiresIn: '30d' });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    sales: { id: sales.id, name: sales.name, email: sales.email, referral_code: sales.referral_code }
                }
            });
        } catch (error) {
            console.error("ERROR LOGIN:", error);
            res.status(500).json({
                success: false,
                message: "Terjadi kesalahan di server saat verifikasi login",
                error: error.message
            });
        }
    }
}

module.exports = new AuthController();
