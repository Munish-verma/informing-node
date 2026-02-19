const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

const dbLink = config.get("dbLink");

// Disable mongoose debug logging
mongoose.set('debug', false);

// Connection options with timeout
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1
};

module.exports = function () {
  // console.log(`Connecting to MongoDB: ${dbLink}`);
  mongoose
    .connect(dbLink, mongooseOptions)
    .then(() => {
      // console.log("Connected to MongoDB...");
    })
    .catch((err) => {
      console.error("Could not connect to MongoDB...", err.message);
    });
};
