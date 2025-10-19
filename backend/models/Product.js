const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    get() {
      const value = this.getDataValue('images');
      if (!value || (Array.isArray(value) && value.length === 0)) {
        const singleImage = this.getDataValue('image_url');
        return singleImage ? [singleImage] : [];
      }
      return value;
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // 🆕 ფასდაკლების ველები
  discount_type: {
    type: DataTypes.ENUM('none', 'percentage', 'fixed'),
    defaultValue: 'none',
    allowNull: false
  },
  discount_value: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false
  }
}, {
  tableName: 'products',
  underscored: true
});

// 🆕 Instance method - ფასდაკლებული ფასის გამოთვლა
Product.prototype.getDiscountedPrice = function() {
  const price = parseFloat(this.price);
  const discountValue = parseFloat(this.discount_value);

  if (this.discount_type === 'none' || discountValue === 0) {
    return price;
  }
  
  if (this.discount_type === 'percentage') {
    return price - (price * discountValue / 100);
  }
  
  if (this.discount_type === 'fixed') {
    return Math.max(0, price - discountValue);
  }
  
  return price;
};

// 🆕 Instance method - არის თუ არა ფასდაკლება
Product.prototype.hasDiscount = function() {
  return this.discount_type !== 'none' && parseFloat(this.discount_value) > 0;
};

// 🆕 Hook - toJSON-ში დავამატოთ გამოთვლილი ფასები
Product.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  
  if (this.hasDiscount()) {
    values.has_discount = true;
    values.discounted_price = this.getDiscountedPrice();
    values.original_price = parseFloat(this.price);
  } else {
    values.has_discount = false;
    values.discounted_price = parseFloat(this.price);
    values.original_price = parseFloat(this.price);
  }
  
  return values;
};

module.exports = Product;