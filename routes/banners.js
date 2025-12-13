"use strict";
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const { success, successList, failure, internalError } = require("../helper/responseHelper.js");
const { identityManager } = require("../middleware/auth.js");
const { BANNER_CONSTANTS } = require("../config/constant.js");
const { Banner } = require("../models/banner.js");
const { validateBannerCreate, validateBannerUpdate, validateBannerList } = require("../validations/banner.js");

router.post("/", identityManager(["admin"]), async (req, res) => {
    const { error } = validateBannerCreate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const newBanner = new Banner({
      imageUrl: req.body.imageUrl,
      title: req.body.title,
      description: req.body.description,
      companyName: req.body.companyName,
      type: req.body.type,
      status: "active",
      insertDate: Math.round(new Date() / 1000)
    });

    await newBanner.save();

    const response = _.pick(newBanner.toObject(), [
      "_id",
      "imageUrl",
      "title",
      "description",
      "companyName",
      "type",
      "status",
      "insertDate"
    ]);

    return success(res, req.apiId, BANNER_CONSTANTS.CREATE_SUCCESS, response);
});

router.put("/", identityManager(["admin"]), async (req, res) => {
    const { error } = validateBannerUpdate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const bannerId = req.body.bannerId;
    if (!mongoose.Types.ObjectId.isValid(bannerId)) return failure(res, req.apiId, BANNER_CONSTANTS.INVALID_BANNER_ID);

    const banner = await Banner.findById(bannerId);
    if (!banner) return failure(res, req.apiId, BANNER_CONSTANTS.NOT_FOUND);

    if (req.body.imageUrl) banner.imageUrl = req.body.imageUrl;
    if (req.body.title) banner.title = req.body.title;
    if (req.body.description) banner.description = req.body.description;
    if (req.body.companyName) banner.companyName = req.body.companyName;
    if (req.body.type) banner.type = req.body.type;
    if (req.body.status) banner.status = req.body.status;
    banner.updateDate = Math.round(new Date() / 1000);

    await banner.save();

    const response = _.pick(banner.toObject(), [
      "_id",
      "imageUrl",
      "title",
      "description",
      "companyName",
      "type",
      "status",
      "insertDate",
      "updateDate"
    ]);

    return success(res, req.apiId, BANNER_CONSTANTS.UPDATE_SUCCESS, response);
});

router.delete("/:id", identityManager(["admin"]), async (req, res) => {
    const bannerId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bannerId)) return failure(res, req.apiId, BANNER_CONSTANTS.INVALID_BANNER_ID);

    const banner = await Banner.findById(bannerId);
    if (!banner) return failure(res, req.apiId, BANNER_CONSTANTS.NOT_FOUND);

    banner.status = "deleted";
    banner.deletionDate = Math.round(new Date() / 1000);
    await banner.save();

    return success(res, req.apiId, BANNER_CONSTANTS.DELETE_SUCCESS);
});

router.get("/list", identityManager(["user", "manager", "admin"]), async (req, res) => {
    const { error } = validateBannerList(req.query);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const criteria = { status: "active" };

    const skipVal = isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset);
    const limitVal = isNaN(parseInt(req.query.limit)) ? 100 : parseInt(req.query.limit);

    if (req.query.bannerId) criteria._id = new mongoose.Types.ObjectId(req.query.bannerId);
    if (req.query.type) criteria.type = req.query.type;
    if (req.query.text) {
      const regexText = new RegExp(req.query.text, "i");
      criteria.$or = [{ title: regexText }, { description: regexText }, { companyName: regexText }];
    }

    const list = await Banner.aggregate([
      { $match: criteria },
      { $sort: { insertDate: -1 } },
      {
        $project: {
          _id: 0,
          bannerId: "$_id",
          imageUrl: 1,
          title: 1,
          description: 1,
          companyName: 1,
          type: 1,
          status: 1,
          insertDate: 1,
          updateDate: 1
        }
      },
      {
        $facet: {
          allDocs: [{ $group: { _id: null, totalCount: { $sum: 1 } } }],
          paginatedDocs: [{ $skip: skipVal }, { $limit: limitVal }]
        }
      }
    ]);

    let totalCount = list[0].allDocs.length > 0 ? list[0].allDocs[0].totalCount : 0;
    let banners = list[0].paginatedDocs;

    return successList(res, req.apiId, BANNER_CONSTANTS.LIST_SUCCESS, totalCount, banners);
});

module.exports = router;