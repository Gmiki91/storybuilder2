const User = require('../models/user');

exports.addStoryId = async (req, res) => {
    const user = await User.findById(req.body.authorId).select('+password');
    user.storyIdList.push(req.body.storyId);
    await user.save();
    res.status(200).send('ok');
}
exports.addPageId = async (req, res) => {
    const user = await User.findById(req.body.authorId).select('+password');
    user.pageIdList.push(req.body.storyId);
    await user.save();
    res.status(200).send('ok');
}

exports.getUserId = async (req, res) => {
    const user = await User.findById(req.body.authorId).select('+password');
    res.status(200).json(user._id);
}

exports.getFavorites = async (req, res) => {
    const user = await User.findById(req.body.authorId).select('+password');
    res.status(200).json(user.favoriteStoryIdList);

}

exports.addFavorite= async (req, res) => {
    const user = await User.findById(req.body.authorId).select('+password');
    user.favoriteStoryIdList.push(req.body.storyId);
    await user.save();
    res.status(200).json({message:'done'});
}

exports.removeFavorite= async (req, res) => {
    const user = await User.findById(req.body.authorId).select('+password');
    const index = user.favoriteStoryIdList.indexOf(req.body.storyId);
    user.favoriteStoryIdList.splice(index,1);
    await user.save();
    res.status(200).json({message:'done'});
}