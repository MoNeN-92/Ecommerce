// backend/controllers/productController.js
const { Product, Category } = require('../models');
const { Op } = require('sequelize');

// 🔥 Helper function to process uploaded images
function processUploadedImages(files) {
  if (!files || files.length === 0) return [];
  const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
  return files.map(file => `${BASE_URL}/uploads/products/${file.filename}`);
}

const getProducts = async (req, res) => {
  try {
    console.log('📦 Getting products with params:', req.query);
    
    const { 
      limit = 12, 
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      page = 1
    } = req.query;
    
    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
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

    // Category filter
    if (category && category !== 'all') {
      if (!isNaN(category)) {
        whereClause.category_id = parseInt(category);
        console.log('🔍 Filtering by category ID:', category);
      } else {
        const categoryRecord = await Category.findOne({
          where: { 
            name: { [Op.iLike]: category }
          }
        });
        
        if (categoryRecord) {
          whereClause.category_id = categoryRecord.id;
          console.log('🔍 Found category by name:', category, 'ID:', categoryRecord.id);
        } else {
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

    // Get products with count for pagination
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, sortOrder]],
      attributes: [
        'id', 
        'name', 
        'price', 
        'stock', 
        'description', 
        'image_url',
        'images', // 🔥 Added
        'category_id', 
        'slug', 
        'is_featured', 
        'created_at'
      ],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'description'],
          required: false
        }
      ],
      distinct: true
    });

    // Debug log to check data structure
    if (products.length > 0) {
      console.log('✅ Sample product with category:', {
        id: products[0].id,
        name: products[0].name,
        category_id: products[0].category_id,
        images: products[0].images,
        category: products[0].category ? {
          id: products[0].category.id,
          name: products[0].category.name
        } : null
      });
    }

    console.log(`✅ Found ${products.length} products (Total: ${count})`);

    res.json({
      success: true,
      data: products,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
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

// Get all products without pagination (for admin)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: [
        'id', 
        'name', 
        'price', 
        'stock', 
        'description', 
        'image_url',
        'images', // 🔥 Added
        'category_id', 
        'slug', 
        'is_featured', 
        'created_at'
      ],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });

    console.log(`✅ Found ${products.length} products for admin`);
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('❌ Get all products error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      attributes: [
        'id', 
        'name', 
        'price', 
        'stock', 
        'description', 
        'image_url',
        'images', // 🔥 Added
        'category_id', 
        'slug', 
        'is_featured'
      ],
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
      images: product.images,
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

