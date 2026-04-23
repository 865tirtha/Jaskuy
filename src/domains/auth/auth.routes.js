const express = require('express');
const authController = require('./auth.controller');

const router = express.Router();

router.post('/user/register', authController.registerUser);
router.post('/mitra/register', authController.registerMitra);

router.post('/user/login', authController.loginUser);
router.post('/mitra/login', authController.loginMitra);

module.exports = router;
