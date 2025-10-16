const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  module_type: {
    type: DataTypes.ENUM('email', 'sms', 'qr', 'social'),
    allowNull: false
  },
  certificate_id: {
    type: DataTypes.UUID,
    unique: true,
    defaultValue: () => uuidv4()
  },
  issued_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'certificates',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'module_type']
    },
    {
      unique: true,
      fields: ['certificate_id']
    }
  ]
});

module.exports = Certificate;
