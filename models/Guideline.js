"use strict";
const mongoose = require("mongoose");

const guidelineSchema = new mongoose.Schema({
  journalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Journal', 
    required: true,
    unique: true // Ek journal ke liye ek hi guideline set honi chahiye
  },
  formattingInstructions: { 
    type: String, 
    default: "" 
  }, // 1. Article Formatting Instructions
  submissionGuidelines: { 
    type: String, 
    default: "" 
  }, // 2. Article Submission Guidelines
  submissionAgreement: { 
    type: String, 
    default: "" 
  }, // 3. Article Submission Agreement
  uploadedFiles: [{
    fileName: { type: String },
    fileUrl: { type: String },
    uploadedAt: { type: Number, default: () => Math.round(Date.now() / 1000) }
  }], // 4. Upload Files
  updatedDate: { 
    type: Number, 
    default: () => Math.round(Date.now() / 1000) 
  },
});

module.exports = mongoose.model('Guideline', guidelineSchema);
