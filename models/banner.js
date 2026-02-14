"use strict";

const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  companyName: { type: String, required: true },
  type: { type: String, enum: ["health_insurance", "vehicle", "home", "travel", "fire", "credit_life"], required: true },
  status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  insertDate: { type: Number, default: () => Math.round(new Date() / 1000) },
  updateDate: { type: Number },
  deletionDate: { type: Number }
});
bannerSchema.plugin(require("../helper/translation-plugin"), {
  fields: ["title", "description", "companyName"]
});

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = {
  Banner
};