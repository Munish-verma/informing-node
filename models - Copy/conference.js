"use strict";
const mongoose = require("mongoose");

const conferenceSchema = new mongoose.Schema({
    title: { type: String },
    acronym: { type: String },
    message: { type: String },
    legacyExternalUrl: { type: String, default: "" },
    onlineIssn: { type: String, default: "" },
    printIssn: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published", "publishedAll", "archived"], default: "draft", required: true },
    minimumTopicsPerArticle: { type: String, default: "" },
    defaultEditorDueDate: { type: String, default: "" },
    defaultReviewerDueDate: { type: String, default: "" },
    defaultTotalReviewers: { type: String, default: "" },
    isAllow: { type: Boolean, default: false },
    insertDate: { type: Number, default: () => { return Math.round(new Date() / 1000) } },
    updatedDate: { type: Number, default: () => Math.round(Date.now() / 1000) },
});

conferenceSchema.index({ status: 1, insertDate: -1 });
conferenceSchema.index({ status: 1, title: 1 });

const Conference = mongoose.model("Conference", conferenceSchema);

module.exports = { Conference };