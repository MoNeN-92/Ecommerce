const { DataTypes } = require('sequelize');
const  sequelize  = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'customer'), defaultValue: 'customer' },
  phone: { type: DataTypes.STRING(20), allowNull: true },
  profile_image: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  avatar_url: { type: DataTypes.STRING(255), allowNull: true }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;