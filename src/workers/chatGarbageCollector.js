const db = require('../config/db');

class ChatGarbageCollector {
    /**
     * Berjalan secara berkala (misal: setiap jam)
     * Menghapus semua riwayat pesan di tabel chat_messages yang terkait dengan 
     * booking yang sudah COMPLETED lebih dari 24 jam yang lalu.
     */
    async cleanUpOldChats() {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // 1. Cari booking_id yang sudah COMPLETED > 24 jam
            // Kita kumpulkan ID booking-nya saja terlebih dahulu atau gabung dalam operasi DELETE langsung
            // Operasi hapus akan men-cascade/menghapus pesan chat terkait (Asumsi: foreign key setup mendukung, 
            // atau kita hapus eksplisit)

            // HAPUS SECARA EKSPLISIT berdasarkan join tabel
            const deleteRes = await client.query(`
                DELETE FROM chat_messages 
                WHERE booking_id IN (
                    SELECT id FROM bookings 
                    WHERE status = 'COMPLETED' 
                    AND completed_at <= NOW() - INTERVAL '24 HOURS'
                )
                RETURNING id
            `);

            await client.query('COMMIT');

            if (deleteRes.rowCount > 0) {
                console.log(`[Chat Garbage Collector] Successfully deleted ${deleteRes.rowCount} old chat messages from expired bookings.`);
            }

            return { deletedCount: deleteRes.rowCount };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('[Chat Garbage Collector] Error during chat cleanup:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new ChatGarbageCollector();
