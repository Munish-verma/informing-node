"use strict";
const mongoose = require("mongoose");

const ConferenceAuthorSchema = new mongoose.Schema({
    conferenceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Conference', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    status: {
        type: String,
        enum: ["active", "inactive", "deleted"],
        default: "active"
    }
}, { timestamps: true });

// Indexing: Ek conference mein ek hi user author ho sakta hai (no duplicates)
ConferenceAuthorSchema.index({ conferenceId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('ConferenceAuthor', ConferenceAuthorSchema);
