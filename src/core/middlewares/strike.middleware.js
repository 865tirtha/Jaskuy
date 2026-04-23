const db = require('../../config/db');

/**
 * Middleware untuk memblokir akses jika akun sedang terkena penalti (Strike 1, 2, atau 3)
 */
const strikeMiddleware = async (req, res, next) => {
    try {
        const { id, role } = req.user; // Didapat dari authMiddleware sebelumnya

        let queryText = '';
        if (role === 'USER') {
            queryText = 'SELECT status, suspended_until FROM users WHERE id = $1';
        } else if (role === 'MITRA') {
            queryText = 'SELECT status, suspended_until FROM mitras WHERE id = $1';
        } else {
            return res.status(403).json({ success: false, message: 'Invalid role' });
        }

        const result = await db.query(queryText, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        const { status, suspended_until } = result.rows[0];

        // Jika statusnya bukan ACTIVE (contoh: DISABLED, FROZEN, BANNED_PERM)
        if (status !== 'ACTIVE') {
            // Cek apakah masa suspensi sudah lewat 
            if (suspended_until && new Date() > new Date(suspended_until)) {
                // Auto-recovery jika masa hukuman selesai (Bisa dipindah ke CronJob, tapi ini *lazy-evaluation*)
                const updateQuery = role === 'USER'
                    ? 'UPDATE users SET status = $1, suspended_until = NULL WHERE id = $2'
                    : 'UPDATE mitras SET status = $1, suspended_until = NULL WHERE id = $2';

                await db.query(updateQuery, ['ACTIVE', id]);
                return next();
            }

            return res.status(403).json({
                success: false,
                message: `Account is restricted. Current status: ${status}`,
                suspended_until: suspended_until || 'Permanent'
            });
        }

        next();
    } catch (error) {
        console.error('[Strike Middleware] Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error during account validation' });
    }
};

module.exports = strikeMiddleware;
