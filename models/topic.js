"use strict";
const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
    name: { type: String },
    minSelections: { type: String },
    maxSelections: { type: String },
    sortOrder: { type: Number, default: 0 },
    insertDate: { type: Number, default: () => { return Math.round(new Date() / 1000) } },
    updatedDate: { type: Number, default: () => Math.round(Date.now() / 1000) },
});

const Topic = mongoose.model("Topic", topicSchema);


const subTopicSchema = new mongoose.Schema({
    name: { type: String },
    minSelections: { type: String },
    maxSelections: { type: String },
    topicId: { type: String },
    sortOrder: { type: Number, default: 0 },
    insertDate: { type: Number, default: () => { return Math.round(new Date() / 1000) } },
    updatedDate: { type: Number, default: () => Math.round(Date.now() / 1000) },
});

const SubTopic = mongoose.model("SubTopic", subTopicSchema);

const trackSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    insertDate: { type: Number, default: () => { return Math.round(new Date() / 1000) } },
    updatedDate: { type: Number, default: () => Math.round(Date.now() / 1000) },
});

const Track = mongoose.model("Track", trackSchema);

const articleSchema = new mongoose.Schema({
    name: { type: String },
    insertDate: { type: Number, default: () => { return Math.round(new Date() / 1000) } },
    updatedDate: { type: Number, default: () => Math.round(Date.now() / 1000) },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = { Topic, SubTopic, Track, Article };