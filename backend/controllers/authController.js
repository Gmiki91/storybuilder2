const jwt = require('jsonwebtoken');
const User = require('../models/user');

const signToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET);
}

exports.signup = async(req,res)=>{
    const user = await User.create({
        email: req.body.email,
        password: req.body.password,
        languages: null,
        storyIdList: [],
        pageIdList:[],
        favoriteStoryIdList:[],
        writerRating: 0,
    });
    const token = signToken(user._id);
    res.status(200).json({data: user, token:token, userId:user._id});
}

exports.login= async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email}).select('+password');
    if(!user || !(await user.correctPassword(password, user.password))){
        return res.status(403).send('bukó');
    }
    const token = signToken(user._id);
    res.status(200).json({
        status:'success',
        token: token,
        userId:user._id
    })
}

exports.protect = async (req, res, next) => {
    next();
}