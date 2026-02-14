"use strict";
const mongoose = require("mongoose");

const JournalAbstractSelectionSchema = new mongoose.Schema({
    journalId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'journals', 
        required: true 
    },
    breakdownId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AbstractBreakdown', 
        required: true 
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, { timestamps: true });

// Prevent duplicate selections
JournalAbstractSelectionSchema.index({ journalId: 1, breakdownId: 1 }, { unique: true });

module.exports = mongoose.model('JournalAbstractSelection', JournalAbstractSelectionSchema);
