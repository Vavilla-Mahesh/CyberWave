const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/users', auth, adminAuth, adminController.getAllUsers);
router.put('/users/:id', auth, adminAuth, adminController.updateUser);
router.delete('/users/:id', auth, adminAuth, adminController.deleteUser);
router.get('/statistics', auth, adminAuth, adminController.getStatistics);

module.exports = router;
