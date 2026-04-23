const db = require('../../infrastructure/database/db');

class ReviewService {
    async submitReview({ bookingId, reviewerRole, reviewerId, rating, comment }) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // 1. Validate Booking
            const bookingRes = await client.query('SELECT user_id, mitra_id, status FROM bookings WHERE id = $1', [bookingId]);
            if (bookingRes.rowCount === 0) throw new Error('Booking not found');
            const booking = bookingRes.rows[0];

            if (booking.status !== 'COMPLETED') throw new Error('Can only review completed bookings');

            // 2. Determine Targets and Validate Ownership
            let targetUserId = null;
            let targetMitraId = null;
            let reviewerUserId = null;
            let reviewerMitraId = null;

            if (reviewerRole === 'USER') {
                if (booking.user_id !== reviewerId) throw new Error('You are not the user of this booking');
                reviewerUserId = reviewerId;
                targetMitraId = booking.mitra_id;
            } else if (reviewerRole === 'MITRA') {
                if (booking.mitra_id !== reviewerId) throw new Error('You are not the mitra of this booking');
                reviewerMitraId = reviewerId;
                targetUserId = booking.user_id;
            } else {
                throw new Error('Invalid role');
            }

            // 3. Insert Review (UNIQUE constraint will prevent double reviews)
            await client.query(`
                INSERT INTO reviews (
                    booking_id, reviewer_role, reviewer_user_id, reviewer_mitra_id, 
                    target_user_id, target_mitra_id, rating, comment
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [bookingId, reviewerRole, reviewerUserId, reviewerMitraId, targetUserId, targetMitraId, rating, comment]);

            // 4. Recalculate Average Rating & Update Tier (If reviewing Mitra)
            if (reviewerRole === 'USER') {
                await this.updateMitraRatingAndTier(client, targetMitraId);
            } else if (reviewerRole === 'MITRA') {
                await this.updateUserRating(client, targetUserId);
            }

            await client.query('COMMIT');
            return { success: true, message: 'Review submitted successfully' };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async updateMitraRatingAndTier(client, mitraId) {
        // Calculate averge rating from all reviews received by this mitra
        const ratingRes = await client.query(`
            SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
            FROM reviews 
            WHERE target_mitra_id = $1
        `, [mitraId]);

        let avgRating = parseFloat(ratingRes.rows[0].avg_rating) || 0;
        let totalServed = parseInt(ratingRes.rows[0].total_reviews) || 0;
        avgRating = Math.round(avgRating * 100) / 100; // Round to 2 decimals

        // Dynamic Tier Promotion Logic based on Total Served & Rating
        let badgeTier = 'GREEN'; // Default 0-99
        if (totalServed >= 500 && avgRating > 4.5) {
            badgeTier = 'RED'; // >500 Users & >4.5 Rating
        } else if (totalServed >= 100 && avgRating > 4.0) {
            badgeTier = 'BLUE'; // 100-499 Users & >4.0 Rating
        }

        await client.query(`
            UPDATE mitras 
            SET rating_avg = $1, total_users_served = $2, badge_tier = $3 
            WHERE id = $4
        `, [avgRating, totalServed, badgeTier, mitraId]);
    }

    async updateUserRating(client, userId) {
        const ratingRes = await client.query(`
            SELECT AVG(rating) as avg_rating
            FROM reviews 
            WHERE target_user_id = $1
        `, [userId]);

        let avgRating = parseFloat(ratingRes.rows[0].avg_rating) || 0;
        avgRating = Math.round(avgRating * 100) / 100;

        await client.query(`
            UPDATE users 
            SET rating_avg = $1 
            WHERE id = $2
        `, [avgRating, userId]);
    }
}

module.exports = new ReviewService();
