"use strict";
const mongoose = require("mongoose");

const fcmLogSchema = new mongoose.Schema({
  token: { type: String },
  type: { type: String },
  title: { type: String },
  message: { type: String },
  status: { type: String },
  payload: { type: mongoose.Schema.Types.Mixed },
  response: { type: mongoose.Schema.Types.Mixed },
  insertDate: {
    type: Number,
    default: () => {
      return Math.round(new Date() / 1000);
    },
  },
});

const FcmLog = mongoose.model("FcmLog", fcmLogSchema);

module.exports = { FcmLog };
