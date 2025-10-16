const { Result, Campaign, User, Certificate } = require('../models');
const { Op } = require('sequelize');

exports.submitResult = async (req, res, next) => {
  try {
    const { campaign_id, score, time_spent, clicked_elements, is_completed, feedback } = req.body;

    const campaign = await Campaign.findByPk(campaign_id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const result = await Result.create({
      user_id: req.userId,
      campaign_id,
      score,
      time_spent,
      clicked_elements: clicked_elements || [],
      is_completed: is_completed || false,
      feedback
    });

    // Award points based on score
    const user = await User.findByPk(req.userId);
    const pointsEarned = Math.round(parseFloat(score));
    user.points += pointsEarned;

    // Check for badge awards
    const badges = user.badges || [];
    if (parseFloat(score) >= 90 && !badges.includes('expert')) {
      badges.push('expert');
    } else if (parseFloat(score) >= 75 && !badges.includes('proficient')) {
      badges.push('proficient');
    } else if (parseFloat(score) >= 60 && !badges.includes('learner')) {
      badges.push('learner');
    }
    user.badges = badges;

    // Update completed modules
    if (is_completed) {
      const completedModules = user.completed_modules || [];
      if (!completedModules.includes(campaign.type)) {
        completedModules.push(campaign.type);
        user.completed_modules = completedModules;

        // Generate certificate
        await Certificate.findOrCreate({
          where: {
            user_id: req.userId,
            module_type: campaign.type
          }
        });
      }
    }

    await user.save();

    res.status(201).json({
      message: 'Result submitted successfully',
      result,
      pointsEarned,
      totalPoints: user.points,
      badges: user.badges
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserResults = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.userId;

    // Users can only view their own results unless admin
    if (req.user.role !== 'admin' && userId != req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const results = await Result.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Campaign,
          attributes: ['id', 'title', 'type', 'difficulty']
        }
      ],
      order: [['completed_at', 'DESC']]
    });

    res.json({ results });
  } catch (error) {
    next(error);
  }
};

exports.getCampaignResults = async (req, res, next) => {
  try {
    const results = await Result.findAll({
      where: { campaign_id: req.params.campaignId },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        },
        {
          model: Campaign,
          attributes: ['id', 'title', 'type']
        }
      ],
      order: [['score', 'DESC']]
    });

    res.json({ results });
  } catch (error) {
    next(error);
  }
};
