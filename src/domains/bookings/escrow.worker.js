const db = require('../../config/db');

class EscrowWorker {
    /**
     * Berjalan setiap Jam/Menit via Node-Cron
     * Mencari booking dengan status AWAITING_CONFIRMATION yang sudah lewat dari 24 jam
     */
    async autoReleaseEscrowFunds() {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Cari semua booking yang selesai oleh mitra > 24 jam lalu
            const expiredBookingsRes = await client.query(`
                SELECT id, mitra_id, net_earned_by_mitra 
                FROM bookings 
                WHERE status = 'AWAITING_CONFIRMATION' 
                  AND mitra_finished_at <= NOW() - INTERVAL '24 HOURS'
            `);

            if (expiredBookingsRes.rowCount === 0) {
                await client.query('COMMIT');
                return { processedCount: 0 };
            }

            for (const booking of expiredBookingsRes.rows) {
                // 1. Cairkan Dana ke Mitra Wallet
                await client.query(`
                    UPDATE mitras 
                    SET wallet_balance = wallet_balance + $1 
                    WHERE id = $2
                `, [booking.net_earned_by_mitra, booking.mitra_id]);

                // 2. Tandai Booking sebagai COMPLETED secara sepihak oleh sistem
                await client.query(`
                    UPDATE bookings 
                    SET status = 'COMPLETED', completed_at = CURRENT_TIMESTAMP 
                    WHERE id = $1
                `, [booking.id]);
            }

            await client.query('COMMIT');
            console.log(`[Escrow Worker] Successfully auto-released funds for ${expiredBookingsRes.rowCount} bookings.`);

            return { processedCount: expiredBookingsRes.rowCount };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('[Escrow Worker] Error during auto release:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new EscrowWorker();
