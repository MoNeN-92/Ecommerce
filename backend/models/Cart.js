// backend/models/Cart.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      isInt: true
    }
  }
}, {
  tableName: 'cart',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'product_id'],
      name: 'cart_user_product_unique'
    },
    {
      fields: ['user_id'],
      name: 'cart_user_id_index'
    },
    {
      fields: ['product_id'],
      name: 'cart_product_id_index'
    }
  ]
});

// Define associations
Cart.associate = (models) => {
  // Cart belongs to User
  Cart.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'User',
    onDelete: 'CASCADE'
  });

  // Cart belongs to Product
  Cart.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'Product',
    onDelete: 'CASCADE'
  });
};

module.exports = Cart;