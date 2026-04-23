const express = require('express');

// Controllers
const authController = require('../domains/auth/auth.controller');
const registrationController = require('../domains/mitras/registration.controller');
const adminController = require('../domains/admin/admin.controller');

// Middlewares
const { authMiddleware, roleMiddleware } = require('../core/middlewares/auth.middleware');
const strikeMiddleware = require('../core/middlewares/strike.middleware');
const db = require('../infrastructure/database/db');

const router = express.Router();

// ==========================================
// 1. AUTHENTICATION ROUTES (User & Mitra)
// ==========================================
router.post('/auth/user/register', authController.registerUser);
router.post('/auth/user/login', authController.loginUser);

router.post('/auth/mitra/register', authController.registerMitra);
router.post('/auth/mitra/login', authController.loginMitra);

router.post('/auth/sales/register', authController.registerSales);
router.post('/auth/sales/login', authController.loginSales);


// ==========================================
// 2. MITRA ONBOARDING & PAYMENT
// ==========================================
// Mitra membayar biaya registrasi Rp 50.000
router.post(
    '/mitra/registration-payment',
    authMiddleware,
    roleMiddleware(['MITRA']),
    strikeMiddleware,
    registrationController.payRegistrationFee
);

// Nanti akan diisi route Search, Booking, Review di Fase selanjutnya

// ==========================================
// 3. ADMIN PANEL
// ==========================================
router.get('/admin/dashboard-stats', adminController.getDashboardStats);
router.get('/admin/kyc-approvals', adminController.getKycApprovals);
router.get('/admin/sales-performance', adminController.getSalesPerformance);
router.get('/admin/merch-logistics', adminController.getMerchLogistics);
router.get('/admin/disputes-penalties', adminController.getDisputesPenalties);

// ACTIONS
router.put('/admin/action/approve-kyc/:id', adminController.approveKyc);
router.put('/admin/action/ship-merch/:id', adminController.shipMerch);

// SALES APP STATS
router.get('/sales/stats', adminController.getSalesStats);


// ==========================================
// 4. CORE (SEARCH & BOOKING)
// ==========================================
const mitraController = require('../domains/mitras/mitra.controller');
const bookingController = require('../domains/bookings/booking.controller');

// USER: Cari Tukang Jarak Dekat / Iklan
router.get('/mitra/search', authMiddleware, roleMiddleware(['USER']), strikeMiddleware, mitraController.searchMitras);

// USER: Buat Pesanan
router.post('/booking/create', authMiddleware, roleMiddleware(['USER']), strikeMiddleware, bookingController.createBooking);

// MITRA: Selesaikan Pesanan (Dana masuk Escrow pending konfirmasi)
router.post('/booking/complete', authMiddleware, roleMiddleware(['MITRA']), strikeMiddleware, bookingController.completeBooking);

module.exports = router;
