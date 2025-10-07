// backend/controllers/cartController.js
const { Cart, Product, User } = require('../models');

// Get user's cart with product details
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'stock', 'image_url', 'slug']
      }],
      order: [['created_at', 'DESC']]
    });

    // Calculate total amount and items count
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    // Calculate total items count (sum of all quantities)
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      data: {
        items: cartItems,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        totalItems: totalItems,
        total: totalAmount.toFixed(2), // backward compatibility
        count: cartItems.length // backward compatibility
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    // Handle both productId and product_id for compatibility
    const { productId, product_id, quantity = 1 } = req.body;
    const finalProductId = productId || product_id;

    // Check if product exists and has stock
    const product = await Product.findByPk(finalProductId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Check if item already in cart
    let cartItem = await Cart.findOne({
      where: {
        user_id: userId,
        product_id: finalProductId
      }
    });

    if (cartItem) {
      // Update quantity if exists
      const newQuantity = cartItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock for requested quantity'
        });
      }

      cartItem.quantity = newQuantity;
      await cartItem.save();
      
      res.json({
        success: true,
        message: 'Cart updated',
        data: cartItem
      });
    } else {
      // Create new cart item
      cartItem = await Cart.create({
        user_id: userId,
        product_id: finalProductId,
        quantity: quantity
      });

      res.status(201).json({
        success: true,
        message: 'Item added to cart',
        data: cartItem
      });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to cart',
      error: error.message
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quantity'
      });
    }

    // Find cart item by product_id
    const cartItem = await Cart.findOne({
      where: {
        user_id: userId,
        product_id: productId
      },
      include: [{
        model: Product,
        as: 'product'
      }]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Check stock
    if (cartItem.product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Update quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({
      success: true,
      message: 'Cart item updated',
      data: cartItem
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const deleted = await Cart.destroy({
      where: {
        user_id: userId,
        product_id: productId
      }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from cart',
      error: error.message
    });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.destroy({
      where: { user_id: userId }
    });

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

// Get cart item count
exports.getCartCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const count = await Cart.count({
      where: { user_id: userId }
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting cart count',
      error: error.message
    });
  }
};