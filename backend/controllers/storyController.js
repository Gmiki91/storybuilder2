const Story = require('../models/story');
const catchAsync = require('../utils/catchAsync')

exports.createStory = catchAsync(async (req, res, next) => {
    const story = await Story.create({
        title: req.body.title,
        description: req.body.description,
        language: req.body.language,
        level: req.body.level,
        authorId: req.body.authorId,
        rating: 0,
        updatedAt: new Date(),
        openEnded: false,
        pageIds: [],
        pendingPageIds: []
    });
    res.status(201).json({
        status: 'success',
        data:story._id
    })
})

exports.getStory=catchAsync(async (req, res, next) => {
    const story = await Story.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data:story
    })
})

exports.getStories =  catchAsync(async (req, res, next) => {
    const query ={};
    if(req.body.from==='own'){
        //query['authorId'] = userId
    }else if(req.body.from==='favorites'){
        //query['authorId'] = favorites
    }
    if(req.body.languages.length>0) query['language']=req.body.languages;
    if(req.body.levels.length>0)query['level']= req.body.levels;
    if(req.body.openEnded!=='both')query['openEnded']=req.body.openEnded;
    
    const {sortBy, sortDirection} = req.body;
    const sortObject = {};
    sortObject[sortBy] = sortDirection;
    const result = await Story
        .find(query)
        .sort(sortObject)
        .limit(50);

    res.status(200).json({
        status: 'success',
        data:result
    })
})

exports.deleteStory = catchAsync(async(req, res,next) => {
    await Story.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data:null
    })
})

exports.rateStory = catchAsync(async (req, res, next) => {
    const story = await Story.findById(req.body.storyId);
    story.rating += req.body.difference;
    await story.save();
    res.status(204).json({
        status: 'success',
        data:null
    })
})

exports.addPage = catchAsync(async (req, res, next) => {
    const story =  await Story.findById(req.body.storyId);
    story.pendingPageIds = []; //removing all pending pages;
    story.pageIds.push(req.body.pageId);
    await story.save();
    res.status(204).json({
        status: 'success',
        data:null
    })
})

exports.addPendingPage =catchAsync( async (req, res, next) => {
    const story = await Story.findById(req.body.storyId);
    story.pendingPageIds.push(req.body.pageId);
    await story.save();
    res.status(204).json({
        status: 'success',
        data:null
    })
})

exports.removePendingPage =catchAsync(async (req, res, next) => {
    const story =  await Story.findById(req.body.storyId);
    const index = story.pendingPageIds.indexOf(req.body.pageId);
    story.pendingPageIds.splice(index, 1);
    await story.save();
     res.status(204).json({
        status: 'success',
        data:null
    })
})