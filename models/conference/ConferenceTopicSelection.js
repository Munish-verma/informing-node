"use strict";
const mongoose = require("mongoose");

const ConferenceTopicSelectionSchema = new mongoose.Schema({
    conferenceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Conference', 
        required: true 
    },
    topicId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Topic', 
        required: false,
        default: null
    },
    subTopicId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SubTopic', 
        required: false,
        default: null
    }
}, { timestamps: true });

// Compound unique index for topic selections (when topicId is set)
ConferenceTopicSelectionSchema.index({ conferenceId: 1, topicId: 1 }, { unique: true, sparse: true });

// Compound unique index for subtopic selections (when subTopicId is set)
ConferenceTopicSelectionSchema.index({ conferenceId: 1, subTopicId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('ConferenceTopicSelection', ConferenceTopicSelectionSchema);
