const Story = require('../models/story');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const wilson = require('wilson-score-interval');
const saveVote = require('../utils/vote');
exports.createStory = catchAsync(async (req, res, next) => {
    const story = await Story.create({
        title: req.body.title,
        description: req.body.description,
        language: req.body.language,
        level: req.body.level,
        authorId: req.body.user._id,
        authorName: req.body.user.name,
        ratings: [],
        upVotes: 0,
        ratingAvg: 0,
        updatedAt: new Date(),
        openEnded: false,
        pageIds: [],
        pendingPageIds: []
    });
    res.status(201).json({
        status: 'success',
        story: mappedStory(story)
    })
})

exports.getStory = catchAsync(async (req, res, next) => {
    const story = await Story.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        story: mappedStory(story)
    })
})

exports.getStories = catchAsync(async (req, res, next) => {
    const { sortBy, sortDirection,storyName,languages,levels,openEnded,from,user } = req.body;
    const query = {};
    const sortObject = {};
    
    if (from === 'own')  query['authorId'] = user._id
    else if (from === 'favorite') query['_id'] ={ $in: user.favoriteStoryIdList};

    if (storyName.length > 2) query['title'] = { $regex:new RegExp(`${storyName}`, 'i')};
    if (languages.length > 0) query['language'] = languages;
    if (levels.length > 0) query['level'] = levels;
    if (openEnded !== 'both') query['openEnded'] = openEnded;
console.log(query['title'])
    sortObject[sortBy] = sortDirection;

    const result = await Story
        .find(query)
        .sort(sortObject);

    const mappedResult = result.map(story => ({ ...mappedStory(story), key: story._id }))
    res.status(200).json({
        status: 'success',
        stories: mappedResult
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
    const { user, storyId, vote } = req.body;
    const story = await Story.findById(storyId);
    const updatedStory = await saveVote(user._id.toString(), vote, story);
    updateRateValues(story);
    updatedStory.save();
    res.status(201).json({
        status: 'success'
    })
})


exports.addPage = catchAsync(async (req, res, next) => {
    const { story, pageId, pageRatings } = req.body;
    story.pendingPageIds = []; //removing all pending pages;
    story.pageIds.push(pageId);

    if (pageRatings.length > 0) {
        story.ratings.push(pageRatings);
        updateRateValues(story);
    }
    await story.save();
    res.status(200).json({
        status: 'success',
        story: mappedStory(story)
    })
})

exports.addPendingPage = catchAsync(async (req, res, next) => {
    const story = await Story.findById(req.body.storyId);
    story.pendingPageIds.push(req.body.pageId);
    await story.save();
    res.status(200).json({
        status: 'success',
        story: mappedStory(story)
    })
})

exports.removePendingPage = catchAsync(async (req, res, next) => {
    const story = req.body.story;
    const index = story.pendingPageIds.indexOf(req.body.pageId);
    story.pendingPageIds.splice(index, 1);
    await story.save();
    res.status(200).json({
        status: 'success',
        story: mappedStory(story)
    })
})

exports.ownStoryCheck = catchAsync(async (req, res, next) => {
    const story = await Story.findById(req.body.storyId);
    if (story.authorId !== req.body.user._id.toString()) return next(new AppError('You can only edit your own story.', 401));
    req.body.story = story;
    next();
})

const updateRateValues = (story) => {
    story.upVotes = story.ratings
        .filter(rating => rating.rate === 1)
        .reduce((sum, rating) => sum + rating.rate, 0)
    const totalVotes = story.ratings.length;
    const { left, right } = wilson(story.upVotes, totalVotes);
    story.ratingAvg = left;
}


const mappedStory = story => {
    const { ratings, ...props } = story.toObject();
    return ({
        ...props,
        rating: {
            positive: story.upVotes,
            total: story.ratings.length,
            average: getAverageRateInText(story.ratingAvg)
        }
    });
}

const getAverageRateInText = (rate) => {
    if (rate >= 0.80) return 'Excellent';
    if (rate < 0.80 && rate >= 0.60) return 'Good';
    if (rate < 0.60 && rate >= 0.40) return 'Mixed';
    if (rate < 0.40 && rate >= 0.20) return 'Bad';
    if (rate < 0.20) return 'Terrible';
}