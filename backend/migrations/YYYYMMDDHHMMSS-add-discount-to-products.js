// backend/migrations/YYYYMMDDHHMMSS-add-discount-to-products.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'discount_type', {
      type: Sequelize.ENUM('none', 'percentage', 'fixed'),
      defaultValue: 'none',
      allowNull: false
    });

    await queryInterface.addColumn('products', 'discount_value', {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
      allowNull: false
    });

    // Update existing products
    await queryInterface.sequelize.query(`
      UPDATE products 
      SET discount_type = 'none', discount_value = 0 
      WHERE discount_type IS NULL;
    `);

    console.log('✅ Discount columns added to products table');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'discount_type');
    await queryInterface.removeColumn('products', 'discount_value');
    console.log('✅ Discount columns removed from products table');
  }
};