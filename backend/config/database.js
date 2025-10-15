const { Sequelize } = require('sequelize');

console.log('🔍 Checking DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not Set');

// Use DATABASE_URL if available (Railway), otherwise use individual variables
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
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
    })
  : new Sequelize({
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'ecommerce',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

// Test connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connection established successfully'))
  .catch(err => console.error('❌ Unable to connect to database:', err.message));

module.exports = sequelize;