const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/dashboard', auth, analyticsController.getDashboardAnalytics);
router.get('/heatmap/:campaignId', auth, adminAuth, analyticsController.getHeatmapData);
router.get('/leaderboard', auth, analyticsController.getLeaderboard);
router.get('/reports', auth, adminAuth, analyticsController.generateReport);

module.exports = router;
