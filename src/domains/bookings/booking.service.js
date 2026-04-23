const db = require('../../config/db');

class BookingService {

    /**
     * REQUEST BOOKING AWAL (Oleh USER)
     * Mengunci slot Mitra, mencatat origin price & ongkos luar radius
     */
    async createBooking({ userId, mitraId, serviceId, userLon, userLat, originalServicePrice }) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // 1. Validasi Status Mitra (Bebas dari Hukuman & Aktif & Sudah Bayar Rp 50k & KYC)
            const mitraRes = await client.query(`
                SELECT work_status, status, is_kyc_verified, registration_paid,
                       active_working_slots, max_concurrent_slots, badge_tier
                FROM mitras 
                WHERE id = $1
            `, [mitraId]);

            if (mitraRes.rowCount === 0) throw new Error('Mitra not found');
            const mitra = mitraRes.rows[0];

            if (mitra.status !== 'ACTIVE') throw new Error('Mitra is currently restricted');
            if (!mitra.is_kyc_verified) throw new Error('Mitra has not passed KYC System');
            if (!mitra.registration_paid) throw new Error('Mitra has not paid the registration fee');

            // 2. Validasi Jasa & Pricing Rules (Rp 50rb minimum untuk Hijau)
            const serviceRes = await client.query('SELECT category, avg_market_price FROM services WHERE id = $1', [serviceId]);
            if (serviceRes.rowCount === 0) throw new Error('Service not found');

            const category = serviceRes.rows[0].category;
            const avgMarketPrice = parseFloat(serviceRes.rows[0].avg_market_price);

            if (mitra.badge_tier === 'GREEN' && originalServicePrice < 50000) {
                throw new Error('Minimal harga untuk Mitra Pemula (Hijau) adalah Rp 50.000');
            } else if (mitra.badge_tier === 'BLUE') {
                const maxAllowedPrice = avgMarketPrice * 1.75;
                if (originalServicePrice < avgMarketPrice || originalServicePrice > maxAllowedPrice) {
                    throw new Error(`Harga Mitra (Biru) harus di antara Rp ${avgMarketPrice} hingga maksimal Rp ${maxAllowedPrice}`);
                }
            } else if (mitra.badge_tier === 'RED') {
                const maxAllowedPrice = avgMarketPrice * 2.0;
                if (originalServicePrice < avgMarketPrice || originalServicePrice > maxAllowedPrice) {
                    throw new Error(`Harga Mitra (Merah) harus di antara Rp ${avgMarketPrice} hingga maksimal Rp ${maxAllowedPrice}`);
                }
            }

            // 3. Pengecekan Ketersediaan Kapasitas Slot & Iklan
            let priorityAdConsumedId = null;

            if (category === 'PHYSICAL') {
                if (mitra.work_status !== 'AVAILABLE') throw new Error('Mitra Jasa Fisik sedang penuh (Booking limit tercapai)');

                // Cek Iklan berjalan mana yang sedang aktif untuk dikurangi kuotanya di fase Complete
                const adRes = await client.query(`
                    SELECT id FROM mitra_priority_ads 
                    WHERE mitra_id = $1 AND is_active = TRUE
                    ORDER BY 
                      CASE WHEN ad_rank = 'RANK_1_NEWBIE' THEN 1 ELSE 2 END ASC
                    LIMIT 1
                `, [mitraId]);

                if (adRes.rowCount > 0) priorityAdConsumedId = adRes.rows[0].id;

            } else {
                // Jasa DIGITAL Multitasking
                if (mitra.active_working_slots >= mitra.max_concurrent_slots) {
                    throw new Error('Mitra Jasa Digital telah mencapai kapasitas maksimum kerja berbarengan');
                }
            }

            // 4. Kalkulasi Jarak Geofencing (Jika ada) -> Catat ongkos *out_of_range*
            let locationQuery = 'NULL';
            let isOutOfRange = false;
            let outOfRangeFee = 0;

            if (userLon && userLat) {
                locationQuery = `ST_SetSRID(ST_MakePoint(${userLon}, ${userLat}), 4326)`;

                // Cari jarak riil
                const distRes = await client.query(`
                    SELECT ST_Distance(current_location, ST_SetSRID(ST_MakePoint($1, $2), 4326)) as dist_meters
                    FROM mitras WHERE id = $3
                `, [userLon, userLat, mitraId]);

                if (distRes.rowCount > 0 && distRes.rows[0].dist_meters > 5000) {
                    isOutOfRange = true;
                    outOfRangeFee = 15000;
                }
            }

