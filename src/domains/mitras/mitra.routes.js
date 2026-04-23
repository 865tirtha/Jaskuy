const express = require('express');
const kycController = require('./kyc.controller');
const mitraController = require('./mitra.controller');
const registrationController = require('./registration.controller');
const { authMiddleware, roleMiddleware } = require('../../core/middlewares/auth');

const router = express.Router();

// User Route: Search for Mitras (Geofencing & Priority Ads)
router.get('/search', authMiddleware, roleMiddleware(['USER']), mitraController.searchMitras);

// Mitra Route: Upload KYC
router.post('/kyc', authMiddleware, roleMiddleware(['MITRA']), kycController.uploadKyc);

// Mitra Route: Pay Base Fee (Rp 50k) Merch
router.post('/registration-payment', authMiddleware, roleMiddleware(['MITRA']), registrationController.payRegistrationFee);

// Mitra Route: Buy Premium Pro (Max 3 / City)
router.post('/premium-ads', authMiddleware, roleMiddleware(['MITRA']), registrationController.buyPremiumProAd);

module.exports = router;
