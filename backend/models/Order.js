// backend/models/Order.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shipping_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'pending'
  },
  payment_status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'pending'
  },
  shipping_address: {
    type: DataTypes.JSON,  // JSON type რადგან database-ში json არის
    allowNull: false
  },
  billing_address: {
    type: DataTypes.JSON,
    allowNull: true
  },
  order_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true
});

module.exports = Order;