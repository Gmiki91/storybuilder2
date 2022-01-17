const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');
const authCheck = require('../middleware/authCheck');

router
    .route('/all')
    .post(storyController.getStories)

router
    .route('/')
    .post(authCheck, storyController.createStory);

router
    .route('/addPage')
    .post(storyController.addPage)
    .put(storyController.addPendingPage);

router
    .route('/addPendingPage')
    .post(storyController.addPendingPage);

router
    .route('/:id')
    .get(storyController.getStory)
    .delete(storyController.deleteStory);

router
    .route('/rate')
    .put(storyController.rateStory);

module.exports = router;