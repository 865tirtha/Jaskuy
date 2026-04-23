const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import domain routes
const authRoutes = require('./domains/auth/auth.routes');
const mitraRoutes = require('./domains/mitras/mitra.routes');
const bookingRoutes = require('./domains/bookings/booking.routes');
const reviewRoutes = require('./domains/reviews/review.routes');

app.use('/api/auth', authRoutes);
app.use('/api/mitra', mitraRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/review', reviewRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Global Error Handler
app.use(require('./core/middlewares/errorHandler'));

module.exports = app;
