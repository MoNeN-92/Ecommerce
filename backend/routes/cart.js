// backend/routes/cart.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// All cart routes require authentication
router.use(protect);

// Get user's cart
router.get('/', cartController.getCart);

// Add item to cart - MAIN ROUTE
router.post('/', cartController.addToCart);

// Alternative add route
router.post('/add', cartController.addToCart);

// Update cart item quantity
router.put('/update/:productId', cartController.updateCartItem);

// Remove item from cart
router.delete('/remove/:productId', cartController.removeFromCart);

// Clear entire cart - both routes
router.delete('/', cartController.clearCart);  // root DELETE
router.delete('/clear', cartController.clearCart);

// Get cart count
router.get('/count', cartController.getCartCount);

module.exports = router;