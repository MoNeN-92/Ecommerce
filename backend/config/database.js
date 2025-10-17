// backend/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('🔄 Loading database configuration...');
console.log('Environment:', process.env.NODE_ENV);

let sequelize;

if (process.env.DATABASE_URL) {
  // ✅ Production (Railway) - PostgreSQL URL
  console.log('✅ Using DATABASE_URL (Production)');
  
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // ✅ Local Development - Individual credentials
  console.log('✅ Using individual DB credentials (Local Development)');
  
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'ecommerce_db',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'admin123'
  };

  console.log('Database Config:', {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    username: dbConfig.username,
    password: dbConfig.password ? '✓' : '✗'
  });

  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    process.exit(1);
  }
};

testConnection();

module.exports = sequelize;