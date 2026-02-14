"use strict";
const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema({
    journalId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'journals', 
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

// Index for journal-wise performance
ReminderSchema.index({ journalId: 1, recipientType: 1 });

module.exports = mongoose.model('Reminder', ReminderSchema);
