const mongoose = require('mongoose');

const storySchema = mongoose.Schema({
    title: String,
    description: String,
    language: String,
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native',
    authorId: String,
    overallRating: Number,
    lastPageAddedAt: Date,
    openEnded: Boolean,
    pages: [{
        pageNumber: Number,
        pageId: String
    }],
    pendingPages: [String]
}, { collection: 'stories' });

module.exports = mongoose.model('Story', storySchema);