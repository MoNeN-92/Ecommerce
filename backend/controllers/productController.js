// backend/controllers/productController.js
const { Product, Category } = require('../models'); // ✅ სწორი import
const { Op } = require('sequelize');

const getProducts = async (req, res) => {
  try {
    // Debug: Check what attributes are available in Product model
    console.log('Available product attributes:', Object.keys(Product.rawAttributes));
    
    const { limit = 12, search } = req.query;
    
    // Build where clause for search
    const whereClause = search 
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } }
          ]
        }
      : {};

    const products = await Product.findAll({
      where: whereClause,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
      attributes: ['id', 'name', 'price', 'stock', 'description', 'image_url', 'category_id', 'slug', 'is_featured', 'created_at'],
      include: [
        {
          model: Category,
          as: 'category', // ✅ შეცვლილი 'Category'-დან 'category'-ზე
          attributes: ['id', 'name', 'description'],
          required: false
        }
      ]
    });

    // Enhanced debug logging
    console.log(`Found ${products.length} products`);
    if (products.length > 0) {
      const firstProduct = products[0];
      console.log('Raw product data:', firstProduct.dataValues);
      console.log('Sample product parsed:', {
        id: firstProduct.id,
        name: firstProduct.name,
        price: firstProduct.price,
        stock: firstProduct.stock,
        stockType: typeof firstProduct.stock,
        hasStock: firstProduct.hasOwnProperty('stock'),
        allKeys: Object.keys(firstProduct.dataValues),
        category: firstProduct.category?.name || 'No category' // ✅ შეცვლილი
      });
    }

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      attributes: ['id', 'name', 'price', 'stock', 'description', 'image_url', 'category_id', 'slug', 'is_featured'],
      include: [
        {
          model: Category,
          as: 'category', // ✅ შეცვლილი
          attributes: ['id', 'name', 'description']
        }
      ]
    });
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    console.log('Retrieved single product:', {
      id: product.id,
      name: product.name,
      stock: product.stock,
      stockType: typeof product.stock,
      rawData: product.dataValues
    });

    res.json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const createProduct = async (req, res) => {
  try {
    // Validate required fields
    const { name, price, stock, category_id } = req.body;
    
    if (!name || !price || stock === undefined || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, price, stock, category_id'
      });
    }

    // Verify category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category_id'
      });
    }

    // Auto-generate slug if not provided
    let slug = req.body.slug;
    if (!slug && name) {
      slug = name.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const productData = {
      ...req.body,
      slug,
      price: parseFloat(price),
      stock: parseInt(stock),
      category_id: parseInt(category_id)
    };

    console.log('Creating product with data:', productData);

    const product = await Product.create(productData);
    
    // Fetch the created product with category
    const createdProduct = await Product.findByPk(product.id, {
      attributes: ['id', 'name', 'price', 'stock', 'description', 'image_url', 'category_id', 'slug', 'is_featured'],
      include: [
        {
          model: Category,
          as: 'category', // ✅ შეცვლილი
          attributes: ['id', 'name']
        }
      ]
    });

    console.log('Created product result:', {
      id: createdProduct.id,
      stock: createdProduct.stock,
      rawData: createdProduct.dataValues
    });

    res.status(201).json({ 
      success: true, 
      data: createdProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Product with this name or slug already exists'
      });
    }
    
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Verify category if provided
    if (req.body.category_id) {
      const category = await Category.findByPk(req.body.category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category_id'
        });
      }
    }

    // Auto-generate slug if name is being updated and no slug provided
    let updateData = { ...req.body };
    if (!updateData.slug && updateData.name) {
      updateData.slug = updateData.name.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Convert numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stock !== undefined) updateData.stock = parseInt(updateData.stock);
    if (updateData.category_id) updateData.category_id = parseInt(updateData.category_id);

    console.log('Updating product:', req.params.id, 'with data:', updateData);

    await product.update(updateData);
    
    // Fetch updated product with category
    const updatedProduct = await Product.findByPk(product.id, {
      attributes: ['id', 'name', 'price', 'stock', 'description', 'image_url', 'category_id', 'slug', 'is_featured'],
      include: [
        {
          model: Category,
          as: 'category', // ✅ შეცვლილი
          attributes: ['id', 'name']
        }
      ]
    });

    console.log('Updated product result:', {
      id: updatedProduct.id,
      stock: updatedProduct.stock,
      rawData: updatedProduct.dataValues
    });

    res.json({ 
      success: true, 
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Product with this name or slug already exists'
      });
    }
    
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    console.log('Deleting product:', product.name);

    await product.destroy();
    
    res.json({ 
      success: true, 
      message: 'Product deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    // Validate search query
    if (!q || q.trim().length < 3) {
      return res.json({
        success: true,
        data: [],
        message: 'Search query must be at least 3 characters long'
      });
    }

    console.log('🔍 Searching for:', q);

    // Search in products
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { 
            name: { 
              [Op.iLike]: `%${q}%` // PostgreSQL case-insensitive search
            } 
          },
          { 
            description: { 
              [Op.iLike]: `%${q}%` 
            } 
          }
        ]
      },
      attributes: [
        'id', 
        'name', 
        'price', 
        'stock', 
        'description', 
        'image_url', 
        'category_id', 
        'slug', 
        'is_featured'
      ],
      include: [
        {
          model: Category,
          as: 'category', // ✅ შეცვლილი
          attributes: ['id', 'name'],
          required: false
        }
      ],
      limit: 20,
      order: [
        ['is_featured', 'DESC'],
        ['created_at', 'DESC']
      ]
    });

    console.log(`✅ Found ${products.length} products for query: "${q}"`);

    res.json({
      success: true,
      data: products,
      count: products.length,
      query: q
    });

  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Search suggestions (autocomplete)
const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const searchTerm = q.trim();
    console.log('🔍 Getting suggestions for:', searchTerm);
    
    // Search in products by name and description
    const suggestions = await Product.findAll({
      where: {
        [Op.or]: [
          { 
            name: {
              [Op.iLike]: `%${searchTerm}%`
            }
          },
          {
            description: {
              [Op.iLike]: `%${searchTerm}%`
            }
          }
        ]
      },
      include: [
        {
          model: Category,
          as: 'category', // ✅ შეცვლილი
          attributes: ['name']
        }
      ],
      attributes: ['id', 'name', 'price', 'image_url', 'stock'],
      limit: 5, // Top 5 suggestions
      order: [
        ['name', 'ASC'] // მარტივი order - SQL literal-ის გარეშე
      ]
    });

    // Format suggestions
    const formattedSuggestions = suggestions.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      stock: product.stock,
      category: product.category?.name || null // ✅ შეცვლილი
    }));

    console.log(`✅ Found ${formattedSuggestions.length} suggestions`);

    res.json({
      success: true,
      data: formattedSuggestions
    });

  } catch (error) {
    console.error('❌ Search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Search suggestions failed'
    });
  }
};

module.exports = { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  searchProducts,
  getSearchSuggestions
};