"use strict";
const mongoose = require("mongoose");

const SpecialIssueSchema = new mongoose.Schema({
    journalId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'journals', 
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

// Indexing for faster journal-based lookup
SpecialIssueSchema.index({ journalId: 1, status: 1 });

module.exports = mongoose.model('SpecialIssue', SpecialIssueSchema);
