// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// STATIC ROUTES FIRST (admin/all უნდა იყოს :id-ის წინ!)
if (typeof orderController.getAllOrders === 'function') {
  router.get('/admin/all', protect, admin, orderController.getAllOrders);
}

if (typeof orderController.getUserOrders === 'function') {
  router.get('/my-orders', protect, orderController.getUserOrders);
}

// DYNAMIC ROUTES LAST
if (typeof orderController.getOrderById === 'function') {
  router.get('/:id', protect, orderController.getOrderById);
}

// POST/PUT routes
if (typeof orderController.createOrder === 'function') {
  router.post('/', protect, orderController.createOrder);
}

if (typeof orderController.cancelOrder === 'function') {
  router.put('/:id/cancel', protect, orderController.cancelOrder);
}

if (typeof orderController.updateOrderStatus === 'function') {
  router.put('/:id/status', protect, admin, orderController.updateOrderStatus);
}

module.exports = router;