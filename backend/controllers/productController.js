// backend/controllers/productController.js
const { Product, Category } = require('../models');
const imgbbUploader = require('imgbb-uploader');
const { Op } = require('sequelize');

// @desc    Get all products
// @route   GET /api/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ 
        model: Category,
        attributes: ['id', 'name']
      }],
      order: [['created_at', 'DESC']]
    });

    return res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [{ 
        model: Category,
        attributes: ['id', 'name']
      }]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;

    console.log('📦 Creating product:', name);

    // Upload image to ImgBB
    let image_url = null;
    if (req.file) {
      console.log('📸 Uploading image to ImgBB...');
      
      try {
        const response = await imgbbUploader({
          apiKey: process.env.IMGBB_API_KEY,
          base64string: req.file.buffer.toString('base64'),
          name: `${Date.now()}-${name}`,
          expiration: null // Never expire
        });

        image_url = response.url;
        console.log('✅ Image uploaded:', image_url);
      } catch (uploadError) {
        console.error('❌ ImgBB upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image to ImgBB'
        });
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category_id,
      image_url
    });

    console.log('✅ Product created:', product.id);

    return res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Create product error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category_id } = req.body;

    console.log('📝 Updating product:', id);

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Upload new image if provided
    let image_url = product.image_url;
    if (req.file) {
      console.log('📸 Uploading new image to ImgBB...');
      
      try {
        const response = await imgbbUploader({
          apiKey: process.env.IMGBB_API_KEY,
          base64string: req.file.buffer.toString('base64'),
          name: `${Date.now()}-${name}`,
          expiration: null
        });

        image_url = response.url;
        console.log('✅ New image uploaded:', image_url);
      } catch (uploadError) {
        console.error('❌ ImgBB upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image to ImgBB'
        });
      }
    }

    await product.update({
      name,
      description,
      price,
      stock,
      category_id,
      image_url
    });

    console.log('✅ Product updated:', id);

    return res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Update product error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.destroy();

    return res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const products = await Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${q}%`
        }
      },
      include: [{ 
        model: Category,
        attributes: ['id', 'name']
      }],
      limit: 10
    });

    return res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Search products error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
