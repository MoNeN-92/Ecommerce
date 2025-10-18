// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const oauthController = require('../controllers/oauthController');
const { protect } = require('../middleware/auth');

// Public routes - Traditional auth
router.post('/register', authController.register);
router.post('/login', authController.login);

// OAuth routes
router.post('/google', oauthController.googleAuth);
router.post('/facebook', oauthController.facebookAuth);

// Protected routes
router.get('/me', protect, authController.getMe);
router.get('/verify', protect, authController.verifyToken);

module.exports = router;