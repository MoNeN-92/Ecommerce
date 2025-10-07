require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const User = require('./models/User');

async function createDemoUsers() {
  try {
    await sequelize.sync();
    
    console.log('Deleting old demo users...');
    await User.destroy({ 
      where: { 
        email: ['admin@demo.com', 'user@demo.com'] 
      } 
    });
    
    console.log('Creating admin user...');
    const adminHash = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: adminHash,
      role: 'admin'
    });
    
    console.log('Creating regular user...');
    const userHash = await bcrypt.hash('user123', 10);
    const user = await User.create({
      name: 'Demo User',
      email: 'user@demo.com',
      password: userHash,
      role: 'customer'
    });
    
    console.log('\nDemo users created!');
    console.log('Admin: admin@demo.com / admin123');
    console.log('User: user@demo.com / user123');
    
    const adminTest = await bcrypt.compare('admin123', adminHash);
    const userTest = await bcrypt.compare('user123', userHash);
    
    console.log('\nPassword test:');
    console.log('Admin:', adminTest ? 'OK' : 'FAIL');
    console.log('User:', userTest ? 'OK' : 'FAIL');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createDemoUsers();