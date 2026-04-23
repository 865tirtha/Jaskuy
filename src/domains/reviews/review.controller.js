const reviewService = require('./review.service');

exports.submitReview = async (req, res, next) => {
    try {
        const { bookingId, rating, comment } = req.body;
        const reviewerRole = req.user.role; // Extract from JWT
        const reviewerId = req.user.id;

        if (!bookingId || !rating) {
            return res.status(400).json({ success: false, message: 'Booking ID and Rating are required' });
        }

        const data = await reviewService.submitReview({
            bookingId, reviewerRole, reviewerId, rating: parseFloat(rating), comment
        });

        res.status(201).json({ success: true, ...data });
    } catch (error) {
        next(error);
    }
};
