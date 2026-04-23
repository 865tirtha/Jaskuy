const cron = require('node-cron');
const escrowWorker = require('./domains/bookings/escrow.worker');
const chatGarbageCollector = require('./workers/chatGarbageCollector');

/**
 * Setup Cron Jobs terpusat
 */
const initiateCronJobs = () => {
    // 1. Jalankan pengecekan Escrow setiap jam di menit 00 (0 * * * *)
    cron.schedule('0 * * * *', async () => {
        console.log('[Cron] Running Auto Release Escrow Worker...');
        try {
            await escrowWorker.autoReleaseEscrowFunds();
        } catch (error) {
            console.error('[Cron] Escrow Worker Failed:', error);
        }
    });

    // 2. Jalankan Auto-Delete Chat setiap jam di menit 30 (30 * * * *)
    cron.schedule('30 * * * *', async () => {
        console.log('[Cron] Running Chat Garbage Collector...');
        try {
            await chatGarbageCollector.cleanUpOldChats();
        } catch (error) {
            console.error('[Cron] Chat Garbage Collector Failed:', error);
        }
    });

    console.log('✅ Background CronJobs Registered (Escrow & Chat Garbage Collector).');
};

module.exports = initiateCronJobs;
