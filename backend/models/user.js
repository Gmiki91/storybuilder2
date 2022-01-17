const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const user = mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:true,
        required:[true, 'Please enter your email address'],
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        select:false
    },
    languages: [{
        code: String,
        level: String
    }],
    storyIdList: [String],
    pageIdList: [String],
    favoriteStoryIdList:[String],
    writerRating: Number,
}, {collection:'users'})

user.pre('save', async function(next)  {
    this.password= await bcrypt.hash(this.password,12);
    next();
})
user.methods.correctPassword= async function(candidatePw, userPw){
    return await bcrypt.compare(candidatePw,userPw)
}
module.exports=mongoose.model('User',user);