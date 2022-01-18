const jwt = require('jsonwebtoken');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        languages: null,
        storyIdList: [],
        pageIdList: [],
        favoriteStoryIdList: [],
        writerRating: 0,
    });
    const token = signToken(user._id);
    res.status(201).json({
        status: 'success',
        data: token
    });
})

exports.login = catchAsync(async (req, res, next) => {
    const { userInput, password } = req.body;
    const query = userInput.includes('@') ? { email: userInput } : { name: userInput };
    const user = await User.findOne(query).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(403).send('bukó');
    }
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        data: token
    })
})

exports.protect = async (req, res, next) => {
    next();
}