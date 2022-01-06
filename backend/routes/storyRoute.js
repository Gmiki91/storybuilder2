const express = require('express');
const router = express.Router();

const Story = require('../models/story');

router.get('/all', async (req, res) => {
    const result = await Story
        .find()
        .sort({rating: 'descending'});
    res.send(result);
})

router.post('/', async (req, res) => {
    const story = Story({
        title: req.body.title,
        description: req.body.description,
        language: req.body.language,
        level: req.body.targetLevel,
        authorId: '?',
        overallRating: 0,
        updatedAt: new Date(),
        openEnded: false,
        pages: null,
        pendingPages: null
    });
    await story.save();
    res.send('story created');
})

module.exports = router;