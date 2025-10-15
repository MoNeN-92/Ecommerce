// backend/config/database.js
const { Sequelize } = require('sequelize');

// Parse DATABASE_URL
const parseDatabaseUrl = (url) => {
  if (!url) return null;
  
  try {
    // postgresql://user:password@host:port/database
    const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
    const match = url.match(regex);
    
    if (match) {
      return {
        username: match[1],
        password: match[2],
        host: match[3],
        port: match[4],
        database: match[5]
      };
    }
  } catch (error) {
    console.error('❌ Parse error:', error.message);
  }
  return null;
};

// Get configuration
let sequelize;

try {
  const databaseUrl = process.env.DATABASE_URL;
  
  console.log('🔍 Checking DATABASE_URL:', databaseUrl ? '✅ Set' : '❌ Not Set');
  
  // Priority 1: Use DATABASE_URL (Railway/Production)
  if (databaseUrl) {
    const parsed = parseDatabaseUrl(databaseUrl);
    
    if (parsed) {
      console.log('✅ Using DATABASE_URL');
      console.log('📊 Database:', parsed.database);
      console.log('🖥️  Host:', parsed.host);
      
      sequelize = new Sequelize({
        username: parsed.username,
        password: parsed.password,
        database: parsed.database,
        host: parsed.host,
        port: parsed.port,
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
    } else {
      throw new Error('Failed to parse DATABASE_URL');
    }
  } else {
    // Priority 2: Individual variables (Local Development)
    console.log('⚠️  Using individual environment variables');
    
    sequelize = new Sequelize({
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'ecommerce',
      host: process.env.DB_HOST || 'localhost',
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
  }

  // Test connection (async, don't block)
  sequelize.authenticate()
    .then(() => {
      console.log('✅ Database connection established successfully');
    })
    .catch((error) => {
      console.error('❌ Database connection failed:', error.message);
    });

} catch (error) {
  console.error('❌ Sequelize initialization failed:', error.message);
  process.exit(1);
}

module.exports = sequelize;