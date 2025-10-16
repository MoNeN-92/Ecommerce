// backend/routes/checkout.js
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { protect } = require('../middleware/auth');

// ✅ OPTIONS requests უნდა გაიაროს protect-ის გარეშე
router.options('/', (req, res) => {
  res.sendStatus(200);
});

router.options('/*', (req, res) => {
  res.sendStatus(200);
});

// ✅ Protected routes with explicit protect middleware per route
router.get('/', protect, checkoutController.getCheckoutData);
router.post('/', protect, checkoutController.processCheckout);

module.exports = router;