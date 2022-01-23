const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authCheck = require('../middleware/authCheck');

router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.post('/loginGoogle',authController.loginGoogle);

router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:resetToken',authController.resetPassword);

router.patch('/updatePassword',authCheck, authController.updatePassword);

router
    .route('/')
    .get(authCheck, userController.getUser)
    .patch(authCheck, userController.deleteUser);

router
    .route('/favorites')
    .get(authCheck, userController.getFavorites)
    .post(authCheck, userController.addFavorite)
    .put(authCheck, userController.removeFavorite);
    
module.exports = router;
