const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');

router
    .route('/all')
    .post(storyController.getStories)

router
    .route('/')
    .post(storyController.createStory);

router
    .route('/addPage')
    .post(storyController.addPage);

router
    .route('/:id')
    .get(storyController.getStory)
    .delete(storyController.deleteStory);

router
    .route('/rate')
    .put(storyController.rateStory);

module.exports = router;