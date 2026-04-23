const express = require('express');
const reviewController = require('./review.controller');
const { authMiddleware, roleMiddleware } = require('../../core/middlewares/auth');

const router = express.Router();

// Both User and Mitra can use this route
router.post('/submit', authMiddleware, roleMiddleware(['USER', 'MITRA']), reviewController.submitReview);

module.exports = router;
