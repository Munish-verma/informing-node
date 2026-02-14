const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const router = express.Router();
const { Webview, validateWebviewPost } = require("../models/webview.js");
const { identityManager } = require("../middleware/auth");
const { WEBVIEW_CONSTANTS } = require("../config/constant.js");
const { success, successList, failure, internalError } = require("../helper/responseHelper.js");


//create and update
router.post("/", identityManager(["admin"]), async (req, res) => {
    const { error } = validateWebviewPost(req.body);
    if (error) return res.status(400).send({ apiId: req.apiId, statusCode: 400, message: "Failure", data: { message: error.details[0].message } });

    let oldDoc = await Webview.findOne({ type: req.body.type, locale: req.body.locale });
    if (oldDoc) {
        await Webview.updateOne({ type: req.body.type, locale: req.body.locale }, { $set: { url: req.body.url,locale: req.body.locale } });
        return res.send({ apiId: req.apiId, statusCode: 200, message: "Success", data: { message: WEBVIEW_CONSTANTS.UPDATED } });
    } else {
        newDoc = new Webview({ type: req.body.type, url: req.body.url, locale: req.body.locale });
        newDoc.save();
        return res.send({ apiId: req.apiId, statusCode: 200, message: "Success", data: { message: WEBVIEW_CONSTANTS.CREATED } });
    }
});

//view 
router.get("/", identityManager(["user", "admin"]), async (req, res) => {
  const criteria = {};
  const skipVal = isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset);
  const limitVal = isNaN(parseInt(req.query.limit)) ? 100 : parseInt(req.query.limit);

  if (req.query.status) criteria.status = req.query.status;
  if (req.query.locale) criteria.locale = req.query.locale;

  const projection = { 
    _id: 1, 
    status: 1, 
    url: 1, 
    type: 1, 
    insertDate: 1, 
    locale: 1 
  };

  const webview = await Webview.aggregate([
    { $match: criteria },
    { $sort: { insertDate: -1 } },
    { $project: projection },
    { $facet: { 
        allDocs: [{ $group: { _id: null, totalCount: { $sum: 1 } } }],
        paginatedDocs: [{ $skip: skipVal }, { $limit: limitVal }]
      }
    }
  ]);

  let totalCount = webview[0].allDocs.length > 0 ? webview[0].allDocs[0].totalCount : 0;
  let results = webview[0].paginatedDocs;

  return successList(res, req.apiId, "Webview list retrieved successfully", totalCount, results);
});

//delete
router.delete("/:id", identityManager(["admin"]), async (req, res) => {
    let criteria = {};
    if (req.jwtData.role === "admin")
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send({ apiId: req.apiId, statusCode: 400, message: "Failure", data: { message: WEBVIEW_CONSTANTS.INVALID_ID } });
        }
    criteria._id = req.params.id;

    let webview = await Webview.findOne(criteria)
    if (!webview) return res.status(400).send({ apiId: req.apiId, statusCode: 400, message: "Failure", data: { message: WEBVIEW_CONSTANTS.NOT_FOUND } });
    await webview.deleteOne(criteria)
    return res.send({ apiId: req.apiId, statusCode: 200, message: "Success", data: { meaage: WEBVIEW_CONSTANTS.DELETED_SUCCESSFULLY } });
});

module.exports = router;