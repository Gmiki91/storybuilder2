const mongoose = require('mongoose');

const pageSchema = mongoose.Schema({
    text: String,
    language: String,
    authorId: String,
    authorName:String,
    levels:  [{ userId: String, rate: Number }],
    ratings: [{ userId: String, rate: Number }],
}, { collection: 'pages' });

module.exports = mongoose.model('Page', pageSchema);