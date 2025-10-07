// backend/hashPasswords.js
const bcrypt = require('bcryptjs');

async function generateHashes() {
  // Admin password: admin123
  const adminHash = await bcrypt.hash('admin123', 10);
  console.log('\n👑 Admin User:');
  console.log('Email: admin@demo.com');
  console.log('Password: admin123');
  console.log('Hash:', adminHash);
  
  // User password: user123
  const userHash = await bcrypt.hash('user123', 10);
  console.log('\n👤 Regular User:');
  console.log('Email: user@demo.com');
  console.log('Password: user123');
  console.log('Hash:', userHash);
  
  console.log('\n✅ Copy these hashes for SQL insert!');
}

generateHashes();