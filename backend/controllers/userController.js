const User = require('../models/user');

exports.addStoryId = async (req, res) => {
    const user = await User.findById(req.body.authorId);
    user.storyIdList.push(req.body.storyId);
    await user.save();
    res.status(200).send('ok');
}