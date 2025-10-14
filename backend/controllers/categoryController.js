// backend/controllers/categoryController.js
const { Category, Product } = require('../models');
const { Op } = require('sequelize');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Validate name
    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'კატეგორიის სახელი აუცილებელია' 
      });
    }
    
    // Clean the name - trim whitespace
    const cleanName = name.trim();
    
    // Generate slug that supports Georgian characters
    const slug = cleanName
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\u10A0-\u10FF\u2D00-\u2D2Fa-z0-9\-ა-ჰ]/g, '') // Keep Georgian, Latin, numbers
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start
      .replace(/-+$/, '') // Trim - from end
      || `category-${Date.now()}`; // Fallback if slug is empty
    
    // Check if category with same name exists
    const existingCategory = await Category.findOne({
      where: { 
        name: { [Op.iLike]: cleanName } // Case-insensitive check
      }
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'ამ სახელით კატეგორია უკვე არსებობს'
      });
    }
    
    // Create category
    const category = await Category.create({ 
      name: cleanName,
      description: description ? description.trim() : null,
      slug: slug
    });
    
    res.json({ 
      success: true, 
      data: category,
      message: 'კატეგორია წარმატებით შეიქმნა'
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'კატეგორია ვერ მოიძებნა'
      });
    }
    
    // Update fields
    const updates = {};
    
    if (name && name.trim() !== '') {
      updates.name = name.trim();
      
      // Generate new slug if name changed
      updates.slug = updates.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\u10A0-\u10FF\u2D00-\u2D2Fa-z0-9\-ა-ჰ]/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
        || `category-${Date.now()}`;
    }
    
    if (description !== undefined) {
      updates.description = description ? description.trim() : null;
    }
    
    await category.update(updates);
    
    res.json({
      success: true,
      data: category,
      message: 'კატეგორია განახლდა'
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'კატეგორია ვერ მოიძებნა'
      });
    }
    
    // Check if category has products
    const productsCount = await Product.count({
      where: { category_id: id }
    });
    
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `ამ კატეგორიაში ${productsCount} პროდუქტია. ჯერ პროდუქტები წაშალეთ ან გადაიტანეთ`
      });
    }
    
    await category.destroy();
    
    res.json({
      success: true,
      message: 'კატეგორია წაიშალა'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single category
exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id, {
      include: [{
        model: Product,
        as: 'products',
        required: false
      }]
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'კატეგორია ვერ მოიძებნა'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};