const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); 
const { single, multiple } = require('../middleware/upload');

const { 
  getProducts, 
  getProduct,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getSearchSuggestions
} = require('../controllers/productController');

// Static GET routes first
router.get('/featured', getFeaturedProducts);
router.get('/search-suggestions', getSearchSuggestions);
router.get('/search', searchProducts);
router.get('/', getProducts);

// Dynamic GET route last
router.get('/:id', getProduct);

// Protected POST/PUT routes using multiple wrapper
router.post('/', protect, multiple('images', 3), createProduct);
router.put('/:id', protect, multiple('images', 3), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
