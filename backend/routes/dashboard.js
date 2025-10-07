// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/auth');

// All dashboard routes require authentication and admin role
router.use(protect, admin);

// Main dashboard statistics
router.get('/statistics', dashboardController.getStatistics);

// Chart data for analytics
router.get('/chart-data', dashboardController.getChartData);

// Low stock products details
router.get('/low-stock', dashboardController.getLowStockProducts);

module.exports = router;

// ========================================
// Add to server.js or app.js:
// ========================================
// const dashboardRoutes = require('./routes/dashboard');
// app.use('/api/dashboard', dashboardRoutes);