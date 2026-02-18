"use strict";
const mongoose = require('mongoose');

const ConferenceMetaSchema = new mongoose.Schema({
    conferenceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conference',
        required: true,
        index: true
    },
    // The category identifies the section (e.g., 'host', 'deadline', 'sponsor')
    category: {
        type: String,
        required: true,
        enum: [
            'deadline', 'host', 'chair', 'keynote', 
            'sponsor', 'award', 'discount', 'topic', 'footer'
        ],
        index: true
    },
    // Common fields used across different categories
    name: { type: String, trim: true }, // Used for Host, Chair, Keynote, Sponsor
    date: { type: String },             // Used for Deadlines
    info: { type: String },             // Used for almost all (Text or HTML)
    url:  { type: String },             // Used for Host, Sponsor
    image: { type: String },            // Used for Host, Chair, Keynote, Sponsor
    
    // Sort order for drag-and-drop
    order: { type: Number, default: 0 }
}, { 
    timestamps: true,
    versionKey: false 
});

// Optimization: Indexing for fast retrieval per conference and category
ConferenceMetaSchema.index({ conferenceId: 1, category: 1, order: 1 });

const ConferenceMeta = mongoose.model('ConferenceMeta', ConferenceMetaSchema);

module.exports = ConferenceMeta;
