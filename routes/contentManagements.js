"use strict";
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const { success, successList, failure } = require("../helper/responseHelper.js");
const { identityManager } = require("../middleware/auth.js");
const { CONTENT_CONSTANTS } = require("../config/constant.js");
const { ContentManagement } = require("../models/contentManagement.js");
const { validateContentCreate, validateContentUpdate } = require("../validations/content.js");

router.post("/", identityManager(["superAdmin"]), async (req, res) => {
    const { error } = validateContentCreate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const newContent = new ContentManagement({
        description: req.body.description,
        pageType: req.body.pageType,
    });

    await newContent.save();

    const response = _.pick(newContent.toObject(), [
        "_id",
        "description",
        "pageType",
        "insertDate"
    ]);

    return success(res, req.apiId, CONTENT_CONSTANTS.CREATE_SUCCESS, response);
});

router.put("/", identityManager(["superAdmin"]), async (req, res) => {
    const { error } = validateContentUpdate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const contentId = req.body.id;
    if (!mongoose.Types.ObjectId.isValid(contentId)) return failure(res, req.apiId, CONTENT_CONSTANTS.INVALID_JOURNAL_ID);

    const newContent = await ContentManagement.findById(contentId);
    if (!newContent) return failure(res, req.apiId, CONTENT_CONSTANTS.NOT_FOUND);

    if (req.body.pageType) newContent.pageType = req.body.pageType;
    if (req.body.description) newContent.description = req.body.description;

    newContent.updatedDate = Math.round(new Date() / 1000);

    await newContent.save();

    const response = _.pick(newContent.toObject(), [
        "_id",
        "pageType",
        "description",
        "insertDate",
        "updatedDate"
    ]);

    return success(res, req.apiId, CONTENT_CONSTANTS.UPDATE_SUCCESS, response);
});

router.delete("/:id", identityManager(["superAdmin"]), async (req, res) => {
    const contentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(contentId)) return failure(res, req.apiId, CONTENT_CONSTANTS.INVALID_JOURNAL_ID);

    const content = await ContentManagement.findById(contentId);
    if (!content) return failure(res, req.apiId, CONTENT_CONSTANTS.NOT_FOUND);

    await content.deleteOne({ _id: content._id });

    return success(res, req.apiId, CONTENT_CONSTANTS.DELETE_SUCCESS);
});

router.get("/list", identityManager(["user", "superAdmin", "admin"]), async (req, res) => {
    const criteria = {};

    const skipVal = isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset);
    const limitVal = isNaN(parseInt(req.query.limit)) ? 100 : parseInt(req.query.limit);

    if (req.query.type) criteria.pageType = req.query.type;
    if (req.query.text) {
        const regexText = new RegExp(req.query.text, "i");
        criteria.$or = [{ title: regexText }];
    }

    const list = await ContentManagement.aggregate([
        { $match: criteria },
        { $sort: { insertDate: -1 } },
        {
            $project: {
                _id: 1,
                pageType: 1,
                description: 1,
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
    let content = list[0].paginatedDocs;

    return successList(res, req.apiId, CONTENT_CONSTANTS.LIST_SUCCESS, totalCount, content);
});



module.exports = router;