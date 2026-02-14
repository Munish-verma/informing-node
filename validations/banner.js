// validations/banner.js
"use strict";

const Joi = require("joi");
const { valMsgFormatter } = require("../services/commonFunctions");

function validateBannerCreate(data) {
  const schema = Joi.object({
    imageUrl: Joi.string().uri().required(),
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    companyName: Joi.string().min(3).max(100).required(),
    type: Joi.string().valid("health_insurance", "vehicle", "home", "travel", "fire", "credit_life").required()
  });

  let result = schema.validate(data, { abortEarly: false });
  if (result.error) {
    console.log("Validation Errors:", result.error.details);
    result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
  }
  return result;
}

function validateBannerUpdate(data) {
  const schema = Joi.object({
    bannerId: Joi.string().required(),
    imageUrl: Joi.string().uri().optional(),
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(10).max(1000).optional(),
    companyName: Joi.string().min(3).max(100).optional(),
    type: Joi.string().valid("health_insurance", "vehicle", "home", "travel", "fire", "credit_life").optional(),
    status: Joi.string().valid("active", "inactive", "deleted").optional()
  });

  let result = schema.validate(data, { abortEarly: false });
  if (result.error) {
    console.log("Validation Errors:", result.error.details);
    result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
  }
  return result;
}

function validateBannerList(data) {
  const schema = Joi.object({
    bannerId: Joi.string().optional(),
    type: Joi.string().valid("health_insurance", "vehicle", "home", "travel", "fire", "credit_life").optional(),
    text: Joi.string().min(1).max(1000).optional(),
    offset: Joi.number().min(0).optional(),
    limit: Joi.number().min(1).optional()
  });

  let result = schema.validate(data, { abortEarly: false });
  if (result.error) {
    console.log("Validation Errors:", result.error.details);
    result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
  }
  return result;
}

module.exports = {
  validateBannerCreate,
  validateBannerUpdate,
  validateBannerList
};