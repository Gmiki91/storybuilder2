const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authCheck = require('../middleware/authCheck');

router
    .route('/signup')
    .post(authController.signup);

router
    .route('/login')
    .post(authController.login);

router
.route('/')
.put(authCheck,userController.addStoryId)

module.exports = router;
