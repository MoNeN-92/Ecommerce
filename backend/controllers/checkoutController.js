// backend/controllers/checkoutController.js
const { Cart, Product, Order, OrderItem, User } = require('../models');
const { sequelize } = require('../config/database');

exports.getCheckoutData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [{
        model: Product,
        as: 'product'
      }]
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'კალათა ცარიელია'
      });
    }

    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + shipping;

    res.json({
      success: true,
      data: {
        items: cartItems,
        user: req.user,
        pricing: {
          subtotal: subtotal.toFixed(2),
          shipping: shipping.toFixed(2),
          total: total.toFixed(2)
        }
      }
    });
  } catch (error) {
    console.error('Get checkout data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading checkout data'
    });
  }
};

exports.processCheckout = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod, notes } = req.body;

    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [{
        model: Product,
        as: 'product'
      }],
      transaction: t
    });

    if (cartItems.length === 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'კალათა ცარიელია'
      });
    }

    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    const shippingAmount = totalAmount > 100 ? 0 : 10;
    const taxAmount = totalAmount * 0.18; // 18% VAT

    // Generate unique order number
    const timestamp = Date.now();
    const orderNumber = `ORD-${timestamp}-${userId}`;

    // Create order with all database fields
    const orderData = {
      user_id: userId,
      total_amount: totalAmount,
      shipping_amount: shippingAmount,
      tax_amount: taxAmount,
      status: 'pending',
      payment_status: 'pending',
      payment_method: paymentMethod || 'cash_on_delivery',
      order_number: orderNumber,
      shipping_address: shippingAddress, // JSON object directly
      billing_address: shippingAddress   // Same address for billing
    };

    console.log('Creating order with data:', orderData);

    const order = await Order.create(orderData, { transaction: t });

    // Create order items
  // Create order items
for (const cartItem of cartItems) {
  const itemTotal = parseFloat(cartItem.product.price) * cartItem.quantity;  // აქ განვსაზღვრავთ
  
  await OrderItem.create({
    order_id: order.id,
    product_id: cartItem.product_id,
    product_name: cartItem.product.name,
    product_image: cartItem.product.image_url,
    quantity: cartItem.quantity,
    price: cartItem.product.price,
    total: itemTotal  // და აქ ვიყენებთ
  }, { transaction: t });

  // Update product stock
  await Product.decrement('stock', {
    by: cartItem.quantity,
    where: { id: cartItem.product_id },
    transaction: t
  });
}

    // Clear cart
    await Cart.destroy({
      where: { user_id: userId },
      transaction: t
    });

    // Commit transaction
    await t.commit();

    res.json({
      success: true,
      data: {
        id: order.id,
        order_number: orderNumber,
        message: 'შეკვეთა წარმატებით შეიქმნა'
      }
    });
  } catch (error) {
    await t.rollback();
    console.error('Process checkout error:', error);
    console.error('Error details:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'შეკვეთის დამუშავება ვერ მოხერხდა',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};