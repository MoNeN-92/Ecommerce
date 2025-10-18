// backend/controllers/userController.js
const { User, Order, OrderItem, Product } = require('../models');
const bcrypt = require('bcryptjs');

const userController = {
  // Get user profile
  getUserProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId, {
        attributes: {
          exclude: ['password'] // Don't send password
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile'
      });
    }
  },

  // Update user profile
  updateUserProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, phone, first_name, last_name, address } = req.body;
      // ❌ Email can't be changed (removed from updateable fields)

      // Find user
      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update only provided fields
      if (name !== undefined) user.name = name;
      if (first_name !== undefined) user.first_name = first_name;
      if (last_name !== undefined) user.last_name = last_name;
      if (phone !== undefined) user.phone = phone;
      if (address !== undefined) user.address = address;

      await user.save();

      // Return updated user without password
      const updatedUser = user.toJSON();
      delete updatedUser.password;

      res.json({
        success: true,
        data: updatedUser,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Update user profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      // Get user with password
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user has password (OAuth users might not)
      if (!user.password) {
        return res.status(400).json({
          success: false,
          message: 'Cannot change password for OAuth accounts'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      user.password = hashedNewPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }
  },

  // Get user orders - FIXED to return array directly
  getUserOrders: async (req, res) => {
    try {
      const userId = req.user.id;

      const orders = await Order.findAll({
        where: { user_id: userId },
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'image_url']
              }
            ]
          }
        ],
        order: [['created_at', 'DESC']]
      });

      // Transform the response to match frontend expectations
      const formattedOrders = orders.map(order => ({
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount,
        status: order.status || 'pending',
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        shipping_address: order.shipping_address,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: order.items || []
      }));

      res.json({
        success: true,
        data: formattedOrders // ✅ Return array directly
      });
    } catch (error) {
      console.error('Get user orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get orders',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Upload profile image - CLOUDINARY VERSION
  uploadProfileImage: async (req, res) => {
    try {
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      // Cloudinary URL is in req.file.path (configured by multer-cloudinary)
      const imageUrl = req.file.path;
      
      // Update user profile image
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      user.profile_image = imageUrl;
      await user.save();

      // Return updated user without password
      const updatedUser = user.toJSON();
      delete updatedUser.password;

      res.json({
        success: true,
        data: {
          profile_image: imageUrl
        },
        message: 'Profile image updated successfully'
      });
    } catch (error) {
      console.error('Upload profile image error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload profile image'
      });
    }
  },

  // Delete user account
  deleteUserAccount: async (req, res) => {
    try {
      const userId = req.user.id;
      const { password } = req.body;

      // Get user with password
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // For OAuth users, skip password check
      if (user.provider !== 'local') {
        await user.destroy();
        return res.json({
          success: true,
          message: 'Account deleted successfully'
        });
      }

      // For local users, require password
      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Password is required to delete account'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect password'
        });
      }

      // Delete user
      await user.destroy();

      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      console.error('Delete user account error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete account'
      });
    }
  }
};

module.exports = userController;