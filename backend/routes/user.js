// backend/routes/user.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

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

// POST /api/user/upload-image - Upload profile image
router.post('/upload-image', upload.single('profileImage'), userController.uploadProfileImage);

// DELETE /api/user/account - Delete user account
router.delete('/account', userController.deleteUserAccount);

module.exports = router;