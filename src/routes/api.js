
const ProfileController = require('../controllers/ProfileController');
const express = require('express');
const router = express.Router();

// profile create
router.post('/CreateProfile', ProfileController.CreateProfile);

module.exports = router;
