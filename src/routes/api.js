
const TodoListController=require('../controllers/TodoListController')
const ProfileController = require('../controllers/ProfileController');
const AuthVerifyMiddleware=require('../middlewares/AuthVerifyMiddleware')

const express = require('express');
const router = express.Router();

// profile create
router.post('/CreateProfile', ProfileController.CreateProfile);//user registration
router.post('/UserLogin',ProfileController.UserLogin);//user login


router.get('/SelectProfile', AuthVerifyMiddleware, ProfileController.SelectProfile);//select profile
router.post('/UpdateProfile',AuthVerifyMiddleware,ProfileController.UpdateProfile);//


router.post('/CreateTodo',AuthVerifyMiddleware,TodoListController.CreateToDoList);//
router.get('/SelectToDo',AuthVerifyMiddleware,TodoListController.SelectToDo);

router.post('/UpdateToDo',AuthVerifyMiddleware,TodoListController.UpdateToDo);
router.post('/UpdateToDoStatus',AuthVerifyMiddleware,TodoListController.UpdateToDoStatus);


module.exports = router;
