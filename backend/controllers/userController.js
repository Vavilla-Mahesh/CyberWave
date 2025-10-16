const { User, Certificate, Result, Campaign } = require('../models');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        points: user.points
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProgress = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'username', 'points', 'badges', 'completed_modules'],
      include: [
        {
          model: Result,
          attributes: ['campaign_id', 'score', 'is_completed', 'completed_at'],
          include: [
            {
              model: Campaign,
              attributes: ['title', 'type', 'difficulty']
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const moduleProgress = {
      email: { completed: 0, total: 0, avgScore: 0 },
      sms: { completed: 0, total: 0, avgScore: 0 },
      qr: { completed: 0, total: 0, avgScore: 0 },
      social: { completed: 0, total: 0, avgScore: 0 }
    };

    user.Results.forEach(result => {
      const type = result.Campaign.type;
      moduleProgress[type].total += 1;
      if (result.is_completed) {
        moduleProgress[type].completed += 1;
        moduleProgress[type].avgScore += parseFloat(result.score);
      }
    });

    Object.keys(moduleProgress).forEach(key => {
      if (moduleProgress[key].completed > 0) {
        moduleProgress[key].avgScore = 
          (moduleProgress[key].avgScore / moduleProgress[key].completed).toFixed(2);
      }
    });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        points: user.points,
        badges: user.badges,
        completed_modules: user.completed_modules
      },
      progress: moduleProgress,
      recentResults: user.Results.slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
};

exports.getCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: User,
          attributes: ['username', 'email']
        }
      ]
    });

    res.json({ certificates });
  } catch (error) {
    next(error);
  }
};
