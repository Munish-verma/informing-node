"use strict"

const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { success, failure } = require("../helper/responseHelper.js");
const { identityManager } = require("../middleware/auth.js");
const { generateAuthToken } = require("../services/jwtToken.js");
const { compareHash, generateHash } = require("../services/bcrypt.js");
const { ADMIN_CONSTANTS } = require("../config/constant.js");
const { Admin } = require("../models/admin.js");
const { validateAdminLogin, validateForgotPassword, validateChangePassword, validateUpdateDetails } = require("../validations/admin.js");

router.post("/login", async (req, res) => {
  const { error } = validateAdminLogin(req.body);
  if (error) return failure(res, req.apiId, error.details[0].message);

  const email = req.body.email?.toLowerCase();

  const user = await Admin.findOne({ email });
  if (!user) return failure(res, req.apiId, ADMIN_CONSTANTS.INVALID_EMAIL);

  const isPasswordValid = compareHash(req.body.password, user.password);
  if (!isPasswordValid) return failure(res, req.apiId, ADMIN_CONSTANTS.INVALID_PASSWORD);

  const token = generateAuthToken(user._id, user.email, user.role);

  user.accessToken = token;
  await user.save();

  const response = _.pick(user.toObject(), [
    "_id",
    "email",
    "role",
    "status",
    "insertDate"
  ]);

  return success(res.header("Authorization", token), req.apiId, ADMIN_CONSTANTS.LOGIN_SUCCESS, response);
});

router.put("/", identityManager(["admin"]), async (req, res) => {
  const { error } = validateUpdateDetails(req.body);
  if (error) return failure(res, req.apiId, error.details[0].message);

  const { userId } = req.jwtData;

  const user = await Admin.findById(userId);
  if (!user) return failure(res, req.apiId, ADMIN_CONSTANTS.NOT_FOUND);

  if (req.body.email) user.email = req.body.email.toLowerCase();
  if (req.body.profilePic) user.profilePic = req.body.profilePic;

  await user.save();

  const response = _.pick(user.toObject(), [
    "_id",
    "email",
    "role",
    "status",
    "profilePic",
    "insertDate"
  ]);

  return success(res, req.apiId, ADMIN_CONSTANTS.UPDATE_SUCCESS, response);
});

router.get("/", identityManager(["admin"]), async (req, res) => {
  const { userId } = req.jwtData;

  const user = await Admin.findById(userId).lean();
  if (!user) { return failure(res, req.apiId, ADMIN_CONSTANTS.NOT_FOUND) }

  const response = _.pick(user, [
    "_id",
    "role",
    "email",
    "status",
    "insertDate"
  ]);

  return success(res, req.apiId, ADMIN_CONSTANTS.VIEW_PROFILE_SUCCESS, response);
});

router.post("/change-password", identityManager(["admin", "superAdmin"]), async (req, res) => {
  const { error } = validateChangePassword(req.body);
  if (error) return failure(res, req.apiId, error.details[0].message);

  const { userId } = req.jwtData;

  const user = await Admin.findById(userId);
  if (!user) return failure(res, req.apiId, ADMIN_CONSTANTS.NOT_FOUND);

  const isPasswordValid = compareHash(req.body.currentPassword, user.password);
  if (!isPasswordValid) { return failure(res, req.apiId, ADMIN_CONSTANTS.INVALID_CURRENT_PASSWORD) }

  user.password = generateHash(req.body.newPassword);
  await user.save();

  return success(res, req.apiId, ADMIN_CONSTANTS.PASSWORD_RESET_SUCCESS);
});

router.post("/logout", identityManager(["admin"]), async (req, res) => {
  const { userId } = req.jwtData;

  const user = await Admin.findById(userId);
  if (!user) return failure(res, req.apiId, ADMIN_CONSTANTS.NOT_FOUND);

  user.accessToken = "";
  await user.save();

  return success(res, req.apiId, ADMIN_CONSTANTS.LOGOUT_SUCCESS);
});

module.exports = router;