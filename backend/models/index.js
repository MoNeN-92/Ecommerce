// backend/models/index.js
const sequelize = require('../config/database');

// Import all models directly (they are already initialized)
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Cart = require('./Cart');

// Import Order models
// backend/models/index.js - Order/OrderItem import სექციაში
let Order, OrderItem;
try {
  Order = require('./Order');
  OrderItem = require('./OrderItem');
  console.log('Order models loaded from separate files');
} catch (e) {
  console.log('Order models will use existing definitions');
}

// Import Review model if exists
let Review;
try {
  Review = require('./Review');
  console.log('Review model loaded');
} catch (e) {
  console.log('Review model not found or will be added later');
}

console.log('Models loaded status:', {
  User: !!User,
  Product: !!Product,
  Category: !!Category,
  Cart: !!Cart,
  Order: !!Order,
  OrderItem: !!OrderItem,
  Review: !!Review
});

// ==================
// Define Associations
// ==================

// Category - Product
Category.hasMany(Product, { 
  foreignKey: 'category_id', 
  as: 'products' 
});
Product.belongsTo(Category, { 
  foreignKey: 'category_id', 
  as: 'category' 
});

// User - Cart
User.hasMany(Cart, { 
  foreignKey: 'user_id', 
  as: 'cartItems' 
});
Cart.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'user' 
});

// Product - Cart
Product.hasMany(Cart, { 
  foreignKey: 'product_id', 
  as: 'cartItems' 
});
Cart.belongsTo(Product, { 
  foreignKey: 'product_id', 
  as: 'product' 
});

// User - Order (if Order exists)
if (Order) {
  User.hasMany(Order, { 
    foreignKey: 'user_id', 
    as: 'orders' 
  });
  Order.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });
}

// Order - OrderItem (if both exist)
if (Order && OrderItem) {
  Order.hasMany(OrderItem, { 
    foreignKey: 'order_id', 
    as: 'items' 
  });
  OrderItem.belongsTo(Order, { 
    foreignKey: 'order_id', 
    as: 'order' 
  });
  
  // Product - OrderItem
  Product.hasMany(OrderItem, { 
    foreignKey: 'product_id', 
    as: 'orderItems' 
  });
  OrderItem.belongsTo(Product, { 
    foreignKey: 'product_id', 
    as: 'product' 
  });
}

// User - Review (if Review exists)
if (Review) {
  User.hasMany(Review, { 
    foreignKey: 'user_id', 
    as: 'reviews' 
  });
  Review.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });
  
  // Product - Review
  Product.hasMany(Review, { 
    foreignKey: 'product_id', 
    as: 'reviews' 
  });
  Review.belongsTo(Product, { 
    foreignKey: 'product_id', 
    as: 'product' 
  });
}

console.log('✅ All model associations configured successfully');

// Export all models
module.exports = {
  sequelize,
  User,
  Product,
  Category,
  Cart,
  Order,
  OrderItem,
  Review
};
