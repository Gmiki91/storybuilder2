const mongoose = require('mongoose');
const user = mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:[true, 'Please enter your email address'],
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    languages: [{
        code: String,
        level: String
    }],
    storyIdList: [String],
    pageIdList: [String],
    favoriteStoryIdList:[String],
    writerRating: Number,
    translatorRating: Number
}, {collection:'users'})

module.exports=mongoose.model('User',user);