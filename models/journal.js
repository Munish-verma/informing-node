"use strict";
const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
    title: { type: String },
    acronym: { type: String },
    overviewDescription: { type: String },
    legacyExternalUrl: { type: String, default: "" },
    callForPapersMessage: { type: String },
    onlineIssn: { type: String, default: "" },
    printIssn: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", required: true },
    minimumTopicsPerArticle: { type: String, default: "" },
    defaultEditorDueDate: { type: String, default: "" },
    defaultReviewerDueDate: { type: String, default: "" },
    defaultTotalReviewers: { type: String, default: "" },
    isAllow: { type: Boolean, default: false },
    insertDate: { type: Number, default: () => { return Math.round(new Date() / 1000) } },
    updatedDate: { type: Number, default: () => Math.round(Date.now() / 1000) },
});

journalSchema.index({ status: 1, insertDate: -1 });
journalSchema.index({ status: 1, title: 1 });

const Journal = mongoose.model("Journal", journalSchema);

module.exports = { Journal };