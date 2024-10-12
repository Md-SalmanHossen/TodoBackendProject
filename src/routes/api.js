
const ProfileController = require('../controllers/ProfileController');
const express = require('express');
const router = express.Router();

// profile create
router.post('/CreateProfile', ProfileController.CreateProfile);
router.post('/UserLogin',ProfileController.UserLogin);

module.exports = router;
