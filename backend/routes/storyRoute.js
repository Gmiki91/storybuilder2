const express = require('express');
const router = express.Router();

const Story = require('../models/story');

router.get('/all', async(req,res)=>{
    const result = await Story.find();
    res.send(result);
})

router.post('/',(req,res)=>{
    const story =  Story({
        title: 'Story1',
        description: 'First story',
        language: 'de',
        level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native',
        authorId: 'mind1',
        overallRating: 0,
        lastPageAddedAt: new Date(),
        openEnded: true,
        pages: null,
        pendingPages: null
    })
    story.save();
    res.send('story created');
})

module.exports = router;