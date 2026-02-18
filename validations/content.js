// validations/banner.js
"use strict";

const Joi = require("joi");
const { valMsgFormatter } = require("../services/commonFunctions");

function validateContentCreate(data) {
    const schema = Joi.object({
        pageType: Joi.string().valid("about").default("about"),
        description: Joi.string().optional().allow(""),
    });

    let result = schema.validate(data, { abortEarly: false });
    if (result.error) {
        console.log("Validation Errors:", result.error.details);
        result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
    }
    return result;
}

function validateContentUpdate(data) {
    const schema = Joi.object({
        id: Joi.string().required(),
        pageType: Joi.string().valid("about").optional(),
        description: Joi.string().required(),
    });

    let result = schema.validate(data, { abortEarly: false });
    if (result.error) {
        console.log("Validation Errors:", result.error.details);
        result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
    }
    return result;
}

module.exports = {
    validateContentCreate,
    validateContentUpdate
};