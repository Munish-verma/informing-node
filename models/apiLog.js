"use strict"

const mongoose = require("mongoose");

const apiLogSchema = new mongoose.Schema({
  apiId: String,
  host: String,
  method: String,
  userId: String,
  completeUrl: String,
  url: String,
  baseUrl: String,
  params: Object,
  query: Object,
  body: Object,
  deviceInfo: {
    deviceName: String,
    deviceId: String,
    deviceOS: String,
    deviceType: String,
    deviceBuildNumber: String,
    userAgent: { type: String },
  },
  startTimeMilli: { type: Number, default: () => { return new Date() } },
  endTimeMilli: Number,
  errorMessage: String,
  responseTimeMilli: { type: Number, default: -1 },
  statusCode: { type: Number, default: -1 },
  creationDate: { type: Date, default: () => { return new Date() } },
  insertDate: { type: Number, default: () => { return Math.round(new Date() / 1000) } },
});

apiLogSchema.index({ creationDate: 1 }, { expireAfterSeconds: 90 * 86400 }); // Delete log after 90 days.

const ApiLog = mongoose.model("ApiLog", apiLogSchema);

module.exports = {
  ApiLog
};
