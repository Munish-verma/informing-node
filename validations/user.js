"use strict";

const Joi = require("joi");
const { valMsgFormatter } = require("../services/commonFunctions.js");
const { add } = require("lodash");
const { note } = require("pdfkit");

function validateUserRegister(req) {
  const schema = Joi.object({
    personalName: Joi.string().required(),
    middleInitial: Joi.string().allow(""),
    familyName: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    email: Joi.string().required(),
    affiliationUniversity: Joi.string().required(),
    department: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid("user", "eic", "admin").required(),
  });

  const result = schema.validate(req);
  if (result.error) {
    result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
  }
  return result;
}

function validateUserLogin(req) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    deviceToken: Joi.string().optional().allow("")
  });
  const result = schema.validate(req);
  if (result.error) {
    result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
  }
  return result;
}


function validateUserEdit(req) {
  const schema = Joi.object({
    userId: Joi.string(),
    personalTitle: Joi.string().valid("Mr", "Ms", "Dr", "Prof", "").optional().allow(""),
    // role: Joi.string().valid("user", "eic", "admin").optional().allow(""),
    role: Joi.array().items(
      Joi.string().valid("user", "eic", "admin")
    ).optional(),
    personalName: Joi.string().allow(""),
    middleInitial: Joi.string().allow(""),
    familyName: Joi.string().allow(""),
    gender: Joi.string().valid("female", "male", "other").optional().allow(""),
    profilePic: Joi.string().allow(""),
    address: Joi.string().allow(""),
    email: Joi.string().optional(),
    city: Joi.string().allow(""),
    stateProvince: Joi.string().allow(""),
    postalCode: Joi.string().allow(""),
    country: Joi.string().allow(""),
    primaryTelephone: Joi.string().allow(""),
    secondaryTelephone: Joi.string().allow(""),
    receiveSecondaryEmail: Joi.string().optional().allow(""),
    affiliationUniversity: Joi.string().max(255).optional().allow(""),
    department: Joi.string().max(255).optional().allow(""),
    positionTitle: Joi.string().max(255).optional().allow(""),
    orcid: Joi.string().optional().allow(""),
    resume: Joi.string().uri().optional().allow(""),
    bio: Joi.string().max(1000).optional().allow(""),
    note: Joi.string().max(500).optional().allow(""),
    allowProfile: Joi.boolean().optional(),
    receivePrimaryEmail: Joi.boolean().optional(),
    receiveReminderEmail: Joi.boolean().optional(),
    isPendingAuthor: Joi.boolean().optional(),
    isiFounder: Joi.boolean().optional(),
    isDuplicate: Joi.boolean().optional(),
    unsubscribe: Joi.boolean().optional(),
    websiteUrl: Joi.string().uri().optional().allow(""),
    socialMedia: Joi.object({
      twitter: Joi.string().uri().optional().allow(""),
      facebook: Joi.string().uri().optional().allow(""),
      googlePlus: Joi.string().uri().optional().allow(""),
      linkedin: Joi.string().uri().optional().allow("")
    }).optional(),
    isiPositions: Joi.array().items(
      Joi.string().valid(
        "executive_director",
        "governor",
        "fellow",
        "honorary_fellow",
        "director",
        "ambassador",
        "second_act",
        "gackowski_award_winner",
        "isi_founder",
        "governor_emeritus",
        "alumni",
        "landing_page",
        "in_watchList",
        "presented_paper",
        "best_paper",
      )
    ).optional(),

    // Of the Month Feature
    isReviewerEditorOfMonth: Joi.boolean().optional(),
    ofTheMonth: Joi.object({
      type: Joi.string().valid("reviewer", "editor", "").optional().allow(""),
      month: Joi.string().valid("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "").optional().allow(""),
      year: Joi.string().pattern(/^\d{4}$/).optional().allow(""),
    }).optional(),

    testimonial: Joi.string().max(150).optional().allow(""),
    // Membership
    memberUntil: Joi.string().optional().allow(""),
    membershipTypes: Joi.string().valid("isi_member", "isi_sponsored_member", "").optional().allow(""),
    status: Joi.string().valid("active", "inactive", "deleted", "").optional().allow("active"),
  });
  const result = schema.validate(req);
  if (result.error) {
    result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
  }
  return result;
}

function validateForgotResetPasswordEmail(req) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    otpToken: Joi.number().integer().required(),
    newPassword: Joi.string().min(10).max(250).pattern(/^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{10,}$/).required().messages({ 'string.pattern.base': 'Password must be at least 10 characters and include at least one special character' }),
    confirmPassword: Joi.any().equal(Joi.ref('newPassword')).required()
      .label('Confirm password')
      .options({ messages: { 'any.only': '{{#label}} does not match' } }),
  });

  const result = schema.validate(req);
  if (result.error) {
    result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
  }
  return result;
}

function validateChangePassword(req) {
  const schema = Joi.object({
    oldPassword: Joi.string().min(10).required(),
    newPassword: Joi.string().min(10).max(250).pattern(/^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{10,}$/).required().messages({ 'string.pattern.base': 'Password must be at least 10 characters and include at least one special character' }),
  });
  const result = schema.validate(req);
  if (result.error) {
    result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
  }
  return result;
}

module.exports = {
  validateUserRegister,
  validateUserEdit,
  validateUserLogin,
  validateForgotResetPasswordEmail,
  validateChangePassword
};