const User = require('../models/user');

exports.signup = async(req,res)=>{
    const user = User({
        email: req.body.email,
        password: req.body.password,
        languages: null,
        storyIdList: null,
        pageIdList:null,
        favoriteStoryIdList:null,
        writerRating: 0,
        translatorRating: 0
    });
    await user.save();
    res.status(200).json({data: user});
}