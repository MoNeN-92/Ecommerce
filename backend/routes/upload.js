// backend/routes/upload.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const uploadController = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/auth');

// Upload single image - protected route
router.post('/single', 
  protect, 
  admin,
  upload.single('image'), 
  uploadController.uploadSingle
);

// Upload multiple images (max 5) - protected route
router.post('/multiple', 
  protect, 
  admin,
  upload.array('images', 5), 
  uploadController.uploadMultiple
);

// Upload product image - protected route
router.post('/product/:productId', 
  protect, 
  admin,
  upload.single('image'), 
  uploadController.uploadProductImage
);

// Delete image - protected route
router.delete('/image/:filename', 
  protect, 
  admin,
  uploadController.deleteImage
);

// Test route without auth (development only)
if (process.env.NODE_ENV === 'development') {
  router.post('/test', 
    upload.single('image'), 
    uploadController.uploadSingle
  );
}

module.exports = router;