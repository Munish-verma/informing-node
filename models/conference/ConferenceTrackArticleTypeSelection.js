"use strict";
const mongoose = require('mongoose');

const ConferenceTrackArticleTypeSelectionSchema = new mongoose.Schema({
    conferenceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conference',
        required: true,
        index: true 
    },
    trackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track',
        default: null
    },
    chairEditorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        default: null
    },
    articleTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        default: null
    },
    selectionType: {
        type: String,
        enum: ['track', 'articleType'],
        required: true
    }
}, { 
    timestamps: true, 
    versionKey: false 
});

// Partial Indexes for data integrity across multiple conferences
// Track selection unique per conference
ConferenceTrackArticleTypeSelectionSchema.index(
    { conferenceId: 1, trackId: 1 }, 
    { unique: true, sparse: true, partialFilterExpression: { selectionType: 'track' } }
);

// Article Type selection unique per conference
ConferenceTrackArticleTypeSelectionSchema.index(
    { conferenceId: 1, articleTypeId: 1 }, 
    { unique: true, sparse: true, partialFilterExpression: { selectionType: 'articleType' } }
);

module.exports = mongoose.model('ConferenceTrackArticleTypeSelection', ConferenceTrackArticleTypeSelectionSchema);
