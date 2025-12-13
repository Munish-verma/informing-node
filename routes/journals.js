"use strict";
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const { success, successList, failure } = require("../helper/responseHelper.js");
const { identityManager } = require("../middleware/auth.js");
const { JOURNAL_CONSTANTS } = require("../config/constant.js");
const { Journal } = require("../models/journal.js");
const { validateJournalCreate, validateJournalUpdate, validateJournalList } = require("../validations/journal.js");

router.post("/", identityManager(["superAdmin"]), async (req, res) => {
    const { error } = validateJournalCreate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const newJournal = new Journal({
        title: req.body.title,
        acronym: req.body.acronym,
        overviewDescription: req.body.overviewDescription,
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

    await newJournal.save();

    const response = _.pick(newJournal.toObject(), [
        "_id",
        "title",
        "acronym",
        "overviewDescription",
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

    return success(res, req.apiId, JOURNAL_CONSTANTS.CREATE_SUCCESS, response);
});

router.put("/", identityManager(["superAdmin"]), async (req, res) => {
    const { error } = validateJournalUpdate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const journalId = req.body.journalId;
    if (!mongoose.Types.ObjectId.isValid(journalId)) return failure(res, req.apiId, JOURNAL_CONSTANTS.INVALID_JOURNAL_ID);

    const journal = await Journal.findById(journalId);
    if (!journal) return failure(res, req.apiId, JOURNAL_CONSTANTS.NOT_FOUND);

    if (req.body.title) journal.title = req.body.title;
    if (req.body.acronym) journal.acronym = req.body.acronym;
    if (req.body.overviewDescription) journal.overviewDescription = req.body.overviewDescription;
    if (req.body.legacyExternalUrl) journal.legacyExternalUrl = req.body.legacyExternalUrl;
    if (req.body.callForPapersMessage) journal.callForPapersMessage = req.body.callForPapersMessage;
    if (req.body.onlineIssn) journal.onlineIssn = req.body.onlineIssn;
    if (req.body.printIssn) journal.printIssn = req.body.printIssn;
    if (req.body.status) journal.status = req.body.status;
    if (req.body.minimumTopicsPerArticle) journal.minimumTopicsPerArticle = req.body.minimumTopicsPerArticle;
    if (req.body.defaultEditorDueDate) journal.defaultEditorDueDate = req.body.defaultEditorDueDate;
    if (req.body.defaultReviewerDueDate) journal.defaultReviewerDueDate = req.body.defaultReviewerDueDate;
    if (req.body.defaultTotalReviewers) journal.defaultTotalReviewers = req.body.defaultTotalReviewers;
    if (req.body.hasOwnProperty("isAllow")) journal.isAllow = req.body.isAllow;

    journal.updatedDate = Math.round(new Date() / 1000);

    await journal.save();

    const response = _.pick(journal.toObject(), [
        "_id",
        "title",
        "acronym",
        "overviewDescription",
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

    return success(res, req.apiId, JOURNAL_CONSTANTS.UPDATE_SUCCESS, response);
});

router.delete("/:id", identityManager(["superAdmin"]), async (req, res) => {
    const journalId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(journalId)) return failure(res, req.apiId, JOURNAL_CONSTANTS.INVALID_JOURNAL_ID);

    const journal = await Journal.findById(journalId);
    if (!journal) return failure(res, req.apiId, JOURNAL_CONSTANTS.NOT_FOUND);

    await journal.deleteOne({ _id: journal._id });

    return success(res, req.apiId, JOURNAL_CONSTANTS.DELETE_SUCCESS);
});

router.get("/list", identityManager(["user", "superAdmin", "admin"]), async (req, res) => {
    const { error } = validateJournalList(req.query);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const criteria = {};

    const skipVal = isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset);
    const limitVal = isNaN(parseInt(req.query.limit)) ? 100 : parseInt(req.query.limit);

    if (req.query.journalId) criteria._id = new mongoose.Types.ObjectId(req.query.journalId);
    if (req.query.type) criteria.type = req.query.type;
    if (req.query.text) {
        const regexText = new RegExp(req.query.text, "i");
        criteria.$or = [{ title: regexText }];
    }

    const list = await Journal.aggregate([
        { $match: criteria },
        { $sort: { insertDate: -1 } },
        {
            $project: {
                _id: 0,
                journalId: "$_id",
                title: 1,
                acronym: 1,
                overviewDescription: 1,
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
    let journal = list[0].paginatedDocs;

    return successList(res, req.apiId, JOURNAL_CONSTANTS.LIST_SUCCESS, totalCount, journal);
});

router.get("/combinelist", identityManager(["user", "superAdmin", "admin"]), async (req, res) => {

    const criteria = {};

    const skipVal = isNaN(parseInt(req.query.offset))
        ? 0
        : parseInt(req.query.offset);
    const limitVal = isNaN(parseInt(req.query.limit))
        ? 100
        : parseInt(req.query.limit);

    // Search
    if (req.query.text) {
        const regexText = new RegExp(req.query.text, "i");
        criteria.$or = [{ acronym: regexText }];
    }

    const list = await Journal.aggregate([
        { $match: criteria },

        // Add a type to identify from which collection
        { $addFields: { source: "journal" } },

        // Combine with Conference
        {
            $unionWith: {
                coll: "conferences", // your conference collection name
                pipeline: [
                    { $match: criteria },
                    { $addFields: { source: "conference" } }
                ]
            }
        },

        // Sort latest
        { $sort: { acronym: 1 } },

        // Only return acronym + type + id
        {
            $project: {
                _id: 0,
                id: "$_id",
                acronym: 1,
                source: 1
            }
        },

        // Count + Pagination
        {
            $facet: {
                allDocs: [{ $group: { _id: null, totalCount: { $sum: 1 } } }],
                paginatedDocs: [{ $skip: skipVal }, { $limit: limitVal }]
            }
        }
    ]);

    let totalCount =
        list[0].allDocs.length > 0 ? list[0].allDocs[0].totalCount : 0;
    let combined = list[0].paginatedDocs;

    return successList(
        res,
        req.apiId,
        "COMBINED LIST SUCCESS",
        totalCount,
        combined
    );
}
);


module.exports = router;