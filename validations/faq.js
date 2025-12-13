const Joi = require("joi");

function validateFaqPost(body) {
  const schema = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    sortOrder: Joi.number().optional(),
  });
  return schema.validate(body);
}

function validateFaqPut(body) {
  const schema = Joi.object({
    faqId: Joi.string().required(),
    question: Joi.string().optional(),
    answer: Joi.string().optional(),
    sortOrder: Joi.number().optional(),
    status: Joi.string().valid("active", "inactive", "deleted").optional(),
  });
  return schema.validate(body);
}

module.exports = { validateFaqPost, validateFaqPut };
