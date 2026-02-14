"use strict";
const mongoose = require("mongoose");

const selectionSchema = new mongoose.Schema({
    journalId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Journal', 
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
selectionSchema.index({ journalId: 1, topicId: 1, subTopicId: 1 }, { unique: true });

module.exports = mongoose.model('Selection', selectionSchema);
