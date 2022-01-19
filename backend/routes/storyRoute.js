const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const authCheck = require('../middleware/authCheck');

router
    .route('/all')
    .post(storyController.getStories)

router
    .route('/')
    .post(authCheck, storyController.createStory);

router
    .route('/page')
    .put(authCheck, storyController.ownStoryCheck, storyController.addPage)

router
    .route('/pendingPage')
    .post(storyController.addPendingPage)
    .put(authCheck, storyController.ownStoryCheck, storyController.removePendingPage)

router
    .route('/:id')
    .get(storyController.getStory)
// .delete(authCheck,storyController.deleteStory);

router
    .route('/rate')
    .put(storyController.rateStory);

module.exports = router;