const express = require('express');
const router = express.Router();

const Story = require('../models/story');

router.post('/all', async (req, res) => {
    const query ={};
    if(req.body.from==='own'){
        //query['authorId'] = userId
    }else if(req.body.from==='favorites'){
        //query['authorId'] = favorites
    }
    if(req.body.languages.length>0) query['language']=req.body.languages;
    if(req.body.levels.length>0)query['level']= req.body.levels;
    if(req.body.openEnded!=='both')query['openEnded']=req.body.openEnded;
    
    const sortBy = req.body.sortBy
    const sortDirection = req.body.sortDirection;
    const sortObject = {};
    sortObject[sortBy] = sortDirection;
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
        pageIds: [],
        pendingPageIds: null
    });
    await story.save();
    res.send('story created');
})

router.post('/addPage', async (req, res) => {
    const story = await Story.findById(req.body.storyId);
    story.pageIds.push(req.body.pageId);
    await story.save();
    res.status(200).send('saved');
})
router.get('/:id', async (req, res) => {
    const story = await Story.findById(req.params.id);
    res.status(200).json(story);

})
router.delete('/:id',  (req, res) => {
    Story.findByIdAndDelete(req.params.id).then(() => res.send('deleted'));
})

module.exports = router;