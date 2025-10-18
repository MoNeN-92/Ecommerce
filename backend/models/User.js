// backend/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING(100), 
    allowNull: false, 
    unique: true, 
    validate: { isEmail: true } 
  },
  password: { 
    type: DataTypes.STRING(255), 
    allowNull: true // ⚡ OAuth users may not have password
  },
  role: { 
    type: DataTypes.ENUM('admin', 'customer'), 
    defaultValue: 'customer' 
  },
  // ✅ NEW FIELDS
  first_name: { 
    type: DataTypes.STRING(50), 
    allowNull: true 
  },
  last_name: { 
    type: DataTypes.STRING(50), 
    allowNull: true 
  },
  phone: { 
    type: DataTypes.STRING(20), 
    allowNull: true 
  },
  address: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  profile_image: { 
    type: DataTypes.STRING(500), 
    allowNull: true, 
    defaultValue: null 
  },
  // ✅ OAuth fields
  provider: {
    type: DataTypes.ENUM('local', 'google', 'facebook'),
    defaultValue: 'local'
  },
  provider_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  avatar_url: { 
    type: DataTypes.STRING(500), 
    allowNull: true 
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

User.prototype.matchPassword = async function(enteredPassword) {
  // OAuth users might not have password
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;