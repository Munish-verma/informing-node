"use strict";

const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: { type: String },
  profilePic: { type: String, default: "" },
  password: { type: String },
  accessToken: { type: String },
  role: { type: String, default: "superAdmin" },
  status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  insertDate: { type: Number, default: () => { return Math.round(new Date() / 1000) } },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = {
  Admin
};