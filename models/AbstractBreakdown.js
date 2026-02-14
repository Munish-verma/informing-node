"use strict";
const mongoose = require("mongoose");

const AbstractBreakdownSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        unique: true
    },
    value: { 
        type: String, 
        required: true,
        trim: true 
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, { timestamps: true });

module.exports = mongoose.model('AbstractBreakdown', AbstractBreakdownSchema);
