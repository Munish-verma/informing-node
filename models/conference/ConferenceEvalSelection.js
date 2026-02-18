"use strict";
const mongoose = require("mongoose");

const conferenceEvalSelectionSchema = new mongoose.Schema({
    conferenceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Conference', 
        required: true 
    },
    evaluationFormId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'EvaluationForm', 
        required: true 
    }
}, { timestamps: true });

// Compound unique index to prevent duplicate selections
conferenceEvalSelectionSchema.index({ conferenceId: 1, evaluationFormId: 1 }, { unique: true });

module.exports = mongoose.model('ConferenceEvalSelection', conferenceEvalSelectionSchema);
