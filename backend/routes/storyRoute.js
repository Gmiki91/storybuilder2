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
    .route('/page')
    .put(storyController.addPage)

router
    .route('/pendingPage')
    .post(storyController.addPendingPage)
    .put(storyController.removePendingPage)

router
    .route('/:id')
    .get(storyController.getStory)
    .delete(storyController.deleteStory);

router
    .route('/rate')
    .put(storyController.rateStory);

module.exports = router;