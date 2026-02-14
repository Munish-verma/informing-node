const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

const dbLink = config.get("dbLink");

// Disable mongoose debug logging
mongoose.set('debug', false);

module.exports = function () {
  console.log(`Connecting to MongoDB: ${dbLink}`);
  mongoose
    .connect(dbLink)
    .then(() => {
      console.log("Connected to MongoDB...");
    })
    .catch((err) => {
      console.error("Could not connect to MongoDB...", err);
    });
};
