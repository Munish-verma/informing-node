"use strict";
const mongoose = require("mongoose");

const evaluationFormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  journalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Journal', 
    default: null 
  },
  conferenceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Conference', 
    default: null 
  },
  isPublic: { type: Boolean, default: false },
  inUse: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  category: { type: String }, // e.g., "Research", "Case Study"
  allowSharedUse: { type: Boolean, default: false }, // Allow other editors to use
  insertDate: {
    type: Number,
    default: () => Math.round(new Date() / 1000),
  },
  updatedDate: { 
    type: Number, 
    default: () => Math.round(Date.now() / 1000) 
  },
});

module.exports = mongoose.model('EvaluationForm', evaluationFormSchema);
