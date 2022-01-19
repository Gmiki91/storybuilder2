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
    .get(authCheck, userController.getUserId)
    .put(authCheck, userController.addStoryId)
    .post(authCheck, userController.addPageId);

router
    .route('/favorites')
    .get(authCheck, userController.getFavorites)
    .post(authCheck, userController.addFavorite)
    .put(authCheck, userController.removeFavorite);
    
module.exports = router;