// 🔥 Featured Products - 5 დღეში ერთხელ იცვლება
const getFeaturedProducts = async (req, res) => {
  try {
    console.log('🌟 Getting featured products...');

    const allProducts = await Product.findAll({
      where: {
        stock: { [Op.gt]: 0 }
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
          required: false
        }
      ],
      attributes: [
        'id', 
        'name', 
        'price', 
        'stock', 
        'description', 
        'image_url',
        'images', // 🔥 Added
        'category_id', 
        'slug', 
        'is_featured', 
        'created_at'
      ],
      order: [['created_at', 'DESC']]
    });

    if (allProducts.length === 0) {
      console.log('⚠️ No products found in database');
      return res.json({
        success: true,
        data: [],
        meta: {
          message: 'პროდუქტები არ არის ბაზაში',
          totalProducts: 0
        }
      });
    }

    console.log(`📊 Total products in database: ${allProducts.length}`);

    const now = new Date();
    const startDate = new Date('2025-01-01');
    const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    const cycleNumber = Math.floor(daysSinceStart / 5);
    const daysUntilChange = 5 - (daysSinceStart % 5);
    
    console.log('📅 Featured Products Cycle Info:');
    console.log(`   - Days since start: ${daysSinceStart}`);
    console.log(`   - Current cycle: ${cycleNumber}`);
    console.log(`   - Days until change: ${daysUntilChange}`);
    
    const shuffled = shuffleWithSeed(allProducts, cycleNumber);
    
    const featuredCount = Math.min(3, shuffled.length);
    const featured = shuffled.slice(0, featuredCount);
    
    console.log(`✨ Selected ${featuredCount} featured products:`, 
      featured.map(p => `${p.id}: ${p.name}`).join(', ')
    );
    
    const featuredWithMeta = featured.map((product, index) => ({
      ...product.toJSON(),
      isFeatured: true,
      featuredPosition: index + 1,
      cycleEndsIn: daysUntilChange
    }));

    res.json({
      success: true,
      data: featuredWithMeta,
      meta: {
        cycleNumber,
        daysUntilChange,
        totalProducts: allProducts.length,
        featuredCount,
        nextChangeDate: new Date(now.getTime() + daysUntilChange * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'შეცდომა featured პროდუქტების ჩატვირთვისას',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🎲 Deterministic Shuffle Function
function shuffleWithSeed(array, seed) {
  const shuffled = [...array];
  let currentSeed = seed;
  
  const seededRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

// 🔥 CREATE PRODUCT - Multiple Images Support
const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category_id, description, is_featured } = req.body;
    
    if (!name || !price || stock === undefined || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, price, stock, category_id'
      });
    }

    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category_id'
      });
    }

    let slug = req.body.slug;
    if (!slug && name) {
      slug = name.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // 🔥 Handle multiple images
    let images = [];
    
    // Option 1: Uploaded files
    if (req.files && req.files.length > 0) {
      images = processUploadedImages(req.files);
      console.log('📸 Uploaded images:', images);
    }
    // Option 2: Image URLs from body
    else if (req.body.images) {
      try {
        images = typeof req.body.images === 'string' 
          ? JSON.parse(req.body.images)
          : req.body.images;
        if (!Array.isArray(images)) {
          images = [images];
        }
        console.log('🔗 Image URLs from body:', images);
      } catch (e) {
        console.error('Error parsing images:', e);
        images = [];
      }
    }
    // Option 3: Single image_url (backwards compatibility)
    else if (req.body.image_url) {
      images = [req.body.image_url];
      console.log('🔗 Single image URL (legacy):', images);
    }

    // Limit to 3 images max
    images = images.slice(0, 3);

    const productData = {
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      price: parseFloat(price),
      stock: parseInt(stock),
      category_id: parseInt(category_id),
      images: images.length > 0 ? images : null,
      image_url: images.length > 0 ? images[0] : null,
      is_featured: is_featured === true || is_featured === 'true'
    };

    console.log('Creating product with data:', {
      ...productData,
      images: productData.images
    });

    const product = await Product.create(productData);
    
    const createdProduct = await Product.findByPk(product.id, {
      attributes: [
        'id', 
        'name', 
        'price', 
        'stock', 
        'description', 
        'image_url',
        'images', // 🔥 Added
        'category_id', 
        'slug', 
        'is_featured'
      ],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });

    console.log('✅ Created product:', createdProduct.name, 'with', createdProduct.images?.length || 0, 'images');

    res.status(201).json({ 
      success: true, 
      data: createdProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('❌ Create product error:', error);
    
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

// 🔥 UPDATE PRODUCT - Multiple Images Support
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    if (req.body.category_id) {
      const category = await Category.findByPk(req.body.category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category_id'
        });
      }
    }

    let updateData = { ...req.body };
    if (!updateData.slug && updateData.name) {
      updateData.slug = updateData.name.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // 🔥 Handle multiple images
    let images = product.images ? [...product.images] : [];
    
    // Option 1: New uploaded files
    if (req.files && req.files.length > 0) {
      const newImages = processUploadedImages(req.files);
      images = [...images, ...newImages];
      console.log('📸 Added new images:', newImages);
    }
    // Option 2: Image URLs from body
    else if (req.body.images) {
      try {
        const bodyImages = typeof req.body.images === 'string' 
          ? JSON.parse(req.body.images)
          : req.body.images;
        if (Array.isArray(bodyImages)) {
          images = bodyImages;
          console.log('🔗 Updated images from body:', images);
        }
      } catch (e) {
        console.error('Error parsing images:', e);
      }
    }
    // Option 3: Single image_url (backwards compatibility)
    else if (req.body.image_url) {
      if (images.length > 0) {
        images[0] = req.body.image_url;
      } else {
        images = [req.body.image_url];
      }
      console.log('🔗 Updated main image (legacy)');
    }

    // Limit to 3 images max
    images = images.slice(0, 3);

    if (images.length > 0) {
      updateData.images = images;
      updateData.image_url = images[0];
    }

    // Convert numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stock !== undefined) updateData.stock = parseInt(updateData.stock);
    if (updateData.category_id) updateData.category_id = parseInt(updateData.category_id);

    console.log('Updating product:', req.params.id, 'with', images.length, 'images');

    await product.update(updateData);
    
    const updatedProduct = await Product.findByPk(product.id, {
      attributes: [
        'id', 
        'name', 
        'price', 
        'stock', 
        'description', 
        'image_url',
        'images', // 🔥 Added
        'category_id', 
        'slug', 
        'is_featured'
      ],
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
    console.error('❌ Update product error:', error);
    
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
    
    if (!q || q.trim().length < 3) {
      return res.json({
        success: true,
        data: [],
        message: 'Search query must be at least 3 characters long'
      });
    }

    console.log('🔍 Searching for:', q);

    const products = await Product.findAll({
      where: {
        [Op.or] : [
          { name: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } }
        ]
      },
      attributes: [
        'id', 
        'name', 
        'price', 
        'stock', 
        'description', 
        'image_url',
        'images', // 🔥 Added
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
    
    const suggestions = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchTerm}%` } },
          { description: { [Op.iLike]: `%${searchTerm}%` } }
        ]
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        }
      ],
      attributes: ['id', 'name', 'price', 'image_url', 'images', 'stock'], // 🔥 Added images
      limit: 5,
      order: [['name', 'ASC']]
    });

    const formattedSuggestions = suggestions.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : product.image_url, // 🔥 Use first image
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
  getAllProducts,
  getProduct,
  getFeaturedProducts,
  createProduct, 
  updateProduct, 
  deleteProduct,
  searchProducts,
  getSearchSuggestions
};