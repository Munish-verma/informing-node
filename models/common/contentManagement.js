"use strict";
const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
    pageType: { type: String, enum: ["about"], required: true, },
    // title: { type: String, required: true },
    description: { type: String, default: "" },
    insertDate: { type: Number, default: () => { return Math.round(new Date() / 1000) } },
    updatedDate: { type: Number, default: () => Math.round(Date.now() / 1000) },

});

contentSchema.index({ pageType: 1, insertDate: -1 });

const ContentManagement = mongoose.model("ContentManagement", contentSchema);

module.exports = { ContentManagement };
