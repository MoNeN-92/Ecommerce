// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env variables FIRST
dotenv.config();

// DEBUG - Check if env loads
console.log('\n=== Environment Check ===');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '✅ SET' : '❌ NOT SET');
console.log('========================\n');

// Import sequelize and all models from index.js
const { 
  sequelize, 
  User, 
  Product, 
  Category, 
  Cart, 
  Order, 
  OrderItem,
  Review
} = require('./models');

console.log('✅ All models loaded from index.js');

// Initialize Express
const app = express();

// ===== CORS Configuration =====
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.81.1:3000',
  'https://ecommerce-7abn.vercel.app',
  'https://ecommerce-7abn-git-main-monen-92s-projects.vercel.app',
  'https://ecommerce-7abn-ng4w24z4e-monen-92s-projects.vercel.app',
  'https://ecommerce-7abn-cujtbg6v1-monen-92s-projects.vercel.app',
    'https://ecommerce-snowy-eta-40.vercel.app' // ✅ დაამატე ეს ხაზი
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      console.log('✅ Request with no origin allowed');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list or matches vercel.app domain
    const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');
    
    if (isAllowed) {
      console.log('✅ CORS allowed for origin:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Add additional CORS headers for OAuth
app.use((req, res, next) => {
  const origin = req.get('origin');
  if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app'))) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.header('Cross-Origin-Opener-Policy', 'unsafe-none');
    res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    return res.sendStatus(204);
  }
  
  next();
});

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files serving - uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - Origin: ${req.get('origin') || 'no-origin'}`);
  next();
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running!' });
});

// Import and use routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const categoriesRoutes = require('./routes/categories');
const dashboardRoutes = require('./routes/dashboard');
const uploadRoutes = require('./routes/upload');
const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');

app.options('*', cors());

// Routes registration
app.use('/api/checkout', checkoutRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/user', userRoutes);

// Routes-ების შემდეგ
console.log('Registered routes:');
app._router.stack.forEach(r => {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});

// 404 handler - ყველა route-ის შემდეგ!
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware - ყველაზე ბოლოში
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');

    console.log('Syncing database models...');
    await sequelize.sync({ alter: false });
    console.log('✅ Database models synced!');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 API URL: http://localhost:${PORT}`);
      console.log('\n📊 Available API Endpoints:');
      console.log(`   - Cart: http://localhost:${PORT}/api/cart`);
      console.log(`   - User: http://localhost:${PORT}/api/user`);
      console.log(`   - Products: http://localhost:${PORT}/api/products`);
      console.log(`   - Categories: http://localhost:${PORT}/api/categories`);
      console.log(`   - Dashboard Stats: http://localhost:${PORT}/api/dashboard/statistics`);
      console.log(`   - Admin Orders: http://localhost:${PORT}/api/orders/admin/all`);
      console.log(`   - Upload Images: http://localhost:${PORT}/api/upload`);
      console.log(`   - Static Files: http://localhost:${PORT}/uploads/`);
      console.log('\n🌐 CORS enabled for:');
      allowedOrigins.forEach(origin => console.log(`   - ${origin}`));
      console.log('   - *.vercel.app domains');
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

startServer();
