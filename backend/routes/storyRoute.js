const express = require('express');
const router = express.Router();

const Story = require('../models/story');

router.post('/modifiedList', async (req, res) => {
    const query ={};
    if(req.body.from==='own'){
        //query['authorId'] = userId
    }else if(req.body.from==='favorites'){
        //query['authorId'] = favorites
    }
    if(req.body.languages.length>0) query['language']=req.body.languages;
    if(req.body.level.length>0)query['level']= req.body.level;
    if(req.body.openEnded!=='both')query['openEnded']=req.body.openEnded;
    
    const sortBy = req.body.sortBy
    const sortDirection = req.body.sortDirection;
    const sortObject = {};
    sortObject[sortBy] = sortDirection;
    console.log(query);
    const result = await Story
        .find(query)
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

router.delete('/:id', async (req, res) => {
    Story.findByIdAndDelete(req.params.id).then(() => res.send('deleted'));
})

module.exports = router;