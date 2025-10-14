const { single, multiple } = require('../middleware/upload');
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/auth');

// Upload single image
router.post('/single', protect, admin, single('image'), uploadController.uploadSingle);

// Upload multiple images (max 5)
router.post('/multiple', protect, admin, multiple('images', 5), uploadController.uploadMultiple);

// Upload product image
router.post('/product/:productId', protect, admin, single('image'), uploadController.uploadProductImage);

// Delete image
router.delete('/image/:filename', protect, admin, uploadController.deleteImage);

// Test route without auth (development only)
if (process.env.NODE_ENV === 'development') {
  router.post('/test', single('image'), uploadController.uploadSingle);
}

module.exports = router;
