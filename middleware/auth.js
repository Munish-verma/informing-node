"use strict"

const config = require("config");
const mongoose = require("mongoose");

const { verifyToken } = require("../services/jwtToken.js");
const { failure } = require("../helper/responseHelper.js")
const { MIDDLEWARE_AUTH_CONSTANTS } = require("../config/constant.js");

const { Admin } = require("../models/admin/admin.js");
const { User } = require("../models/auth/user.js");


function identityManager(allowedRoleArray) {
  return async (req, res, next) => {

    if (!config.get("requireAuth")) return next();

    req.apiId = new mongoose.Types.ObjectId();
    req.startTimeMilli = Math.round(new Date());

    const authHeader = req.header('Authorization');
    if (!authHeader) return failure(res, req.apiId, MIDDLEWARE_AUTH_CONSTANTS.ACCESS_DENIED, {}, 401);

    let token = authHeader;
    // Handle both "Bearer <token>" and "<token>" formats
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return failure(res, req.apiId, MIDDLEWARE_AUTH_CONSTANTS.EXPIRED_TOKEN, {}, 401);
      } else if (err.name === 'JsonWebTokenError') {
        return failure(res, req.apiId, MIDDLEWARE_AUTH_CONSTANTS.INVALID_AUTH_TOKEN, {}, 401);
      } else {
        return failure(res, req.apiId, MIDDLEWARE_AUTH_CONSTANTS.VERIFICATION_FAILED, {}, 401);
      }
    }

    req.jwtData = decoded;
    req.reqUserId = decoded.userId;

    if (!allowedRoleArray.includes(decoded.role)) {
      return failure(res, req.apiId, MIDDLEWARE_AUTH_CONSTANTS.RESOURCE_FORBIDDEN, {}, 403);
    }

    switch (decoded.role) {
      case 'superAdmin':
      case 'admin':
        let admin = await Admin.findOne({ _id: new mongoose.Types.ObjectId(decoded.userId) });
        if (!admin || (admin && admin.accessToken !== token)) return failure(res, req.apiId, MIDDLEWARE_AUTH_CONSTANTS.INVALID_AUTH_TOKEN, {}, 401);
        req.userData = admin;
        req.reqId = decoded.userId;
        break;

      case 'user':
      case 'reviewer':
      case 'publisher':
      case 'eic':
        const user = await User.findOne({ _id: new mongoose.Types.ObjectId(decoded.userId) });
        if (!user || (user && user.accessToken !== token)) return failure(res, req.apiId, MIDDLEWARE_AUTH_CONSTANTS.INVALID_AUTH_TOKEN, {}, 401);

        req.userData = user;
        req.reqId = decoded.userId;
        break;

      default:
        return failure(res, req.apiId, MIDDLEWARE_AUTH_CONSTANTS.ACCESS_DENIED, {}, 400);
    }
    next();
  };
}

module.exports = {
  identityManager
};
