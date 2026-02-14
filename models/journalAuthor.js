"use strict";
const mongoose = require("mongoose");

const JournalAuthorSchema = new mongoose.Schema({
    journalId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'journals', 
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

// Indexing: Ek journal mein ek hi user author ho sakta hai (no duplicates)
JournalAuthorSchema.index({ journalId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('JournalAuthor', JournalAuthorSchema);
