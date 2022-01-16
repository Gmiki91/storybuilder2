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