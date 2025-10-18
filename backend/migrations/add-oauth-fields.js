// backend/migrations/add-oauth-fields.js
// Run this migration to add new fields to existing database

const { sequelize } = require('../models');

const runMigration = async () => {
  try {
    console.log('🔄 Starting database migration...');

    // Add new columns to users table
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS first_name VARCHAR(50),
      ADD COLUMN IF NOT EXISTS last_name VARCHAR(50),
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS provider VARCHAR(20) DEFAULT 'local',
      ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255);
    `);

    // Make password nullable for OAuth users
    await sequelize.query(`
      ALTER TABLE users 
      ALTER COLUMN password DROP NOT NULL;
    `);

    // Increase profile_image column size for longer URLs
    await sequelize.query(`
      ALTER TABLE users 
      ALTER COLUMN profile_image TYPE VARCHAR(500);
    `);

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runMigration();
}

module.exports = runMigration;