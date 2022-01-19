const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const user = mongoose.Schema({
    name:{ 
        type:String,
        unique:true,
        required:[true, 'Please enter your name'],
    },
    email:{
        type:String,
        unique:true,
        required:[true, 'Please enter your email address'],
    },
    password:{
        type:String,
        minLength:6,
        select:false,
        required:[true, 'Please enter your password'],
    },
    passwordChangedAt:Date,
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
   // this.password= await bcrypt.hash(this.password,12);
    next();
})
user.methods.correctPassword= async function(candidatePw, userPw){
    return await bcrypt.compare(candidatePw,userPw)
}
user.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTTimestamp<changedTimeStamp;
    }
    return false;
}
module.exports=mongoose.model('User',user);