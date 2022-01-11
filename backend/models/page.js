const mongoose = require('mongoose');

const pageSchema = mongoose.Schema({
    text: String,
    language: String,
    levels:  [{ userId: String, rate: Number }],
    authorId: String,
    ratings: [{ userId: String, rate: Number }],
    status: 'Pending' | 'Confirmed',
    translations: []
}, { collection: 'pages' });

module.exports = mongoose.model('Page', pageSchema);