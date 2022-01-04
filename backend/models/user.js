const mongoose = require('mongoose');

const user = mongoose.Schema({
    languages: [{
        code: String,
        level: String
    }],
    storyIdList: [String],
    pageIdList: [String],
    translationIdList: [String],
    canAddToOwnStory: Boolean,
    writerRating: Number,
    translatorRating: Number
}, {collection:'users'})

module.exports=mongoose.model('User',user);