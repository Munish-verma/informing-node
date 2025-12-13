"use strict";
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  personalTitle: {
    type: String,
    enum: ["Mr", "Ms", "Dr", "Prof", ""],
    default: ""
  },
  personalName: { type: String },
  middleInitial: { type: String, default: "" },
  familyName: { type: String },
  email: { type: String },
  primaryTelephone: { type: String },
  secondaryTelephone: { type: String, default: "" },
  address: { type: String, default: "" },
  city: { type: String },
  stateProvince: { type: String, default: "" },
  postalCode: { type: String, default: "" },
  country: { type: String },
  affiliationUniversity: { type: String },
  department: { type: String, default: "" },
  password: { type: String },
  accessToken: { type: String },
  profilePic: { type: String, default: "" },
  gender: { type: String, enum: ["female", "male", "other"] },
  isNotification: { type: Boolean, default: true },
  role: { type: [String], enum: ["user", "eic", "admin"], default: ["user"] },
  status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  receivePrimaryEmail: { type: Boolean, default: true },
  receiveReminderEmail: { type: Boolean, default: true },
  deletedEmail: { type: String },
  deletedMobile: { type: String },
  deletedPersonalName: { type: String },
  deletedFamilyName: { type: String },
  // aacount info
  receiveSecondaryEmail: { type: String, default: "" },
  isPendingAuthor: { type: Boolean, default: false },
  isDuplicate: { type: Boolean, default: false },
  isiPositions: [{
    type: String,
    enum: [
      "executive_director",
      "governor",
      "fellow",
      "honorary_fellow",
      "director",
      "ambassador",
      "second_act",
      "gackowski_award_winner",
      "isi_founder",
      "governor_emeritus",
      "alumni",
      "landing_page",
      "in_watchList",
      "presented_paper",
      "best_paper",
    ]
  }],
  isReviewerEditorOfMonth: { type: Boolean, default: false },
  ofTheMonth: {
    type: { type: String, default: "" },
    month: { type: String, enum: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], default: "" },
    year: { type: String, default: "" },
  },
  testimonial: {
    type: String,
    maxlength: 150,
    default: ""
  },
  memberUntil: { type: String },
  membershipTypes: {
    type: String,
    enum: [
      "isi_member",
      "isi_sponsored_member",
      ""
    ], default: ""
  },
  // Academic info
  positionTitle: { type: String, default: "" },
  orcid: { type: String, default: "" },
  resume: { type: String, default: "" },
  bio: { type: String, default: "" },
  allowProfile: { type: Boolean, default: false },
  unsubscribe: { type: Boolean, default: false },
  websiteUrl: { type: String, default: "" },
  socialMedia: {
    twitter: { type: String, default: "" },
    facebook: { type: String, default: "" },
    googlePlus: { type: String, default: "" },
    linkedin: { type: String, default: "" }
  },
  note: { type: String, default: "" },
  insertDate: { type: Number, default: () => { return Math.round(new Date() / 1000) } },
  updatedDate: { type: Number, default: () => Math.round(Date.now() / 1000) },
});

userSchema.index({ email: 1 }, { unique: false });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

const User = mongoose.model("User", userSchema);

module.exports = {
  User
};