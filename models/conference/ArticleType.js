"use strict";
const mongoose = require('mongoose');

const articleTypeSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true
  },
  description: { 
    type: String 
  },
  conferenceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Conference',
    required: true 
  },
  insertDate: {
    type: Number,
    default: () => {
      return Math.round(new Date() / 1000);
    },
  },
  updatedDate: { type: Number, default: () => Math.round(Date.now() / 1000) },
});

// Index for conference-based lookup
articleTypeSchema.index({ conferenceId: 1 });

const ArticleType = mongoose.model("ArticleType", articleTypeSchema);

module.exports = ArticleType;
