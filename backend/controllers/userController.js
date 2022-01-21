const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
exports.getUser = (req, res) => {
    res.status(200).json({
        status: 'success',
        user: req.body.user
    });
}

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.body.user._id).select('active');
    user.active = false;
    await user.save();
    res.status(201).json({
        status: 'success',
        message: 'User deleted successfully'
    });
})

exports.getFavorites = catchAsync(async (req, res, next) => {
    const user = req.body.user;
    res.status(200).json({
        status: 'success',
        data: user.favoriteStoryIdList
    });
})

exports.addFavorite = catchAsync(async (req, res, next) => {
    const user = req.body.user;
    user.favoriteStoryIdList.push(req.body.storyId);
    await user.save();
    res.status(204).json({
        status: 'success',
        data: null
    });
})

exports.removeFavorite = catchAsync(async (req, res, next) => {
    const user = req.body.user;
    const index = user.favoriteStoryIdList.indexOf(req.body.storyId);
    user.favoriteStoryIdList.splice(index, 1);
    await user.save();
    res.status(204).json({
        status: 'success',
        data: null
    });
})