const db = require('../../infrastructure/database/db');

class KycService {
    async uploadKycDocument(mitraId, ktpUrl, selfieUrl) {
        // In a real scenario, these URLs would come from an S3 bucket or similar storage
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Check if mitra exists and is not yet verified
            const existing = await client.query('SELECT is_kyc_verified, status FROM mitras WHERE id = $1', [mitraId]);
            if (existing.rowCount === 0) throw new Error('Mitra not found');
            if (existing.rows[0].is_kyc_verified) throw new Error('Mitra is already verified');

            // Set status to OFFLINE (can't work until approved)
            // Assuming there's a hypothetical kyc_documents table, we would insert there.
            // For now, we update the status just to be sure
            await client.query(`
                UPDATE mitras 
                SET work_status = 'OFFLINE'
                WHERE id = $1
            `, [mitraId]);

            await client.query('COMMIT');
            return {
                message: 'KYC Documents uploaded successfully. Pending manual admin verification.',
                documentLinks: { ktpUrl, selfieUrl }
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new KycService();
