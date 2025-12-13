const mongoose = require("mongoose");
const winston = require("winston");
const express = require("express");
const app = express();
const config = require("config");
const seed = require("./startup/seed.js");
mongoose.set("debug", true);
const swagger = require("./startup/swagger.js");

swagger()

require("./startup/logging")();
require("./startup/logger");
require("./startup/db.js")();
require("./startup/cors")(app);
require("./startup/prod")(app);

require("./startup/routes")(app);
seed();


const port = process.env.PORT || config.get("port");
const server = app.listen(port, () => { winston.info(`Listening on port ${port}...`), console.log(`Listening on port ${port}...`) });
module.exports = server;