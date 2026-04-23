const bookingService = require('./booking.service');

class BookingController {

    // ==========================================
    // CREATE ORDER (Dipanggil oleh User)
    // ==========================================
    async createBooking(req, res, next) {
        try {
            const userId = req.user.id; // From Auth MW
            const { mitraId, serviceId, userLon, userLat, originalServicePrice } = req.body;

            // Basic Validation
            if (!mitraId || !serviceId || !originalServicePrice) {
                return res.status(400).json({ success: false, message: 'Missing required booking parameters' });
            }

            const data = await bookingService.createBooking({
                userId,
                mitraId,
                serviceId,
                userLon: userLon ? parseFloat(userLon) : null,
                userLat: userLat ? parseFloat(userLat) : null,
                originalServicePrice: parseFloat(originalServicePrice)
            });

            res.status(201).json({
                success: true,
                message: 'Booking match created successfully. Mitra has been locked for work.',
                data
            });
        } catch (error) {
            if (error.message.includes('Mitra not found') || error.message.includes('Minimal harga')) {
                return res.status(400).json({ success: false, message: error.message });
            }
            next(error);
        }
    }

    // ==========================================
    // COMPLETE ORDER (Dipanggil oleh Mitra)
    // ==========================================
    async completeBooking(req, res, next) {
        try {
            const mitraId = req.user.id;
            const { bookingId, tipsAmount } = req.body;

            if (!bookingId) {
                return res.status(400).json({ success: false, message: 'Missing bookingId' });
            }

            // Validasi kepemilikan
            const bookingRes = await db.query('SELECT mitra_id FROM bookings WHERE id = $1', [bookingId]);
            if (bookingRes.rowCount === 0 || bookingRes.rows[0].mitra_id !== mitraId) {
                return res.status(403).json({ success: false, message: 'Not authorized for this booking' });
            }

            const data = await bookingService.completeBooking(bookingId, tipsAmount);

            res.status(200).json({
                success: true,
                message: data.message,
                data: { bookingId: data.bookingId }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BookingController();
