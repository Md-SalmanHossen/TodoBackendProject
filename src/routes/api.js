
const ProfileController = require('../controllers/ProfileController');
const AuthVerifyMiddleware=require('../middlewares/AuthVerifyMiddleware')

const express = require('express');
const router = express.Router();

// profile create
router.post('/CreateProfile', ProfileController.CreateProfile);//user registration
router.post('/UserLogin',ProfileController.UserLogin);//user login
router.get('/SelectProfile',AuthVerifyMiddleware,ProfileController.SelectProfile);

module.exports = router;
