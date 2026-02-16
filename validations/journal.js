// validations/banner.js
"use strict";

const Joi = require("joi");
const { valMsgFormatter } = require("../services/commonFunctions");

function validateJournalCreate(data) {
    const schema = Joi.object({
        title: Joi.string().required(),
        acronym: Joi.string().required(),
        overviewDescription: Joi.string().required(),
        legacyExternalUrl: Joi.string().uri().optional().allow(""),
        callForPapersMessage: Joi.string().optional().allow(""),
        onlineIssn: Joi.string().optional().allow(""),
        printIssn: Joi.string().optional().allow(""),
        status: Joi.string().valid("draft", "published", "archived").default("draft"),
        minimumTopicsPerArticle: Joi.string().optional().allow(""),
        defaultEditorDueDate: Joi.string().optional().allow(""),
        defaultReviewerDueDate: Joi.string().optional().allow(""),
        defaultTotalReviewers: Joi.string().optional().allow(""),
        isAllow: Joi.boolean().default(false)
    });

    let result = schema.validate(data, { abortEarly: false });
    if (result.error) {
        console.log("Validation Errors:", result.error.details);
        result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
    }
    return result;
}

function validateJournalUpdate(data) {
    const schema = Joi.object({
        journalId: Joi.string().required(),
        title: Joi.string().optional(),
        acronym: Joi.string().optional(),
        overviewDescription: Joi.string().optional(),
        legacyExternalUrl: Joi.string().uri().optional().allow(""),
        callForPapersMessage: Joi.string().optional().allow(""),
        onlineIssn: Joi.string().optional().allow(""),
        printIssn: Joi.string().optional().allow(""),
        status: Joi.string().valid("draft", "published", "archived").optional(),
        minimumTopicsPerArticle: Joi.string().optional().allow(""),
        defaultEditorDueDate: Joi.string().optional().allow(""),
        defaultReviewerDueDate: Joi.string().optional().allow(""),
        defaultTotalReviewers: Joi.string().optional().allow(""),
        isAllow: Joi.boolean().optional()
    });

    let result = schema.validate(data, { abortEarly: false });
    if (result.error) {
        console.log("Validation Errors:", result.error.details);
        result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
    }
    return result;
}

function validateJournalList(data) {
    const schema = Joi.object({
        journalId: Joi.string().optional(),
        title: Joi.string().optional(),
        acronym: Joi.string().optional(),
        status: Joi.string().valid("draft", "published", "archived").optional(),
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
    validateJournalCreate,
    validateJournalUpdate,
    validateJournalList
};