            // 5. Insert Sistem Escrow & Booking
            const insertRes = await client.query(`
              INSERT INTO bookings (
                  user_id, mitra_id, service_id, status, user_booking_location, 
                  is_out_of_range, out_of_range_fee, priority_ad_consumed_id, 
                  original_service_price, management_cut_percent, management_cut_amount, 
                  insurance_fee_amount, total_paid_by_user, net_earned_by_mitra, started_at
              ) VALUES (
                  $1, $2, $3, 'MATCHED', ${locationQuery !== 'NULL' ? locationQuery : 'NULL'}, 
                  $4, $5, $6, $7, 0, 0, 0, 0, 0, CURRENT_TIMESTAMP
              ) RETURNING id
            `, [userId, mitraId, serviceId, isOutOfRange, outOfRangeFee, priorityAdConsumedId, originalServicePrice]);

            // 6. Update Tracker Mitra (Kunci Slot Kerja)
            if (category === 'PHYSICAL') {
                await client.query(`UPDATE mitras SET work_status = 'WORKING' WHERE id = $1`, [mitraId]);
            } else {
                await client.query(`UPDATE mitras SET active_working_slots = active_working_slots + 1 WHERE id = $1`, [mitraId]);
            }

            await client.query('COMMIT');
            return { bookingId: insertRes.rows[0].id, status: 'MATCHED' };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } // <-- MISSING BRACE ADDED HERE

    /**
     * SELESAIKAN BOOKING (Oleh MITRA) -> Uang Masuk Escrow (AWAITING_CONFIRMATION)
     * Mengkalkulasi 20/25% fee, Cashback, Tip, dan memotong kuota Iklan Fisik
     */
    async completeBooking(bookingId, tipsAmount = 0) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            const bookingRes = await client.query(`
                SELECT b.*, s.category, m.rating_avg, m.badge_tier, m.id as mitra_id
                FROM bookings b
                JOIN services s ON b.service_id = s.id
                JOIN mitras m ON b.mitra_id = m.id
                WHERE b.id = $1 AND b.status = 'WORKING'
            `, [bookingId]);

            if (bookingRes.rowCount === 0) throw new Error('Invalid booking state or ID');
            const booking = bookingRes.rows[0];

            let managementCutPercent = 20;

            // DIGITAL -> potongan 25% jika rating < 5
            if (booking.category === 'DIGITAL') {
                if (parseFloat(booking.rating_avg) < 5.0) managementCutPercent = 25;
            }

            const originalPrice = parseFloat(booking.original_service_price);
            const outOfRangeFee = parseFloat(booking.out_of_range_fee) || 0;
            const receivedTips = parseFloat(tipsAmount) || 0;

            // Perhatian: Hanya Original Price yang dipotong persen manajemen
            let managementCutAmount = originalPrice * (managementCutPercent / 100);
            let cashbackBonusAmount = 0;

            // Cashback 5% untuk RED tier
            if (booking.badge_tier === 'RED') {
                cashbackBonusAmount = originalPrice * (5 / 100);
            }

            const adminFee = 1500;
            const totalPaidByUser = originalPrice + outOfRangeFee + adminFee + receivedTips;
            // Formula: original - (management cut) + outOfRangeFee + cashback + 100% Tips
            const netEarnedByMitra = (originalPrice - managementCutAmount) + outOfRangeFee + cashbackBonusAmount + receivedTips;
            const insuranceFeeAmount = managementCutAmount * 0.10;

            // Update Booking -> Masuk Escrow (AWAITING_CONFIRMATION)
            await client.query(`
                UPDATE bookings SET 
                  status = 'AWAITING_CONFIRMATION',
                  mitra_finished_at = CURRENT_TIMESTAMP,
                  management_cut_percent = $1,
                  management_cut_amount = $2,
                  insurance_fee_amount = $3,
                  cashback_bonus_amount = $4,
                  tips_amount = $5,
                  total_paid_by_user = $6,
                  net_earned_by_mitra = $7
                WHERE id = $8
            `, [
                managementCutPercent, managementCutAmount, insuranceFeeAmount,
                cashbackBonusAmount, receivedTips, totalPaidByUser, netEarnedByMitra, bookingId
            ]);

            // Release Slot Kerja Mitra
            if (booking.category === 'PHYSICAL') {
                await client.query(`UPDATE mitras SET work_status = 'AVAILABLE' WHERE id = $1`, [booking.mitra_id]);

                // Potong kuota Iklan jika ada
                if (booking.priority_ad_consumed_id) {
                    await client.query(`
                        UPDATE mitra_priority_ads 
                        SET quota_remaining = quota_remaining - 1,
                            visibility_score = ((quota_remaining - 1)::float / initial_quota) * 100,
                            is_active = CASE WHEN (quota_remaining - 1) <= 0 THEN FALSE ELSE TRUE END
                        WHERE id = $1
                    `, [booking.priority_ad_consumed_id]);
                }
            } else {
                await client.query(`UPDATE mitras SET active_working_slots = active_working_slots - 1 WHERE id = $1`, [booking.mitra_id]);
            }

            await client.query('COMMIT');
            return { success: true, message: 'Booking completed by Mitra. Escrow is awaiting User confirmation.', bookingId };
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }
}

module.exports = new BookingService();
