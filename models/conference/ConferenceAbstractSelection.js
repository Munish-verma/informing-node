"use strict";
const mongoose = require("mongoose");

const ConferenceAbstractSelectionSchema = new mongoose.Schema({
    conferenceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Conference', 
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
ConferenceAbstractSelectionSchema.index({ conferenceId: 1, breakdownId: 1 }, { unique: true });

module.exports = mongoose.model('ConferenceAbstractSelection', ConferenceAbstractSelectionSchema);
