const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { auth, adminAuth } = require('../middleware/auth');
const { campaignValidation } = require('../middleware/validation');

router.get('/', auth, campaignController.getCampaigns);
router.get('/:id', auth, campaignController.getCampaignById);
router.post('/', auth, adminAuth, campaignValidation, campaignController.createCampaign);
router.put('/:id', auth, adminAuth, campaignController.updateCampaign);
router.delete('/:id', auth, adminAuth, campaignController.deleteCampaign);

module.exports = router;
