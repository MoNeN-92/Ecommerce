// backend/routes/checkout.js
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', checkoutController.getCheckoutData);
router.post('/', checkoutController.processCheckout);

module.exports = router;