const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const signToken = id => jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
);

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
        return res.status(403).send('Incorrect password');
    }
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        data: token
    })
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new AppError(`No user found with email ${req.body.email}.`));

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Click the link to reset your password: ${resetUrl}`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 minutes).',
            message
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        })
    } catch (err) {
        user.createPasswordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
})
exports.resetPassword = catchAsync(async (req, res, next) => {
    const passwordResetToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpires:{$gt:Date.now()}
    });

    if(!user)return next(new AppError('Token is invalid/expired.',400));

    user.password = req.body.password;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save();
    
    
    
    const token = signToken(user._id);
    res.status(201).json({
        status: 'success',
        data: token
    });
 })