const express = require('express');
const bookingController = require('./booking.controller');
const { authMiddleware, roleMiddleware } = require('../../core/middlewares/auth');

const router = express.Router();

// User Routes
router.post('/create', authMiddleware, roleMiddleware(['USER']), bookingController.createBooking);

// Mitra Routes
router.post('/complete', authMiddleware, roleMiddleware(['MITRA']), bookingController.completeBooking);

module.exports = router;
