// backend/controllers/productController.js
const { Product, Category } = require('../models');
const { Op } = require('sequelize');

const getProducts = async (req, res) => {
  try {
    console.log('📦 Getting products with params:', req.query);
    
    const { 
      limit = 12, 
      search,
      category,  // კატეგორია შეიძლება იყოს ID ან სახელი
      minPrice,
      maxPrice,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;
    
    // Build where clause
    let whereClause = {};
    
    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Price filter
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }

    // ⚠️ კატეგორიის ფილტრაცია - აქ იყო პრობლემა!
    if (category && category !== 'all') {
      // თუ რიცხვია, ეს არის ID
      if (!isNaN(category)) {
        whereClause.category_id = parseInt(category);
        console.log('🔍 Filtering by category ID:', category);
      } else {
        // თუ სტრინგია, ეს არის კატეგორიის სახელი
        // პირველ რიგში ვიპოვოთ კატეგორია სახელით
        const categoryRecord = await Category.findOne({
          where: { 
            name: { [Op.iLike]: category } // Case-insensitive search
          }
        });
        
        if (categoryRecord) {
          whereClause.category_id = categoryRecord.id;
          console.log('🔍 Found category by name:', category, 'ID:', categoryRecord.id);
        } else {
          // თუ კატეგორია ვერ ვიპოვეთ, დავაბრუნოთ ცარიელი მასივი
          console.log(`❌ Category not found: ${category}`);
          return res.json({
            success: true,
            data: [],
            count: 0,
            message: `კატეგორია "${category}" ვერ მოიძებნა`
          });
        }
      }
    }

    console.log('📋 Where clause:', JSON.stringify(whereClause, null, 2));

    const products = await Product.findAll({
      where: whereClause,
      limit: parseInt(limit),
      order: [[sortBy, sortOrder]],
      attributes: ['id', 'name', 'price', 'stock', 'description', 'image_url', 'category_id', 'slug', 'is_featured', 'created_at'],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'description'],
          required: false
        }
      ]
    });

    console.log(`✅ Found ${products.length} products`);

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('❌ Get products error:', error);
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
          as: 'category',
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
      category: product.category?.name
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
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });

    console.log('Created product:', createdProduct.name);

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

    console.log('Updating product:', req.params.id);

    await product.update(updateData);
    
    // Fetch updated product with category
    const updatedProduct = await Product.findByPk(product.id, {
      attributes: ['id', 'name', 'price', 'stock', 'description', 'image_url', 'category_id', 'slug', 'is_featured'],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
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
              [Op.iLike]: `%${q}%`
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
          as: 'category',
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
          as: 'category',
          attributes: ['name']
        }
      ],
      attributes: ['id', 'name', 'price', 'image_url', 'stock'],
      limit: 5,
      order: [
        ['name', 'ASC']
      ]
    });

    // Format suggestions
    const formattedSuggestions = suggestions.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      stock: product.stock,
      category: product.category?.name || null
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