const { Campaign, User } = require('../models');

exports.getCampaigns = async (req, res, next) => {
  try {
    const { type, difficulty, is_active } = req.query;
    const where = {};

    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    // Regular users only see active campaigns
    if (req.user.role !== 'admin') {
      where.is_active = true;
    }

    const campaigns = await Campaign.findAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ campaigns });
  } catch (error) {
    next(error);
  }
};

exports.getCampaignById = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username']
        }
      ]
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Check if user can access this campaign
    if (req.user.role !== 'admin' && !campaign.is_active) {
      return res.status(403).json({ error: 'Campaign is not available' });
    }

    res.json({ campaign });
  } catch (error) {
    next(error);
  }
};

exports.createCampaign = async (req, res, next) => {
  try {
    const { title, description, type, difficulty, content, is_active } = req.body;

    const campaign = await Campaign.create({
      title,
      description,
      type,
      difficulty: difficulty || 'beginner',
      content,
      created_by: req.userId,
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const { title, description, type, difficulty, content, is_active } = req.body;

    if (title !== undefined) campaign.title = title;
    if (description !== undefined) campaign.description = description;
    if (type !== undefined) campaign.type = type;
    if (difficulty !== undefined) campaign.difficulty = difficulty;
    if (content !== undefined) campaign.content = content;
    if (is_active !== undefined) campaign.is_active = is_active;

    await campaign.save();

    res.json({
      message: 'Campaign updated successfully',
      campaign
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    await campaign.destroy();

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    next(error);
  }
};
