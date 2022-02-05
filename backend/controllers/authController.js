const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library')
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const client = new OAuth2Client(process.env.REACT_APP_CLIENT_ID)
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
        favoriteStoryIdList: [],
        writerRating: 0,
    });
    const token = signToken(user._id);
    res.status(201).json({
        status: 'success',
        token
    });
})

exports.login = catchAsync(async (req, res, next) => {
    const { userInput, password } = req.body;
    const query = userInput.includes('@') ? { email: userInput } : { name: userInput };
    const user = await User.findOne(query).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) return next(new AppError(`Incorrect ${query.key}/password`, 401));

    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})

exports.loginGoogle = catchAsync(async (req, res, next) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.REACT_APP_CLIENT_ID
    });
    const { name, email } = ticket.getPayload();
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            name,
            email,
            password: '??????',
            favoriteStoryIdList: [],
            writerRating: 0,
        })
    }
    const jwt = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token: jwt
    })
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.body.user._id).select('+password');
    const { currentPassword, newPassword } = req.body;
    if (!user || !(await user.correctPassword(currentPassword, user.password))) return next(new AppError(`Incorrect password`, 401));

    user.password = newPassword;
    user.passwordChangedAt = Date.now() - 1000;
    await user.save();
    const token = signToken(user._id);
    res.status(201).json({
        status: 'success',
        message: 'Password has been changed!',
        token
    });
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body.email;
    const user = await User.findOne({ email });
    let message;
    let subject;
    if (user) {
        const resetToken = user.createPasswordResetToken();
        //const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
        const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;
        subject = 'Your password reset token (valid for 10 minutes).';
        message = `Click the link to reset your password: ${resetUrl}`;
        await user.save();
    }else{
        subject='Account access attempted';
         message = `You or someone else entered this email address when trying to change the password of an account.
         However, this email address is not in our database.
         If you are a registered user, please try again using the email address you gave when you registered.
         If you are not a registered user, please ignore this email.`;
    }
    try {
        await sendEmail({
            email,
            subject,
            message
        });
        res.status(200).json({
            status: 'success',
            message: `An email has been sent to ${email} with further instructions`
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
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) return next(new AppError('Token is invalid/expired.', 400));

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = signToken(user._id);
    res.status(201).json({
        status: 'success',
        data: token
    });
})