"use strict";
const mongoose = require('mongoose');

const ConferenceScheduleSchema = new mongoose.Schema({
    conferenceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conference',
        required: true,
        index: true
    },
    date: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        default: ""
    },
    fullDescription: {
        type: String,
        default: ""
    }
}, { 
    timestamps: true,
    versionKey: false 
});

// Ensure ek date ka ek hi schedule ho per conference
ConferenceScheduleSchema.index({ conferenceId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('ConferenceSchedule', ConferenceScheduleSchema);
