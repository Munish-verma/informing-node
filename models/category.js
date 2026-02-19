"use strict";
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    trim: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Category = mongoose.model("Category", CategorySchema);

module.exports = { Category };
