// backend/routes/user.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');
const upload = require('../middleware/upload'); // ✅ Uses existing Cloudinary config

// All user routes require authentication
router.use(protect);

// GET /api/user/profile - Get user profile
router.get('/profile', userController.getUserProfile);

// PUT /api/user/profile - Update user profile
router.put('/profile', userController.updateUserProfile);

// PUT /api/user/change-password - Change password
router.put('/change-password', userController.changePassword);

// GET /api/user/orders - Get user orders
router.get('/orders', userController.getUserOrders);

// POST /api/user/upload-image - Upload profile image to Cloudinary
router.post('/upload-image', upload.single('profileImage'), userController.uploadProfileImage);

// DELETE /api/user/account - Delete user account
router.delete('/account', userController.deleteUserAccount);

module.exports = router;