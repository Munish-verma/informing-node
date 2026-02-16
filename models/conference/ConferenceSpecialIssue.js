"use strict";
const mongoose = require("mongoose");

const ConferenceSpecialIssueSchema = new mongoose.Schema({
    conferenceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Conference', 
        required: true 
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    guestEditor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    status: {
        type: String,
        enum: ["active", "inactive", "expired", "deleted"],
        default: "active"
    }
}, { timestamps: true });

// Indexing for faster conference-based lookup
ConferenceSpecialIssueSchema.index({ conferenceId: 1, status: 1 });

module.exports = mongoose.model('ConferenceSpecialIssue', ConferenceSpecialIssueSchema);
