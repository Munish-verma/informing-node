"use strict";
const mongoose = require("mongoose");

const articleSelectionSchema = new mongoose.Schema({
    journalId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Journal', 
        required: true 
    },
    articleTypeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Article', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('ArticleSelection', articleSelectionSchema);
