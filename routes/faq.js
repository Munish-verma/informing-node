const express = require("express");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");

const { FAQ } = require("../models/faq");
const { validateFaqPost, validateFaqPut } = require("../validations/faq");
const { identityManager } = require("../middleware/auth");
const { success, failure, successList } = require("../helper/responseHelper.js");

router.post("/create", identityManager(["superAdmin"], {}), async (req, res) => {
  const { error } = validateFaqPost(req.body);
  if (error) return failure(res, req.apiId, error.details[0].message);

  const { sortOrder } = req.body;

  if (sortOrder && Number.isInteger(sortOrder)) {
    await FAQ.updateMany(
      { sortOrder: { $gte: sortOrder }, status: { $ne: "deleted" } },
      { $inc: { sortOrder: 1 } }
    );
  }

  let faq = new FAQ(_.pick(req.body, ["question", "answer", "sortOrder"]));
  faq.status = "active";
  faq.createdBy = req.jwtData.userId;

  await faq.save();
  faq = faq.toObject();
  faq.faqId = faq._id;

  return success(res, req.apiId, "FAQ created successfully", faq);
});

router.get("/list", identityManager(["superAdmin", "user"], {}), async (req, res) => {
  let criteria = {};
  criteria.status = { $ne: "deleted" };

  if (req.jwtData.role === "user") {
    criteria.status = "active";
  }

  let skipVal = isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset);
  let limitVal = isNaN(parseInt(req.query.limit)) ? 50 : parseInt(req.query.limit);

  if (req.query.text) {
    let regex = new RegExp(_.escapeRegExp(req.query.text), "i");
    criteria.$or = [{ question: regex }, { answer: regex }];
  }

  if (req.query.status) criteria.status = req.query.status;
  if (req.query.faqId) criteria._id = new mongoose.Types.ObjectId(req.query.faqId);

  let faqList = await FAQ.aggregate([
    { $match: criteria },
    {
      $facet: {
        allDocs: [{ $group: { _id: null, count: { $sum: 1 } } }],
        paginatedDocs: [
          { $sort: { sortOrder: 1, _id: -1 } },
          { $skip: skipVal },
          { $limit: limitVal },
          { $addFields: { faqId: "$_id" } },
          { $project: { _id: 0 } },
        ],
      },
    },
  ]);

  let totalCount =
    faqList[0].allDocs.length > 0 ? faqList[0].allDocs[0].count : 0;
  faqList = faqList[0].paginatedDocs;
  return successList(res, req.apiId, "Faq list", totalCount, faqList)
});

router.put("/update", identityManager(["superAdmin"], {}), async (req, res) => {
  const { error } = validateFaqPut(req.body);
  if (error) return failure(res, req.apiId, error.details[0].message);

  let faq = await FAQ.findById(req.body.faqId);
  if (!faq) return failure(res, req.apiId, "Invalid FAQ");

  const { sortOrder } = req.body;

  // If admin wants to change sortOrder → shift others
  if (sortOrder && Number.isInteger(sortOrder) && sortOrder !== faq.sortOrder) {
    await FAQ.updateMany(
      { sortOrder: { $gte: sortOrder }, status: { $ne: "deleted" }, _id: { $ne: faq._id } },
      { $inc: { sortOrder: 1 } }
    );
    faq.sortOrder = sortOrder;
  }

  faq.question = req.body.question || faq.question;
  faq.answer = req.body.answer || faq.answer;
  faq.status = req.body.status || faq.status;

  await faq.save();
  faq = faq.toObject();
  faq.faqId = faq._id;

  return success(res, req.apiId, "FAQ updated successfully", faq);
});

router.delete("/delete/:faqId", identityManager(["superAdmin"], {}), async (req, res) => {
  let faq = await FAQ.findOne({
    _id: req.params.faqId,
    status: { $ne: "deleted" },
  });
  if (!faq) return failure(res, req.apiId, "Invalid FAQ");

  await FAQ.updateOne(
    { _id: req.params.faqId },
    { $set: { status: "deleted" } }
  );
  return success(res, req.apiId, "FAQ deleted successfully", {});
});

module.exports = router;
