"use strict";
const mongoose = require("mongoose");

const BoardMemberSelectionSchema = new mongoose.Schema({
    journalId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Journal', 
        required: true 
    },
    boardMemberId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    label: {
        type: String,
        enum: ["senior", "associate", "guest", "managing"],
        required: true
    },
    role: {
        type: String,
        enum: ["Editors in Chief", "Publishers", "Reviewers"],
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, { timestamps: true });

module.exports = mongoose.model('BoardSelection', BoardMemberSelectionSchema);
