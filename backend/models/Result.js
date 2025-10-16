const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Result = sequelize.define('Result', {
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
  campaign_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'campaigns',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  time_spent: {
    type: DataTypes.INTEGER,
    comment: 'Time spent in seconds'
  },
  clicked_elements: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  feedback: {
    type: DataTypes.TEXT
  },
  completed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'results',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['campaign_id']
    }
  ]
});

module.exports = Result;
