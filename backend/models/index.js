const sequelize = require('../config/database');
const User = require('./User');
const Campaign = require('./Campaign');
const Result = require('./Result');
const Certificate = require('./Certificate');
const ThreatIntelligence = require('./ThreatIntelligence');

// Define relationships
User.hasMany(Result, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Certificate, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Campaign, { foreignKey: 'created_by', onDelete: 'SET NULL' });

Campaign.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Campaign.hasMany(Result, { foreignKey: 'campaign_id', onDelete: 'CASCADE' });

Result.belongsTo(User, { foreignKey: 'user_id' });
Result.belongsTo(Campaign, { foreignKey: 'campaign_id' });

Certificate.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Campaign,
  Result,
  Certificate,
  ThreatIntelligence
};
