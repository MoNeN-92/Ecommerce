// backend/controllers/uploadController.js
const path = require('path');
const fs = require('fs').promises;
const { Product } = require('../models');

const uploadController = {
  // Upload single image
  async uploadSingle(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      // Generate URLs for the uploaded file
      const relativeUrl = `/uploads/products/${req.file.filename}`;
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      const fullUrl = `${baseUrl}${relativeUrl}`;
      
      console.log('✅ Image uploaded:', fullUrl);

      res.json({
        success: true,
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          url: relativeUrl,
          fullUrl: fullUrl
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload image'
      });
    }
  },

  // Upload multiple images
  async uploadMultiple(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files uploaded'
        });
      }

      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

      const uploadedFiles = req.files.map(file => {
        const relativeUrl = `/uploads/products/${file.filename}`;
        return {
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          url: relativeUrl,
          fullUrl: `${baseUrl}${relativeUrl}`
        };
      });

      console.log(`✅ ${uploadedFiles.length} images uploaded`);

      res.json({
        success: true,
        data: uploadedFiles
      });
    } catch (error) {
      console.error('Multiple upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload images'
      });
    }
  },

  // Upload product image and update product
  async uploadProductImage(req, res) {
    try {
      const { productId } = req.params;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      // Find product
      const product = await Product.findByPk(productId);
      if (!product) {
        // Delete uploaded file if product not found
        await fs.unlink(req.file.path).catch(err => console.error('File delete error:', err));
        
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      // Delete old image if exists and it's a local upload
      if (product.image_url && product.image_url.includes('/uploads/')) {
        // Extract filename from URL
        const oldFilename = product.image_url.split('/').pop();
        const oldImagePath = path.join(__dirname, '..', 'uploads', 'products', oldFilename);
        await fs.unlink(oldImagePath).catch(err => console.log('Old image not found:', err));
      }

      // Generate full URL for new image
      const relativeUrl = `/uploads/products/${req.file.filename}`;
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      const fullUrl = `${baseUrl}${relativeUrl}`;
      
      // Update product with FULL URL
      product.image_url = fullUrl;
      await product.save();

      console.log(`✅ Product ${productId} image updated:`, fullUrl);

      res.json({
        success: true,
        data: {
          productId: product.id,
          imageUrl: relativeUrl,
          fullUrl: fullUrl
        }
      });
    } catch (error) {
      console.error('Product image upload error:', error);
      
      // Delete uploaded file on error
      if (req.file) {
        await fs.unlink(req.file.path).catch(err => console.error('File cleanup error:', err));
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to upload product image'
      });
    }
  },

  // Delete image
  async deleteImage(req, res) {
    try {
      const { filename } = req.params;
      const imagePath = path.join(__dirname, '..', 'uploads', 'products', filename);
      
      // Check if file exists
      await fs.access(imagePath);
      
      // Delete file
      await fs.unlink(imagePath);
      
      console.log(`✅ Image deleted: ${filename}`);
      
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } catch (error) {
      console.error('Delete error:', error);
      
      if (error.code === 'ENOENT') {
        return res.status(404).json({
          success: false,
          error: 'Image not found'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to delete image'
      });
    }
  }
};

module.exports = uploadController;