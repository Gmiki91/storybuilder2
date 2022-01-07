const User = require('../models/user');
const Router = require('../routes/storyRoute');

Router.get('/', (req,res)=>{
    const user = User({
        languages: null,
        storyIdList: null,
        pageIdList:null,
        translationIdList: null,
        favoriteStoryIdList:null,
        canAddToOwnStory: true,
        writerRating: 0,
        translatorRating: 0
    });
    user.save();
    res.send('user saved');
})

module.exports =Router;
