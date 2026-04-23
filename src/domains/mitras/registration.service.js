const db = require('../../config/db');

class RegistrationService {
    /**
     * Proses pembayaran registrasi awal Mitra sebesar Rp 50.000 (V4 Logic)
     * Memotong HPP Merch (Rp 35.000), mencatat 10% Komisi Sales, & 90% Kas Perusahaan
     */
    async processRegistrationPayment(mitraId) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // 1. Validasi Mitra
            const mitraRes = await client.query(`
              SELECT registration_paid, referred_by_sales_id 
              FROM mitras WHERE id = $1
          `, [mitraId]);

            if (mitraRes.rowCount === 0) throw new Error('Mitra not found');
            if (mitraRes.rows[0].registration_paid) throw new Error('Mitra has already paid the registration fee');

            const referredBySalesId = mitraRes.rows[0].referred_by_sales_id;

            // 2. Logic Pembagian Uang
            const totalPaid = 50000;
            const hppMerchandise = 35000;
            const netRevenue = totalPaid - hppMerchandise; // Rp 15.000

            let salesCommission = 0;
            let companyRevenue = netRevenue;

            // Jika mendaftar menggunakan kode referral sales
            if (referredBySalesId) {
                salesCommission = netRevenue * 0.10; // 10% = Rp 1.500
                companyRevenue = netRevenue - salesCommission; // 90% = Rp 13.500

                // Insert ke tabel komisi sales
                await client.query(`
                  INSERT INTO sales_commissions (
                      sales_id, mitra_id, base_fee_net, commission_amount, company_revenue, status
                  ) VALUES ($1, $2, $3, $4, $5, 'PENDING')
              `, [referredBySalesId, mitraId, netRevenue, salesCommission, companyRevenue]);

                // Update Total Earnings Sales Agent
                await client.query(`
                  UPDATE sales_agents 
                  SET total_earnings = total_earnings + $1 
                  WHERE id = $2
              `, [salesCommission, referredBySalesId]);
            }

            // 3. Update Status Mitra (Sudah bayar, dan set merch_status menjadi PENDING)
            // Asumsi tabel mitras sudah di-ALTER ADD COLUMN merch_status VARCHAR(50) DEFAULT 'NONE'.
            await client.query(`
              UPDATE mitras 
              SET registration_paid = TRUE, merch_status = 'PENDING'
              WHERE id = $1
          `, [mitraId]);

            await client.query('COMMIT');

            return {
                success: true,
                message: 'Registration fee processed successfully. Merchandise preparation is PENDING.',
                details: {
                    total_paid: totalPaid,
                    hpp_merchandise: hppMerchandise,
                    sales_commission_allocated: salesCommission,
                    company_net_revenue: companyRevenue
                }
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new RegistrationService();
