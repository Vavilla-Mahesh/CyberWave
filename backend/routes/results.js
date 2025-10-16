const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { auth, adminAuth } = require('../middleware/auth');
const { resultValidation } = require('../middleware/validation');

router.post('/', auth, resultValidation, resultController.submitResult);
router.get('/user/:userId', auth, resultController.getUserResults);
router.get('/campaign/:campaignId', auth, adminAuth, resultController.getCampaignResults);

module.exports = router;
