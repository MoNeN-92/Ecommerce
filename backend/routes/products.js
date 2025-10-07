const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // Auth middleware import

// აქ ჩავსვათ searchProducts-იც და getSearchSuggestions
const { 
  getProducts, 
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getSearchSuggestions  // ✅ დამატებულია
} = require('../controllers/productController');

// Public routes
router.get('/search-suggestions', getSearchSuggestions); // ✅ ახალი route
router.get('/search', searchProducts); 
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes (require authentication)
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;