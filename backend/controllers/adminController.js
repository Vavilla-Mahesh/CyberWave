const { User, Campaign, Result, Certificate } = require('../models');
const { fn, col } = require('sequelize');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Result,
          attributes: []
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ users });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { role, points, badges } = req.body;

    if (role) user.role = role;
    if (points !== undefined) user.points = points;
    if (badges) user.badges = badges;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        points: user.points,
        badges: user.badges
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.id === req.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getStatistics = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalCampaigns = await Campaign.count();
    const totalResults = await Result.count();
    const completedResults = await Result.count({ where: { is_completed: true } });
    const totalCertificates = await Certificate.count();

    const avgScore = await Result.findOne({
      attributes: [[fn('AVG', col('score')), 'average']]
    });

    const topUsers = await User.findAll({
      attributes: ['id', 'username', 'points', 'badges'],
      order: [['points', 'DESC']],
      limit: 5
    });

    const campaignsByType = await Campaign.findAll({
      attributes: [
        'type',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['type']
    });

    const recentActivity = await Result.findAll({
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Campaign,
          attributes: ['title', 'type']
        }
      ],
      order: [['completed_at', 'DESC']],
      limit: 10
    });

    res.json({
      totalUsers,
      totalCampaigns,
      totalResults,
      completedResults,
      totalCertificates,
      avgScore: parseFloat(avgScore.getDataValue('average') || 0).toFixed(2),
      topUsers,
      campaignsByType,
      recentActivity
    });
  } catch (error) {
    next(error);
  }
};
