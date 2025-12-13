const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectID = require("joi-objectid")(Joi);
const { valMsgFormatter } = require("../services/commonFunctions");

const webviewSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["termsNConditions", "privacyPolicy"],
  },
  locale: {
    type: String,
    enum: ["en", "ar"],
  },
  url: { type: String, default: "" },
  type: { type: String, default: "" },
  insertDate: {
    type: Number,
    default: () => {
      return Math.round(new Date() / 1000);
    },
  },
});
const Webview = mongoose.model("Webview", webviewSchema);


function validateWebviewPost(req) {
  const schema = Joi.object({
    type: Joi.string()
      .valid("termsNConditions", "privacyPolicy")
      .required(),
    locale: Joi.string()
      .valid("en", "ar")
      .required(),
    url: Joi.string().min(1).required()
  });
  let result = schema.validate(req);
  if (result.error)
    result.error.details[0].message = valMsgFormatter(
      result.error.details[0].message
    );
  return result;
}

module.exports.Webview = Webview;
module.exports.validateWebviewPost = validateWebviewPost;