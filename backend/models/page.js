const mongoose = require('mongoose');

const pageSchema = mongoose.Schema({
    text: String,
    language: String,
    level: String,
    authorId: String,
    rating: [{ userId: String, rate: Number }],
    status: 'Pending' | 'Confirmed',
    translations: []
}, { collection: 'pages' });

module.exports = mongoose.model('Page', pageSchema);