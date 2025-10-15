// backend/models/OrderItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // ✅
const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true  // YES database-ში
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  product_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true  // YES database-ში
  }
}, {
  tableName: 'order_items',
  timestamps: true,
  underscored: true
});

module.exports = OrderItem;