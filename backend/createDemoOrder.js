// backend/createDemoOrder.js
require('dotenv').config();
const { sequelize } = require('./config/database');
const { Order, OrderItem } = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');

async function createDemoOrder() {
  try {
    await sequelize.sync();
    
    // Get first admin user
    const admin = await User.findOne({ where: { role: 'admin' } });
    if (!admin) {
      console.log('No admin user found');
      return;
    }
    
    // Get first product
    const product = await Product.findOne();
    if (!product) {
      console.log('No products found');
      return;
    }
    
    // Create order
    const order = await Order.create({
      user_id: admin.id,
      total_amount: 99.99,
      status: 'pending',
      shipping_address: { 
        street: '123 Main St',
        city: 'Tbilisi', 
        country: 'Georgia' 
      },
      payment_method: 'Cash on Delivery'
    });
    
    // Create order item
    await OrderItem.create({
      order_id: order.id,
      product_id: product.id,
      product_name: product.name,
      product_image: product.image_url,
      quantity: 1,
      price: product.price
    });
    
    console.log('Demo order created:', order.id);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createDemoOrder();