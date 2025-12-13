"use strict";
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const { success, successList, failure } = require("../helper/responseHelper.js");
const { identityManager } = require("../middleware/auth.js");
const { CONFERENCE_CONSTANTS } = require("../config/constant.js");
const { Conference } = require("../models/conference.js");
const { validateConferenceCreate, validateConferenceUpdate, validateConferenceList } = require("../validations/conference.js");
const { messaging } = require("firebase-admin");

router.post("/", identityManager(["superAdmin"]), async (req, res) => {
    const { error } = validateConferenceCreate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const newConference = new Conference({
        title: req.body.title,
        acronym: req.body.acronym,
        message: req.body.message,
        legacyExternalUrl: req.body.legacyExternalUrl,
        callForPapersMessage: req.body.callForPapersMessage,
        onlineIssn: req.body.onlineIssn,
        printIssn: req.body.printIssn,
        status: req.body.status,
        minimumTopicsPerArticle: req.body.minimumTopicsPerArticle,
        defaultEditorDueDate: req.body.defaultEditorDueDate,
        defaultReviewerDueDate: req.body.defaultReviewerDueDate,
        defaultTotalReviewers: req.body.defaultTotalReviewers,
        isAllow: req.body.isAllow,
    });

    await newConference.save();

    const response = _.pick(newConference.toObject(), [
        "_id",
        "title",
        "acronym",
        "message",
        "legacyExternalUrl",
        "callForPapersMessage",
        "onlineIssn",
        "printIssn",
        "status",
        "minimumTopicsPerArticle",
        "defaultEditorDueDate",
        "defaultReviewerDueDate",
        "defaultTotalReviewers",
        "isAllow",
        "insertDate"
    ]);

    return success(res, req.apiId, CONFERENCE_CONSTANTS.CREATE_SUCCESS, response);
});

router.put("/", identityManager(["superAdmin"]), async (req, res) => {
    const { error } = validateConferenceUpdate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const conferenceId = req.body.conferenceId;
    if (!mongoose.Types.ObjectId.isValid(conferenceId)) return failure(res, req.apiId, CONFERENCE_CONSTANTS.INVALID_JOURNAL_ID);

    const conference = await Conference.findById(conferenceId);
    if (!conference) return failure(res, req.apiId, CONFERENCE_CONSTANTS.NOT_FOUND);

    if (req.body.title) conference.title = req.body.title;
    if (req.body.acronym) conference.acronym = req.body.acronym;
    if (req.body.message) conference.message = req.body.message;
    if (req.body.legacyExternalUrl) conference.legacyExternalUrl = req.body.legacyExternalUrl;
    if (req.body.callForPapersMessage) conference.callForPapersMessage = req.body.callForPapersMessage;
    if (req.body.onlineIssn) conference.onlineIssn = req.body.onlineIssn;
    if (req.body.printIssn) conference.printIssn = req.body.printIssn;
    if (req.body.status) conference.status = req.body.status;
    if (req.body.minimumTopicsPerArticle) conference.minimumTopicsPerArticle = req.body.minimumTopicsPerArticle;
    if (req.body.defaultEditorDueDate) conference.defaultEditorDueDate = req.body.defaultEditorDueDate;
    if (req.body.defaultReviewerDueDate) conference.defaultReviewerDueDate = req.body.defaultReviewerDueDate;
    if (req.body.defaultTotalReviewers) conference.defaultTotalReviewers = req.body.defaultTotalReviewers;
    if (req.body.hasOwnProperty("isAllow")) conference.isAllow = req.body.isAllow;

    conference.updatedDate = Math.round(new Date() / 1000);

    await conference.save();

    const response = _.pick(conference.toObject(), [
        "_id",
        "title",
        "acronym",
        "message",
        "legacyExternalUrl",
        "callForPapersMessage",
        "onlineIssn",
        "printIssn",
        "status",
        "minimumTopicsPerArticle",
        "defaultEditorDueDate",
        "defaultReviewerDueDate",
        "defaultTotalReviewers",
        "isAllow",
        "insertDate",
        "updatedDate"
    ]);

    return success(res, req.apiId, CONFERENCE_CONSTANTS.UPDATE_SUCCESS, response);
});

router.delete("/:id", identityManager(["superAdmin"]), async (req, res) => {
    const conferenceId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(conferenceId)) return failure(res, req.apiId, CONFERENCE_CONSTANTS.INVALID_BANNER_ID);

    const conference = await Conference.findById(conferenceId);
    if (!conference) return failure(res, req.apiId, CONFERENCE_CONSTANTS.NOT_FOUND);

    await conference.deleteOne({ _id: conference._id });

    return success(res, req.apiId, CONFERENCE_CONSTANTS.DELETE_SUCCESS);
});

router.get("/list", identityManager(["user", "superAdmin", "admin"]), async (req, res) => {
    const { error } = validateConferenceList(req.query);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const criteria = {};

    const skipVal = isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset);
    const limitVal = isNaN(parseInt(req.query.limit)) ? 100 : parseInt(req.query.limit);

    if (req.query.conferenceId) criteria._id = new mongoose.Types.ObjectId(req.query.conferenceId);
    if (req.query.type) criteria.type = req.query.type;
    if (req.query.text) {
        const regexText = new RegExp(req.query.text, "i");
        criteria.$or = [{ title: regexText }];
    }

    const list = await Conference.aggregate([
        { $match: criteria },
        { $sort: { insertDate: -1 } },
        {
            $project: {
                _id: 0,
                conferenceId: "$_id",
                title: 1,
                acronym: 1,
                message: 1,
                legacyExternalUrl: 1,
                callForPapersMessage: 1,
                onlineIssn: 1,
                printIssn: 1,
                status: 1,
                minimumTopicsPerArticle: 1,
                defaultEditorDueDate: 1,
                defaultReviewerDueDate: 1,
                defaultTotalReviewers: 1,
                isAllow: 1,
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
    let conference = list[0].paginatedDocs;

    return successList(res, req.apiId, CONFERENCE_CONSTANTS.LIST_SUCCESS, totalCount, conference);
});

module.exports = router;