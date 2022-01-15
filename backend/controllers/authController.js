const jwt = require('jsonwebtoken');
const User = require('../models/user');

const signToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRATION});
}

exports.signup = async(req,res)=>{
    const user = await User.create({
        email: req.body.email,
        password: req.body.password,
        languages: null,
        storyIdList: null,
        pageIdList:null,
        favoriteStoryIdList:null,
        writerRating: 0,
        translatorRating: 0
    });
    const token = signToken(user._id);
    res.status(200).json({data: user, token:token});
}

exports.login= async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email}).select('+password');
    if(!user || !(await user.correctPassword(password, user.password))){
        return res.send('bukó')
    }

    const token = signToken(user._id);
    res.status(200).json({
        status:'success',
        token: token
    })
    
}