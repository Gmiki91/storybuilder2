const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')

exports.addStoryId = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.body.authorId).select('+password');
    user.storyIdList.push(req.body.storyId);
    await user.save();
    res.status(204).json({
        status: 'success',
        data: null
    });
})

exports.addPageId = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.body.authorId).select('+password');
    user.pageIdList.push(req.body.storyId);
    await user.save();
    res.status(204).json({
        status: 'success',
        data: null
    });
})

exports.getUserId = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: req.body.authorId
    });
}


    exports.getFavorites = catchAsync(async (req, res, next) => {
        const user = await User.findById(req.body.authorId).select('+password');
        res.status(200).json({
            status: 'success',
            data: user.favoriteStoryIdList
        });
    })

    exports.addFavorite = catchAsync(async (req, res, next) => {
        const user = await User.findById(req.body.authorId).select('+password');
        user.favoriteStoryIdList.push(req.body.storyId);
        await user.save();
        res.status(204).json({
            status: 'success',
            data: null
        });
    })

    exports.removeFavorite = catchAsync(async (req, res, next) => {
        const user = await User.findById(req.body.authorId).select('+password');
        const index = user.favoriteStoryIdList.indexOf(req.body.storyId);
        user.favoriteStoryIdList.splice(index, 1);
        await user.save();
        res.status(204).json({
            status: 'success',
            data: null
        });
    })