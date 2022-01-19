const Story = require('../models/story');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createStory = catchAsync(async (req, res, next) => {
    const story = await Story.create({
        title: req.body.title,
        description: req.body.description,
        language: req.body.language,
        level: req.body.level,
        authorId: req.body.user._id,
        rating: 0,
        updatedAt: new Date(),
        openEnded: false,
        pageIds: [],
        pendingPageIds: []
    });
    res.status(201).json({
        status: 'success',
        data: story._id
    })
})

exports.getStory = catchAsync(async (req, res, next) => {
    const story = await Story.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: story
    })
})

exports.getStories = catchAsync(async (req, res, next) => {
    const query = {};
    const sortObject = {};
    if (req.body.from === 'own') {
        //query['authorId'] = userId
    } else if (req.body.from === 'favorites') {
        //query['authorId'] = favorites
    }
    if (req.body.languages.length > 0) query['language'] = req.body.languages;
    if (req.body.levels.length > 0) query['level'] = req.body.levels;
    if (req.body.openEnded !== 'both') query['openEnded'] = req.body.openEnded;

    const { sortBy, sortDirection } = req.body;
    sortObject[sortBy] = sortDirection;

    const result = await Story
        .find(query)
        .sort(sortObject)
        .limit(50);

    res.status(200).json({
        status: 'success',
        data: result
    })
})

exports.deleteStory = catchAsync(async (req, res, next) => {
    await Story.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.rateStory = catchAsync(async (req, res, next) => {
    const story = await Story.findById(req.body.storyId);
    story.rating += req.body.difference;
    await story.save();
    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.addPage = catchAsync(async (req, res, next) => {
    const story = req.body.story;
    story.pendingPageIds = []; //removing all pending pages;
    story.pageIds.push(req.body.pageId);
    await story.save();
    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.addPendingPage = catchAsync(async (req, res, next) => {
    const story = await Story.findById(req.body.storyId);
    story.pendingPageIds.push(req.body.pageId);
    await story.save();
    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.removePendingPage = catchAsync(async (req, res, next) => {
    const story = req.body.story;
    const index = story.pendingPageIds.indexOf(req.body.pageId);
    story.pendingPageIds.splice(index, 1);
    await story.save();
    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.ownStoryCheck = catchAsync(async(req, res, next)=> {
    const story = await Story.findById(req.body.storyId);
    if(story.authorId !== req.body.user._id) return next(new AppError('You can only edit your own story.',401));
    req.body.story = story;
    next();
})