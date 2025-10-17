// backend/controllers/productController.js
const { Product, Category, sequelize } = require('../models');
const { cloudinary } = require('../middleware/upload');

// Helper function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
};

// Helper function to delete image from Cloudinary
const deleteCloudinaryImage = async (imageUrl) => {
  try {
    if (imageUrl && imageUrl.includes('cloudinary.com')) {
      // Extract public_id from Cloudinary URL
      // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
      const parts = imageUrl.split('/');
      const filename = parts[parts.length - 1];
      const publicId = `ecommerce-products/${filename.split('.')[0]}`;
      
      await cloudinary.uploader.destroy(publicId);
      console.log('🗑️ Deleted image from Cloudinary:', publicId);
    }
  } catch (error) {
    console.error('❌ Error deleting image from Cloudinary:', error.message);
  }
};

// @desc    Get all products
// @route   GET /api/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ 
        model: Category,
        as: 'category',
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

// @desc    Get featured products
// @route   GET /api/products/featured
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { is_featured: true },
      include: [{ 
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      limit: 8,
      order: [['created_at', 'DESC']]
    });

    return res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
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
        as: 'category',
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

// @desc    Create product (supports up to 3 images via Cloudinary)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id, is_featured } = req.body;

    console.log('📦 Creating product:', name);
    console.log('📸 Files received:', req.files ? req.files.length : 0);

    // Generate slug from name
    const slug = generateSlug(name);
    console.log('🔗 Generated slug:', slug);

    // Get Cloudinary URLs from uploaded files
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
      console.log(`✅ ${images.length} images uploaded to Cloudinary`);
    }

    // First image as main image_url
    const image_url = images.length > 0 ? images[0] : null;

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      stock,
      category_id,
      image_url,
      images,
      is_featured: is_featured || false
    });

    console.log('✅ Product created:', product.id);

    return res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Create product error:', error);
    
    // Delete uploaded images on error
    if (req.files) {
      for (const file of req.files) {
        await deleteCloudinaryImage(file.path);
      }
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update product (supports up to 3 images via Cloudinary)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category_id, is_featured } = req.body;

    console.log('📝 Updating product:', id);

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Generate new slug if name changed
    let slug = product.slug;
    if (name && name !== product.name) {
      slug = generateSlug(name);
      console.log('🔗 Updated slug:', slug);
    }

    // Keep existing images if no new files uploaded
    let images = product.images || [];
    let image_url = product.image_url;

    // If new files uploaded, replace old images
    if (req.files && req.files.length > 0) {
      console.log(`📸 Uploading ${req.files.length} new images to Cloudinary...`);
      
      // Delete old images from Cloudinary
      if (product.images && Array.isArray(product.images)) {
        for (const oldImage of product.images) {
          await deleteCloudinaryImage(oldImage);
        }
      }
      
      // Get new Cloudinary URLs
      images = req.files.map(file => file.path);
      image_url = images[0];

      console.log(`✅ ${images.length} new images uploaded`);
    }

    await product.update({
      name,
      slug,
      description,
      price,
      stock,
      category_id,
      image_url,
      images,
      is_featured: is_featured !== undefined ? is_featured : product.is_featured
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

    // Delete images from Cloudinary
    if (product.images && Array.isArray(product.images)) {
      console.log(`🗑️ Deleting ${product.images.length} images from Cloudinary...`);
      for (const imageUrl of product.images) {
        await deleteCloudinaryImage(imageUrl);
      }
    }

    await product.destroy();

    console.log('✅ Product deleted:', id);

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
          [require('sequelize').Op.iLike]: `%${q}%`
        }
      },
      include: [{ 
        model: Category,
        as: 'category',
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