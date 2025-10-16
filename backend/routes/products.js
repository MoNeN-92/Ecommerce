const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); 
const { single, multiple } = require('../middleware/upload');

const { 
  getAllProducts, 
  getFeaturedProducts,  // ✅ დამატებული
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} = require('../controllers/productController');

// Static GET routes first
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);  // ✅ დამატებული
router.get('/', getAllProducts);

// Dynamic GET route last
router.get('/:id', getProductById);

// Protected POST/PUT routes using multiple wrapper (3 images max)
router.post('/', protect, multiple('images', 3), createProduct);
router.put('/:id', protect, multiple('images', 3), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;