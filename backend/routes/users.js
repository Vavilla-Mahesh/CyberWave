const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.get('/progress', auth, userController.getProgress);
router.get('/certificates', auth, userController.getCertificates);

module.exports = router;
