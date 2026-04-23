const db = require('../../config/db');

class PenaltyService {

    /**
     * Mengeksekusi sanksi Strike 1, 2, atau 3 kepada Pelanggar
     * Dipanggil otomatis oleh Bot AI Regex WebSocket
     */
    async executeStrikePenalty(offenderRole, offenderId, violationKeyword, chatId) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            let tableName = offenderRole === 'USER' ? 'users' : 'mitras';

            // 1. Dapatkan Strike Count saat ini
            const userRes = await client.query(`SELECT strike_count, nik FROM ${tableName} WHERE id = $1`, [offenderId]);
            if (userRes.rowCount === 0) throw new Error('Offender not found');

            let { strike_count, nik } = userRes.rows[0];
            let newStrikeCount = strike_count + 1;

            // 2. Tentukan Jenis Hukuman
            let actionTaken = '';
            let suspendedUntil = null;
            let newStatus = 'ACTIVE';

            if (newStrikeCount === 1) {
                actionTaken = 'DISABLED_2_DAYS';
                newStatus = 'DISABLED';
                // Suspended selama 48 jam
                suspendedUntil = new Date(Date.now() + 48 * 60 * 60 * 1000);
            } else if (newStrikeCount === 2) {
                actionTaken = 'FROZEN_1_WEEK';
                newStatus = 'FROZEN';
                // Suspended selama 7 Hari
                suspendedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            } else if (newStrikeCount >= 3) {
                actionTaken = 'BANNED_PERMANENT';
                newStatus = 'BANNED_PERM';
                suspendedUntil = null; // Permanen

                // HUKUMAN MATI: Masukkan NIK ke Blacklist (Jika Mitra)
                if (offenderRole === 'MITRA' && nik) {
                    await client.query(`
                        INSERT INTO blacklisted_niks (nik, reason) 
                        VALUES ($1, $2)
                        ON CONFLICT (nik) DO NOTHING
                    `, [nik, `Auto-Banned: 3-Strikes Violation Regex (Chat ID: ${chatId})`]);
                }
            }

            // 3. Update Akun Entitas
            let suspendedQuery = suspendedUntil ? `$3` : 'NULL';
            let queryParams = [newStatus, newStrikeCount, offenderId];
            if (suspendedUntil) queryParams.splice(2, 0, suspendedUntil); // Insert suspendedUntil sebelum id if not null

            await client.query(`
                UPDATE ${tableName} 
                SET status = $1, strike_count = $2, suspended_until = ${suspendedQuery}
                WHERE id = $${suspendedUntil ? '4' : '3'}
            `, queryParams);

            // 4. Log Jejak Audit Penalti
            await client.query(`
                INSERT INTO penalty_logs (offender_role, offender_id, strike_number, action_taken, reason, expires_at)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [
                offenderRole, offenderId, newStrikeCount, actionTaken,
                `Automated Regex Catcher Triggered by word: "${violationKeyword}"`,
                suspendedUntil
            ]);

            await client.query('COMMIT');

            return {
                strike_count: newStrikeCount,
                action_taken: actionTaken,
                status: newStatus
            };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new PenaltyService();
