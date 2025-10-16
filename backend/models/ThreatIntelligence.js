const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ThreatIntelligence = sequelize.define('ThreatIntelligence', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  source: {
    type: DataTypes.STRING(50),
    comment: 'PhishTank, OpenPhish, URLhaus, VirusTotal'
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  threat_type: {
    type: DataTypes.STRING(100)
  },
  threat_level: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical')
  },
  description: {
    type: DataTypes.TEXT
  },
  detected_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'threat_intelligence',
  indexes: [
    {
      fields: ['source']
    },
    {
      fields: ['threat_level']
    }
  ]
});

module.exports = ThreatIntelligence;
