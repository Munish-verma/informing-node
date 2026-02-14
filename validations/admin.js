"use strict";

const Joi = require("joi");
const { valMsgFormatter } = require("../services/commonFunctions");

function validateAdminLogin(admin) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(8).max(255).required()
  });
  let result = schema.validate(admin);
  if (result.error) result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
  return result;
}

function validateForgotPassword(req) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    otpToken: Joi.number().integer().required(),
    newPassword: Joi.string().min(8).required().label('Password'),
    confirmPassword: Joi.any().equal(Joi.ref('newPassword')).required().label('Confirm password').options({ messages: { 'any.only': '{{#label}} does not match' } }),
  });
  let result = schema.validate(req);
  if (result.error) result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
  return result;
}

function validateChangePassword(req) {
  const schema = Joi.object({
    newPassword: Joi.string().min(8).required(),
    currentPassword: Joi.string().min(8).required(),
  });
  let result = schema.validate(req);
  if (result.error) result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
  return result;
}

function validateUpdateDetails(req) {
  const schema = Joi.object({
    email: Joi.string().email().optional().allow(''),
    profilePic: Joi.string().optional().allow(''),
  });
  let result = schema.validate(req);
  if (result.error) result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
  return result;
}

module.exports = {
  validateAdminLogin,
  validateForgotPassword,
  validateChangePassword,
  validateUpdateDetails
};