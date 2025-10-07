// backend/db-test.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('Testing database connection...');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres'
  }
);

async function test() {
  try {
    await sequelize.authenticate();
    console.log('✅ SUCCESS! Database connected!');
    process.exit(0);
  } catch (error) {
    console.log('❌ FAILED:', error.message);
    process.exit(1);
  }
}

test();