const Page = require('../models/page');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getPage = catchAsync(async (req, res, next) => {
    const page = await Page.findById(req.params.id);

    if (!page) return next(new AppError(`No page found with ID ${req.params.id}`, 404))
    res.status(200).json({
        status: 'success',
        page: mappedPage(page)
    })
})


exports.createPage = catchAsync(async (req, res, next) => {
    const page = await Page.create({
        text: req.body.text,
        levels: [{ userId: '', rate: mapRateStringToNum(req.body.level) }],
        language: req.body.language,
        authorId: req.body.user._id,
        authorName:req.body.user.name,
        storyId: req.body.storyId,
        ratings: req.body.rating
    });
    res.status(201).json({
        status: 'success',
        pageId: page._id
    })
})

exports.rateText = catchAsync(async (req, res, next) => {
    const page = await Page.findById(req.body.pageId);

    if (!page) return next(new AppError(`No page found with ID ${req.body.pageId}`, 404))

    const { vote } = req.body;
    let difference;

    const originalVote = page.ratings.find(rate => rate.userId === req.body.user._id.toString());
    if (vote === 0) { // there was a previous vote which has been cancelled
        difference = -originalVote.rate;
        const index = page.ratings.indexOf(originalVote);
        page.ratings.splice(index, 1);
    } else if (Math.abs(vote) === 1) { // there was no previous vote
        difference = vote;
        page.ratings.push({ userId: req.body.user._id, rate: vote })
    } else { // there was a previous vote, the opposite of current vote (Math.abs(vote) === 2)
        difference = -2 * originalVote.rate;
        originalVote.rate = -originalVote.rate
    }

    await page.save();
    res.status(201).json({
        status: 'success',
        newPage: mappedPage(page),
        difference
    })
})

exports.rateLevel = catchAsync(async (req, res, next) => {
    const page = await Page.findById(req.body.pageId);

    if (!page) return next(new AppError(`No page found with ID ${req.body.pageId}`, 404))

    const rate = mapRateStringToNum(req.body.rate);
    const vote = page.levels.find(level => level.userId === req.body.user._id.toString());
    vote ? vote.rate = rate : page.levels.push({ userId: req.body.user._id, rate: rate });
    await page.save();
    res.status(204).json({
        status: 'success',
        updatedPage:mappedPage(page)
    });
})

exports.deletePage = catchAsync(async (req, res, next) => {
    const page = await Page.findById(req.params.id);
    if (!page) return next(new AppError(`No page found with ID ${req.params.id}.`, 404));
    if (req.body.user._id.toString() !== page.authorId) return next(new AppError('You can only delete pages from your own story.', 401));

    await Page.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });
})


exports.deletePendingPages = catchAsync(async (req, res, next) => {
    const ids = req.params.ids.split(',');
    const pages = await Page.find({ _id: { $in: ids } });
    const otherPage = pages.find(page => req.body.user._id.toString() !== page.authorId);

    if (otherPage) return next(new AppError(`Page ${otherPage._id} is not yours to delete.`));

    await Page.deleteMany({ _id: { $in: ids } });
    res.status(204).json({
        status: 'success',
        data: null
    });
})

const mappedPage = page => {
    return {
        ...page.toObject(),
        level: mapRateNumToString(page.levels
            .reduce((sum, level) => sum + level.rate, 0) / page.levels.length)
    }
};


const mapRateNumToString = (rate) => {
    if (rate < 1.5) return 'A';
    if (rate >= 1.5 && rate < 2.5) return 'A+';
    if (rate >= 2.5 && rate < 3.5) return 'B';
    if (rate >= 3.5 && rate < 4.5) return 'B+';
    if (rate >= 4.5 && rate < 5.5) return 'C';
    if (rate >= 5.5) return 'N';
}

const mapRateStringToNum = (rate) => {
    switch (rate) {
        case 'A': return 1;
        case 'A+': return 2;
        case 'B': return 3;
        case 'B+': return 4;
        case 'C': return 5;
        case 'N': return 6;
    }
}