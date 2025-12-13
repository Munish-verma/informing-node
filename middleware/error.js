"use strict"

const winston = require("winston");
const { SYSTEM_CONSTANTS } = require("../config/constant.js");
const { internalError } = require("../helper/responseHelper.js");

const logConfiguration = {
  'transports': [
    new winston.transports.Console()
  ]
};
winston.createLogger(logConfiguration);

module.exports = function (err, req, res, next) {
  console.log(err.message);
  res.errorMessage = err.message
  return internalError(res, req.apiId, err.message || SYSTEM_CONSTANTS.INTERNAL_SERVER_ERROR);
};