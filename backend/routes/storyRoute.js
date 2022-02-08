const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const authCheck = require('../middleware/authCheck');

router.post('/',authCheck, storyController.createStory);
router.post('/all',authCheck,storyController.getStories);
router.get('/all/:authorId',authCheck,storyController.getStoryDataByAuthor);

router.put('/rate',authCheck,storyController.rateStory);
router.put('/page',authCheck, storyController.ownStoryCheck, storyController.addPage);

router
    .route('/pendingPage')
    .post(authCheck,storyController.addPendingPage)
    .put(authCheck, storyController.ownStoryCheck, storyController.removePendingPage)

router
    .route('/:id')
    .get(storyController.getStory)
    .delete(authCheck,storyController.deleteStory);

module.exports = router;