const express = require('express');
const router = express.Router();

const Story = require('../models/story');

router.get('/:sortBy/:direction', async (req, res) => {
    const sortBy = req.params.sortBy
    const sortDirection = req.params.direction;
    const sortObject = {};
    sortObject[sortBy] = sortDirection;
    const result = await Story
        .find()
        .sort(sortObject)
        .limit(50);
    res.send(result);
})

router.post('/', async (req, res) => {
    const story = Story({
        title: req.body.title,
        description: req.body.description,
        language: req.body.language,
        level: req.body.targetLevel,
        authorId: '?',
        rating: 0,
        updatedAt: new Date(),
        openEnded: false,
        pages: null,
        pendingPages: null
    });
    await story.save();
    res.send('story created');
})

module.exports = router;