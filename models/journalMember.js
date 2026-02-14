"use strict";
const mongoose = require("mongoose");

const JournalMemberSchema = new mongoose.Schema({
    journalId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'journals', 
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

// Indexing: Ek user ek journal ka ek hi baar member entry rakhega
JournalMemberSchema.index({ journalId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('JournalMember', JournalMemberSchema);
