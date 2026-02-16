// validations/banner.js
"use strict";

const Joi = require("joi");
const { valMsgFormatter } = require("../services/commonFunctions");

function validateTopicCreate(data) {
    const schema = Joi.object({
        name: Joi.string().required(),
        minSelections: Joi.string().optional().allow(""),
        maxSelections: Joi.string().optional().allow(""),
    });

    let result = schema.validate(data, { abortEarly: false });
    if (result.error) {
        console.log("Validation Errors:", result.error.details);
        result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
    }
    return result;
}

function validateTopicUpdate(data) {
    const schema = Joi.object({
        topicId: Joi.string().required(),
        name: Joi.string().required(),
        minSelections: Joi.string().optional().allow(""),
        maxSelections: Joi.string().optional().allow(""),
    });

    let result = schema.validate(data, { abortEarly: false });
    if (result.error) {
        console.log("Validation Errors:", result.error.details);
        result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
    }
    return result;
}

function validateTopicList(data) {
    const schema = Joi.object({
        topicId: Joi.string().optional(),
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



function validateSubTopicCreate(data) {
    const schema = Joi.object({
        topicId: Joi.string().required(),
        name: Joi.string().required(),
        minSelections: Joi.string().optional().allow(""),
        maxSelections: Joi.string().optional().allow(""),
    });

    let result = schema.validate(data, { abortEarly: false });
    if (result.error) {
        console.log("Validation Errors:", result.error.details);
        result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
    }
    return result;
}

function validateSubTopicUpdate(data) {
    const schema = Joi.object({
        subTopicId: Joi.string().required(),
        topicId: Joi.string().required(),
        name: Joi.string().required(),
        minSelections: Joi.string().optional().allow(""),
        maxSelections: Joi.string().optional().allow(""),
    });

    let result = schema.validate(data, { abortEarly: false });
    if (result.error) {
        console.log("Validation Errors:", result.error.details);
        result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
    }
    return result;
}

function validateSubTopicList(data) {
    const schema = Joi.object({
        subTopicId: Joi.string().optional(),
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

function validateTrackCreate(data) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional().allow(""),
    });

    let result = schema.validate(data, { abortEarly: false });
    if (result.error) {
        console.log("Validation Errors:", result.error.details);
        result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
    }
    return result;
}

function validateTrackUpdate(data) {
    const schema = Joi.object({
        trackId: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().optional().allow(""),
    });

    let result = schema.validate(data, { abortEarly: false });
    if (result.error) {
        console.log("Validation Errors:", result.error.details);
        result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
    }
    return result;
}

function validateTrackList(data) {
    const schema = Joi.object({
        trackId: Joi.string().optional(),
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

function validateArticleCreate(data) {
    const schema = Joi.object({
        name: Joi.string().required(),
    });

    let result = schema.validate(data, { abortEarly: false });
    if (result.error) {
        console.log("Validation Errors:", result.error.details);
        result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
    }
    return result;
}

function validateArticleUpdate(data) {
    const schema = Joi.object({
        articleId: Joi.string().required(),
        name: Joi.string().required(),
    });

    let result = schema.validate(data, { abortEarly: false });
    if (result.error) {
        console.log("Validation Errors:", result.error.details);
        result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
    }
    return result;
}

function validateArticleList(data) {
    const schema = Joi.object({
        articleId: Joi.string().optional(),
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

function validateTopicReorder(data) {
    const schema = Joi.object({
        type: Joi.string().valid('topic', 'subtopic').default('topic'),
        items: Joi.array().items(
            Joi.object({
                _id: Joi.string().required(),
                sortOrder: Joi.number().required()
            })
        ).required().min(1)
    });

    let result = schema.validate(data, { abortEarly: false });
    if (result.error) {
        console.log("Validation Errors:", result.error.details);
        result.error.details[0].message = valMsgFormatter(result.error.details[0].message);
    }
    return result;
}


module.exports = {
    validateTopicCreate,
    validateTopicUpdate,
    validateTopicList,
    validateSubTopicCreate,
    validateSubTopicUpdate,
    validateSubTopicList,
    validateTrackCreate,
    validateTrackUpdate,
    validateTrackList,
    validateArticleCreate,
    validateArticleUpdate,
    validateArticleList,
    validateTopicReorder
};