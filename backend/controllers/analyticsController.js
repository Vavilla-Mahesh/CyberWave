const { User, Result, Campaign, Certificate } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.role === 'admin' ? null : req.userId;

    const where = userId ? { user_id: userId } : {};

    const totalResults = await Result.count({ where });
    const completedResults = await Result.count({
      where: { ...where, is_completed: true }
    });

    const avgScore = await Result.findOne({
      where,
      attributes: [[fn('AVG', col('score')), 'average']]
    });

    const moduleStats = await Result.findAll({
      where,
      attributes: [
        [fn('COUNT', col('Result.id')), 'count'],
        [fn('AVG', col('score')), 'avg_score']
      ],
      include: [
        {
          model: Campaign,
          attributes: ['type']
        }
      ],
      group: ['Campaign.type', 'Campaign.id']
    });

    const recentActivity = await Result.findAll({
      where,
      include: [
        {
          model: Campaign,
          attributes: ['title', 'type']
        },
        {
          model: User,
          attributes: ['username']
        }
      ],
      order: [['completed_at', 'DESC']],
      limit: 10
    });

    res.json({
      totalResults,
      completedResults,
      avgScore: parseFloat(avgScore.getDataValue('average') || 0).toFixed(2),
      moduleStats,
      recentActivity
    });
  } catch (error) {
    next(error);
  }
};

exports.getHeatmapData = async (req, res, next) => {
  try {
    const results = await Result.findAll({
      where: { campaign_id: req.params.campaignId },
      attributes: ['clicked_elements']
    });

    const clickMap = {};
    results.forEach(result => {
      const elements = result.clicked_elements || [];
      elements.forEach(element => {
        const key = JSON.stringify(element);
        clickMap[key] = (clickMap[key] || 0) + 1;
      });
    });

    const heatmapData = Object.entries(clickMap).map(([element, count]) => ({
      element: JSON.parse(element),
      clicks: count
    }));

    res.json({ heatmapData });
  } catch (error) {
    next(error);
  }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.findAll({
      attributes: ['id', 'username', 'points', 'badges', 'completed_modules'],
      order: [['points', 'DESC']],
      limit
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      points: user.points,
      badges: user.badges,
      modulesCompleted: user.completed_modules.length
    }));

    res.json({ leaderboard });
  } catch (error) {
    next(error);
  }
};

exports.generateReport = async (req, res, next) => {
  try {
    const { startDate, endDate, type } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.completed_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const results = await Result.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['username', 'email']
        },
        {
          model: Campaign,
          attributes: ['title', 'type', 'difficulty']
        }
      ],
      order: [['completed_at', 'DESC']]
    });

    const report = {
      generatedAt: new Date(),
      period: { startDate, endDate },
      totalResults: results.length,
      avgScore: results.reduce((sum, r) => sum + parseFloat(r.score), 0) / results.length || 0,
      results: results.map(r => ({
        user: r.User.username,
        campaign: r.Campaign.title,
        type: r.Campaign.type,
        difficulty: r.Campaign.difficulty,
        score: r.score,
        timeSpent: r.time_spent,
        completed: r.is_completed,
        completedAt: r.completed_at
      }))
    };

    if (type === 'csv') {
      // Convert to CSV format
      const csv = [
        'User,Campaign,Type,Difficulty,Score,Time Spent,Completed,Completed At',
        ...report.results.map(r => 
          `${r.user},${r.campaign},${r.type},${r.difficulty},${r.score},${r.timeSpent},${r.completed},${r.completedAt}`
        )
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
      return res.send(csv);
    }

    res.json({ report });
  } catch (error) {
    next(error);
  }
};
