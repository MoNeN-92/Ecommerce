// backend/controllers/userController.js
const User = require('../models/User');
const  Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
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
      const { name, email, phone, first_name, last_name, address } = req.body;

      // Validate email uniqueness if it's being changed
      if (email) {
        const existingUser = await User.findOne({
          where: { email },
          attributes: ['id']
        });

        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({
            success: false,
            message: 'Email already in use'
          });
        }
      }

      // Update user
      const [updatedRows] = await User.update(
        {
          name: name || undefined,
          email: email || undefined,
          phone: phone || undefined,
          first_name: first_name || undefined,
          last_name: last_name || undefined,
          address: address || undefined
        },
        {
          where: { id: userId },
          returning: true
        }
      );

      if (updatedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Get updated user data
      const updatedUser = await User.findByPk(userId, {
        attributes: {
          exclude: ['password']
        }
      });

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
      await User.update(
        { password: hashedNewPassword },
        { where: { id: userId } }
      );

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

  // Get user orders (for profile page)
  getUserOrders: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const offset = (page - 1) * limit;

      const orders = await Order.findAndCountAll({
        where: { user_id: userId },
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Product,
                attributes: ['id', 'name', 'image_url']
              }
            ]
          }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const totalPages = Math.ceil(orders.count / limit);

      res.json({
        success: true,
        data: {
          orders: orders.rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalOrders: orders.count,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        }
      });
    } catch (error) {
      console.error('Get user orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get orders'
      });
    }
  },

  // Upload profile image
  uploadProfileImage: async (req, res) => {
    try {
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      // Update user with new image URL
      const imageUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
      
      await User.update(
        { profile_image: imageUrl },
        { where: { id: userId } }
      );

      // Get updated user
      const updatedUser = await User.findByPk(userId, {
        attributes: {
          exclude: ['password']
        }
      });

      res.json({
        success: true,
        data: updatedUser,
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

      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Password is required to delete account'
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

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect password'
        });
      }

      // Delete user (this will cascade to related records if set up properly)
      await User.destroy({ where: { id: userId } });

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