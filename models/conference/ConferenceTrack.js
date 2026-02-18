"use strict";
const mongoose = require("mongoose");

const conferenceTrackSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
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
conferenceTrackSchema.index({ conferenceId: 1 });

const ConferenceTrack = mongoose.model("ConferenceTrack", conferenceTrackSchema);

module.exports = ConferenceTrack;
