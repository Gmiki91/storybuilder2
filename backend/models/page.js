const mongoose = require('mongoose');
const Rating = require('./subSchema');
const pageSchema = mongoose.Schema({
    text: String,
    language: String,
    authorId: String,
    authorName:String,
    levels:  [{ userId: String, rate: Number }],
    ratings: [Rating],
}, { collection: 'pages' });

module.exports = mongoose.model('Page', pageSchema);