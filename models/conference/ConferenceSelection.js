"use strict";
const mongoose = require("mongoose");

const conferenceSelectionSchema = new mongoose.Schema({
    conferenceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Conference', 
        required: true 
    },
    topicId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Topic', 
        required: true 
    },
    subTopicId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SubTopic', 
        default: null 
    }
}, { timestamps: true });

// Compound unique index to prevent duplicate selections
conferenceSelectionSchema.index({ conferenceId: 1, topicId: 1, subTopicId: 1 }, { unique: true });

module.exports = mongoose.model('ConferenceSelection', conferenceSelectionSchema);
