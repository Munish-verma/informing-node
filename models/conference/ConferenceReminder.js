"use strict";
const mongoose = require("mongoose");

const ConferenceReminderSchema = new mongoose.Schema({
    conferenceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Conference', 
        required: true 
    },
    recipientType: { 
        type: String, 
        required: true,
        trim: true // Example: "Author", "Reviewer"
    },
    days: { 
        type: Number, 
        required: true // 5 (before) or -5 (after)
    },
    timing: { 
        type: String, 
        enum: ["before", "after"], 
        required: true 
    },
    subject: { 
        type: String, 
        required: true, 
        trim: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    // Checkboxes configuration
    ccOptions: {
        ccEditor: { type: Boolean, default: false },
        ccEIC: { type: Boolean, default: false },
        ccAdmins: { type: Boolean, default: false }
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

// Index for conference-wise performance
ConferenceReminderSchema.index({ conferenceId: 1, recipientType: 1 });

module.exports = mongoose.model('ConferenceReminder', ConferenceReminderSchema);
