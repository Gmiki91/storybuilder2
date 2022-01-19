const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const authCheck = require('../middleware/authCheck');

router.post('/all',storyController.getStories)
router.post('/',authCheck, storyController.createStory);
router.put('/page',authCheck, storyController.ownStoryCheck, storyController.addPage);
router.put('/rate',storyController.rateStory);

router
    .route('/pendingPage')
    .post(storyController.addPendingPage)
    .put(authCheck, storyController.ownStoryCheck, storyController.removePendingPage)

router
    .route('/:id')
    .get(storyController.getStory)
    .delete(authCheck,storyController.deleteStory);



module.exports = router;