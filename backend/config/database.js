// backend/config/database.js
const { Sequelize } = require('sequelize');

console.log('🔄 Loading database configuration...');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set!');
  process.exit(1);
}

console.log('✅ DATABASE_URL found');
console.log('🔗 URL preview:', databaseUrl.substring(0, 30) + '...');

let sequelize;

try {
  // Direct Sequelize URL parsing (simplest method)
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

  console.log('✅ Sequelize instance created successfully');

  // Test connection (non-blocking)
  sequelize.authenticate()
    .then(() => {
      console.log('✅ Database connection test passed');
    })
    .catch((err) => {
      console.error('❌ Database authentication failed:', err.message);
    });

} catch (error) {
  console.error('❌ Failed to create Sequelize instance:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// Critical check before export
if (!sequelize) {
  console.error('❌ CRITICAL: sequelize is undefined before export!');
  process.exit(1);
}

console.log('✅ Exporting sequelize...');

module.exports = sequelize;