"use strict";
const mongoose = require("mongoose");

const evalSelectionSchema = new mongoose.Schema({
    journalId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Journal', 
        required: true 
    },
    evaluationFormId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'EvaluationForm', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('EvalSelection', evalSelectionSchema);
