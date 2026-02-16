"use strict";
const mongoose = require("mongoose");

const ConferenceArticleSelectionSchema = new mongoose.Schema({
    conferenceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Conference', 
        required: true 
    },
    articleId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Article', 
        required: true 
    }
}, { timestamps: true });

// Compound unique index to prevent duplicate selections
ConferenceArticleSelectionSchema.index({ conferenceId: 1, articleId: 1 }, { unique: true });

module.exports = mongoose.model('ConferenceArticleSelection', ConferenceArticleSelectionSchema);
