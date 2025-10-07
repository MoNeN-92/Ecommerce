// backend/controllers/adminController.js

const { Product, Order, User } = require('../models');
const { Op } = require('sequelize');

const getStats = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();
    const totalUsers = await User.count();
    
    const revenue = await Order.sum('total_amount') || 0;

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue: revenue,
        totalUsers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats };