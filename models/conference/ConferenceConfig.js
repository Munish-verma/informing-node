"use strict";
const mongoose = require('mongoose');

const ConferenceConfigSchema = new mongoose.Schema({
    conferenceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conference',
        required: true,
        unique: true, // Ek conference ki ek hi config hogi
        index: true
    },
    // Left Column Fields
    country: { type: String, default: 'United States' },
    city: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    image: { type: String }, // Path to the uploaded image

    // Right Column Fields
    articleSubmissionStart: { type: Date },
    articleSubmissionEnd: { type: Date },
    registrationStart: { type: Date },
    registrationEnd: { type: Date },
    fastTrackDueDate: { type: Date },
    scheduleConstraintDeadline: { type: Number, default: 15 }, // In days
    passportInfoRequired: { type: Boolean, default: false },

    // Conference Elements Box
    conferenceElements: {
        daysBeforeStart: { type: Number, default: 15 },
        networkingConnections: { type: Boolean, default: true },
        teachIT: { type: Boolean, default: true },
        tele: { type: Boolean, default: true },
        inform: { type: Boolean, default: true }
    },

    // Bottom Options
    grantMembership: { type: Boolean, default: true },
    disablePayPal: { type: Boolean, default: false },
    currency: { type: String, default: 'U.S. Dollar (USD)', required: true },
    alternativePaymentOptions: { type: String }
}, { 
    timestamps: true,
    versionKey: false 
});

const ConferenceConfig = mongoose.model('ConferenceConfig', ConferenceConfigSchema);

module.exports = ConferenceConfig;
