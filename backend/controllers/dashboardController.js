// backend/controllers/dashboardController.js
const { Product, Category, Order, User, OrderItem } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const dashboardController = {
  async getStatistics(req, res) {
    console.log('📊 Dashboard statistics request received');
    
    try {
      // ========== PRODUCTS STATISTICS ==========
      const totalProducts = await Product.count();
      console.log('✅ Total products in DB:', totalProducts);
      
      const lowStockProducts = await Product.count({
        where: {
          stock: {
            [Op.between]: [1, 9]
          }
        }
      });
      
      const outOfStockProducts = await Product.count({
        where: {
          stock: 0
        }
      });
      
      // ========== CATEGORIES ==========
      const totalCategories = await Category.count();
      console.log('✅ Total categories in DB:', totalCategories);
      
      // ========== ORDERS STATISTICS ==========
      const totalOrders = await Order.count();
      
      // Order status counts
      const pendingOrders = await Order.count({
        where: { status: 'pending' }
      });
      
      const processingOrders = await Order.count({
        where: { status: 'processing' }
      });
      
      const shippedOrders = await Order.count({
        where: { status: 'shipped' }
      });
      
      const deliveredOrders = await Order.count({
        where: { status: 'delivered' }
      });
      
      const cancelledOrders = await Order.count({
        where: { status: 'cancelled' }
      });
      
      // Today's orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayOrders = await Order.count({
        where: {
          createdAt: {
            [Op.gte]: today,
            [Op.lt]: tomorrow
          }
        }
      });
      
      // ========== REVENUE CALCULATIONS ==========
      const totalRevenue = await Order.sum('total_amount', {
        where: {
          status: {
            [Op.ne]: 'cancelled'
          }
        }
      }) || 0;
      
      // Monthly revenue (current month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const monthlyRevenue = await Order.sum('total_amount', {
        where: {
          createdAt: {
            [Op.gte]: startOfMonth
          },
          status: {
            [Op.ne]: 'cancelled'
          }
        }
      }) || 0;
      
      // Yearly revenue (current year)
      const startOfYear = new Date();
      startOfYear.setMonth(0, 1);
      startOfYear.setHours(0, 0, 0, 0);
      
      const yearlyRevenue = await Order.sum('total_amount', {
        where: {
          createdAt: {
            [Op.gte]: startOfYear
          },
          status: {
            [Op.ne]: 'cancelled'
          }
        }
      }) || 0;
      
      // Average order value
      const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
      
      // ========== USERS ==========
      const totalUsers = await User.count({
        where: { role: 'customer' }
      });
      
      // ========== RECENT ORDERS ==========
      let recentOrders = [];
      try {
        recentOrders = await Order.findAll({
          limit: 5,
          order: [['createdAt', 'DESC']],
          include: [{
            model: User,
            attributes: ['name', 'email'],
            required: false
          }]
        });
      } catch (orderError) {
        console.log('⚠️ Could not fetch recent orders with users:', orderError.message);
        recentOrders = await Order.findAll({
          limit: 5,
          order: [['createdAt', 'DESC']]
        });
      }
      
      // ========== RECENT PRODUCTS ==========
      let recentProducts = [];
      try {
        recentProducts = await Product.findAll({
          limit: 5,
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'name', 'price', 'stock', 'image_url'],
          include: [{
            model: Category,
            attributes: ['name'],
            required: false
          }]
        });
      } catch (productError) {
        console.log('⚠️ Could not fetch products with categories:', productError.message);
        recentProducts = await Product.findAll({
          limit: 5,
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'name', 'price', 'stock', 'image_url']
        });
      }
      
      // ========== TOP SELLING PRODUCTS ==========
      let topProducts = [];
      try {
        // Get product sales from order items
        const topSellingData = await OrderItem.findAll({
          attributes: [
            'product_id',
            [fn('COUNT', col('product_id')), 'sales_count'],
            [fn('SUM', col('quantity')), 'total_quantity']
          ],
          group: ['product_id'],
          order: [[literal('total_quantity'), 'DESC']],
          limit: 5,
          include: [{
            model: Product,
            attributes: ['id', 'name', 'price', 'stock', 'image_url']
          }]
        });
        
        topProducts = topSellingData.map(item => ({
          ...item.Product?.dataValues,
          sales_count: item.dataValues.sales_count,
          total_quantity: item.dataValues.total_quantity
        })).filter(p => p.id); // Filter out null products
        
      } catch (topError) {
        console.log('⚠️ Could not fetch top selling products:', topError.message);
        // Fallback to recent products as "top"
        topProducts = recentProducts.slice(0, 3);
      }
      
      // ========== DEBUG LOG ==========
      console.log('✅ Statistics gathered:', {
        totalProducts,
        totalCategories,
        totalOrders,
        totalUsers,
        totalRevenue,
        pendingOrders,
        todayOrders
      });
      
      // ========== SEND RESPONSE ==========
      res.json({
        success: true,
        data: {
          products: {
            total: totalProducts,
            lowStock: lowStockProducts,
            outOfStock: outOfStockProducts
          },
          categories: {
            total: totalCategories
          },
          orders: {
            total: totalOrders,
            pending: pendingOrders,
            processing: processingOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders,
            today: todayOrders,
            revenue: parseFloat(totalRevenue.toFixed(2)),
            monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
            yearlyRevenue: parseFloat(yearlyRevenue.toFixed(2)),
            averageValue: parseFloat(averageOrderValue.toFixed(2))
          },
          users: {
            total: totalUsers
          },
          recentOrders: recentOrders.map(order => ({
            id: order.id,
            order_number: order.order_number,
            total_amount: order.total_amount,
            status: order.status,
            payment_status: order.payment_status,
            created_at: order.createdAt,
            User: order.User ? {
              name: order.User.name,
              email: order.User.email
            } : null
          })),
          recentProducts: recentProducts.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            image_url: product.image_url,
            category: product.Category ? product.Category.name : null
          })),
          topProducts: topProducts,
          // Best selling products (alias for compatibility)
          bestSellingProducts: topProducts
        }
      });
      
    } catch (error) {
      console.error('❌ Dashboard statistics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard statistics',
        details: error.message
      });
    }
  },

  // Additional method for chart data
  async getChartData(req, res) {
    try {
      const { period = 'week' } = req.query;
      
      let startDate = new Date();
      if (period === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (period === 'year') {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }
      
      // Get orders grouped by date
      const orders = await Order.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate
          }
        },
        attributes: [
          [fn('DATE', col('createdAt')), 'date'],
          [fn('COUNT', col('id')), 'count'],
          [fn('SUM', col('total_amount')), 'revenue']
        ],
        group: [fn('DATE', col('createdAt'))],
        order: [[fn('DATE', col('createdAt')), 'ASC']]
      });
      
      res.json({
        success: true,
        data: {
          period,
          chartData: orders
        }
      });
      
    } catch (error) {
      console.error('❌ Chart data error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch chart data',
        details: error.message
      });
    }
  },

  // Get low stock products details
  async getLowStockProducts(req, res) {
    try {
      const lowStockProducts = await Product.findAll({
        where: {
          stock: {
            [Op.between]: [1, 9]
          }
        },
        include: [{
          model: Category,
          attributes: ['name']
        }],
        order: [['stock', 'ASC']],
        limit: 20
      });
      
      const outOfStockProducts = await Product.findAll({
        where: {
          stock: 0
        },
        include: [{
          model: Category,
          attributes: ['name']
        }],
        limit: 20
      });
      
      res.json({
        success: true,
        data: {
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts
        }
      });
      
    } catch (error) {
      console.error('❌ Low stock products error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch low stock products',
        details: error.message
      });
    }
  }
};

module.exports = dashboardController;