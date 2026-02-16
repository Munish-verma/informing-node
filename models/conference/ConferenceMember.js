"use strict";
const mongoose = require("mongoose");

const ConferenceMemberSchema = new mongoose.Schema({
    conferenceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Conference', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    membershipExpiration: { 
        type: Date, 
        required: true 
    },
    status: {
        type: String,
        enum: ["active", "expired", "cancelled"],
        default: "active"
    }
}, { timestamps: true });

// Indexing: Ek user ek conference ka ek hi baar member entry rakhega
ConferenceMemberSchema.index({ conferenceId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('ConferenceMember', ConferenceMemberSchema);
