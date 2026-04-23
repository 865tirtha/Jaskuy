const db = require('../../infrastructure/database/db');

exports.getDashboardStats = async (req, res) => {
    try {
        // Query 1: Total Escrow Tertahan
        const escrowData = await db.query("SELECT COALESCE(SUM(total_paid_by_user), 0) as total FROM bookings WHERE status IN ('WORKING', 'AWAITING_CONFIRMATION')");
        const escrowAmount = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(escrowData.rows[0].total || 0).replace('IDR', 'Rp');

        // Query 2: Jumlah Mitra Aktif (Status ACTIVE means they've received merch and are working)
        const mitrasData = await db.query("SELECT COUNT(*) FROM mitras WHERE status = 'ACTIVE'");
        const mitrasCount = mitrasData.rows[0].count;

        // Query 3: Jumlah User (Consumer) Aktif
        const usersData = await db.query("SELECT COUNT(*) FROM users WHERE status = 'ACTIVE'");
        const usersCount = usersData.rows[0].count;

        // Query 4: Total Revenue
        const revComm = await db.query("SELECT COALESCE(SUM(company_revenue), 0) as total FROM sales_commissions");
        const revManage = await db.query("SELECT COALESCE(SUM(management_cut_amount), 0) as total FROM bookings WHERE status = 'COMPLETED'");
        // Fallback calculation: mitras who have a sales agent but NO record in sales_commissions
        const missingCommissionsData = await db.query(`
            SELECT COUNT(m.id) as missing_count
            FROM mitras m
            LEFT JOIN sales_commissions sc ON m.id = sc.mitra_id
            WHERE m.referred_by_sales_id IS NOT NULL AND sc.id IS NULL
        `);
        const missingCount = parseInt(missingCommissionsData.rows[0].missing_count || 0);

        let totalRevenue = parseFloat(revComm.rows[0].total) + parseFloat(revManage.rows[0].total) + (missingCount * 13500);
        const revenueAmount = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalRevenue).replace('IDR', 'Rp');

        // Query 5: Total Sales Agents 
        const salesData = await db.query('SELECT COUNT(*) FROM sales_agents');
        const salesCount = salesData.rows[0].count;

        res.status(200).json({
            success: true,
            data: {
                revenue: revenueAmount,
                escrow: escrowAmount,
                total_mitras: mitrasCount,
                total_users: usersCount,
                total_sales: salesCount
            }
        });
    } catch (error) {
        console.error("ADMIN DASHBOARD ERROR:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil data statistik Dashboard" });
    }
};

exports.getKycApprovals = async (req, res) => {
    try {
        // Find MITRAs who have not been KYC verified
        const result = await db.query(`
            SELECT id, name, nik, phone, status 
            FROM mitras 
            WHERE is_kyc_verified = FALSE
            ORDER BY created_at ASC
        `);

        // Mock KTP/Selfie URLs for the dashboard since we didn't build an image upload system yet
        const mappedData = result.rows.map(m => ({
            ...m,
            ktpUrl: 'https://via.placeholder.com/150?text=KTP+Placeholder',
            selfieUrl: 'https://via.placeholder.com/150?text=Selfie+Placeholder'
        }));

        res.status(200).json({ success: true, data: mappedData });
    } catch (e) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getSalesPerformance = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                s.id, s.name, s.referral_code, 
                COUNT(m.id) as recruited,
                SUM(COALESCE(sc.commission_amount, 0)) + 
                (CAST(COUNT(m.id) AS INTEGER) - CAST(COUNT(sc.id) AS INTEGER)) * 1500 as commission
            FROM sales_agents s
            LEFT JOIN mitras m ON m.referred_by_sales_id = s.id
            LEFT JOIN sales_commissions sc ON sc.mitra_id = m.id AND sc.sales_id = s.id
            GROUP BY s.id, s.name, s.referral_code
        `);
        // We'll map status simply to ACTIVE for the demo
        const mapped = result.rows.map(r => ({
            id: r.referral_code,
            name: r.name,
            status: 'ACTIVE',
            recruited: parseInt(r.recruited),
            commission: parseFloat(r.commission)
        }));
        res.status(200).json({ success: true, data: mapped });
    } catch (e) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getMerchLogistics = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, name as mitra, phone, city as address, merch_status as status, created_at as date
            FROM mitras
            WHERE merch_status IN ('PENDING', 'SHIPPED')
            ORDER BY created_at DESC
        `);
        res.status(200).json({ success: true, data: result.rows });
    } catch (e) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getDisputesPenalties = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                p.id, p.offender_role as role, p.offender_id as "offenderId", 
                p.strike_number as strike, p.action_taken as action, p.created_at as date,
                r.violation_keyword as keyword
            FROM penalty_logs p
            LEFT JOIN regex_violations r ON r.id = p.triggered_by
            ORDER BY p.created_at DESC
        `);
        res.status(200).json({ success: true, data: result.rows });
    } catch (e) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ==========================================
// NEW ACTION ENDPOINTS
// ==========================================

exports.approveKyc = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE mitras SET is_kyc_verified = TRUE, merch_status = 'PENDING' WHERE id = $1", [id]);
        res.status(200).json({ success: true, message: 'KYC Approved, Merch Pending' });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.shipMerch = async (req, res) => {
    try {
        const { id } = req.params;
        // Setting status to ACTIVE makes them count towards Active Mitras on the Dashboard
        await db.query("UPDATE mitras SET merch_status = 'SHIPPED', status = 'ACTIVE' WHERE id = $1", [id]);
        res.status(200).json({ success: true, message: 'Merch Shipped, Mitra is now ACTIVE' });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getSalesStats = async (req, res) => {
    try {
        const { referral_code } = req.query;
        if (!referral_code) {
            return res.status(400).json({ success: false, message: "Missing referral_code" });
        }

        const result = await db.query(`
            SELECT COUNT(m.id) as recruited 
            FROM mitras m
            JOIN sales_agents s ON m.referred_by_sales_id = s.id
            WHERE s.referral_code = $1
        `, [referral_code]);

        res.status(200).json({ success: true, recruited: parseInt(result.rows[0].recruited) });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
