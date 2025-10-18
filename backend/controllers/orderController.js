// backend/controllers/orderController.js
const { Order, OrderItem, Product, User, sequelize } = require('../models');
const emailService = require('../services/emailService');
const crypto = require('crypto');
const { Op } = require('sequelize');

// Get Order by ID (with Admin check)
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    const whereClause = isAdmin 
      ? { id: id }
      : { id: id, user_id: userId };
    
    const order = await Order.findOne({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'image_url']
          }]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const orderData = order.toJSON();
    orderData.User = orderData.user;
    orderData.OrderItems = orderData.items;
    
    res.json({
      success: true,
      data: orderData
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
};

// Get User Orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;
    
    const whereClause = { user_id: userId };
    
    if (status && status !== '') {
      whereClause.status = status;
    }
    
    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'image_url']
          }]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      distinct: true
    });

    const transformedOrders = orders.map(order => {
      const orderData = order.toJSON();
      orderData.User = orderData.user;
      orderData.OrderItems = orderData.items;
      return orderData;
    });

    res.json({
      success: true,
      data: transformedOrders,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    console.log('getAllOrders called');
    
    const { 
      page = 1, 
      limit = 10, 
      status,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const whereClause = {};
    
    if (status && status !== '' && status !== 'all') {
      whereClause.status = status;
    }

    const { count, rows } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'image_url']
          }]
        }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
            subQuery: false  // ✅ CRITICAL FIX
    });

    const transformedRows = rows.map(order => {
      const orderData = order.toJSON();
      orderData.User = orderData.user;
      orderData.OrderItems = orderData.items;
      return orderData;
    });

    res.json({
      success: true,
      data: transformedRows,
      orders: transformedRows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, shipping_address, payment_method, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    let total_amount = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product_id} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      total_amount += parseFloat(product.price) * item.quantity;
    }

    const shippingAmount = total_amount > 100 ? 0 : 10;
    const taxAmount = total_amount * 0.18;

    const transaction = await sequelize.transaction();

    try {
      const order = await Order.create({
        user_id: userId,
        total_amount,
        shipping_amount: shippingAmount,
        tax_amount: taxAmount,
        status: 'pending',
        payment_status: 'pending',
        payment_method: payment_method || 'cash_on_delivery',
        order_number: `ORD-${Date.now()}-${userId}`,
        shipping_address,
        billing_address: shipping_address,
        notes
      }, { transaction });

      for (const item of items) {
        const product = await Product.findByPk(item.product_id, { transaction });
        const itemTotal = parseFloat(product.price) * item.quantity;

        await OrderItem.create({
          order_id: order.id,
          product_id: item.product_id,
          product_name: product.name,
          product_image: product.image_url,
          quantity: item.quantity,
          price: product.price,
          total: itemTotal
        }, { transaction });

        product.stock -= item.quantity;
        await product.save({ transaction });
      }

      await transaction.commit();

      // Send Order Confirmation Email
      try {
        const orderItems = await OrderItem.findAll({
          where: { order_id: order.id }
        });

        const orderData = {
          id: order.id,
          order_number: order.order_number,
          user_name: req.user.name,
          items: orderItems.map(i => ({
            product_name: i.product_name,
            quantity: i.quantity,
            price: i.price
          })),
          total_amount: total_amount + shippingAmount + taxAmount,
          shipping_amount: shippingAmount,
          tax_amount: taxAmount,
          shipping_address,
          payment_method,
          status: order.status
        };

        await emailService.sendOrderConfirmation(orderData, req.user.email);
        console.log('📧 Order confirmation sent to', req.user.email);
      } catch (emailError) {
        console.error('❌ Failed to send order confirmation email:', emailError);
      }

      res.status(201).json({
        success: true,
        data: order,
        message: 'Order created successfully'
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order'
    });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const isAdmin = req.user.role === 'admin';
    
    const whereClause = isAdmin 
      ? { id }
      : { id, user_id: req.user.id };

    const order = await Order.findOne({
      where: whereClause
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const previousStatus = order.status;
    order.status = status;
    
    if (status === 'delivered') {
      order.payment_status = 'completed';
    }
    
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      const orderItems = await OrderItem.findAll({
        where: { order_id: order.id }
      });
      
      for (const item of orderItems) {
        const product = await Product.findByPk(item.product_id);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }
    
    await order.save();

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status'
    });
  }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { 
        id,
        user_id: userId
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending orders can be cancelled'
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      data: order,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order'
    });
  }
};

// Password Reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await user.update({
      reset_token: resetToken,
      reset_token_expiry: resetTokenExpiry
    });

    await emailService.sendPasswordReset(user, resetToken);

    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending password reset email'
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expiry: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword,
      reset_token: null,
      reset_token_expiry: null
    });

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
};
