"use strict";
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const { success, successList, failure } = require("../helper/responseHelper.js");
const { identityManager } = require("../middleware/auth.js");
const { TOPIC_CONSTANTS } = require("../config/constant.js");
const { Topic, SubTopic, Track, Article } = require("../models/topic.js");
const { validateTopicCreate,
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
} = require("../validations/topic.js");

router.post("/", identityManager(["superAdmin"]), async (req, res) => {
    const { error } = validateTopicCreate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const lastTopic = await Topic.findOne().sort({ sortOrder: -1 });
    const newSortOrder = lastTopic ? lastTopic.sortOrder + 1 : 0;

    const newTopic = new Topic({
        name: req.body.name,
        minSelections: req.body.minSelections,
        maxSelections: req.body.maxSelections,
        sortOrder: newSortOrder

    });

    await newTopic.save();

    const response = _.pick(newTopic.toObject(), [
        "_id",
        "name",
        "minSelections",
        "maxSelections",
        "insertDate"
    ]);

    return success(res, req.apiId, TOPIC_CONSTANTS.CREATE_SUCCESS, response);
});

router.put("/", identityManager(["superAdmin"]), async (req, res) => {
    const { error } = validateTopicUpdate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const topicId = req.body.topicId;
    if (!mongoose.Types.ObjectId.isValid(topicId)) return failure(res, req.apiId, TOPIC_CONSTANTS.INVALID_TOPIC_ID);

    const topic = await Topic.findById(topicId);
    if (!topic) return failure(res, req.apiId, TOPIC_CONSTANTS.NOT_FOUND);

    if (req.body.name) topic.title = req.body.title;
    if (req.body.minSelections) topic.minSelections = req.body.minSelections;
    if (req.body.maxSelections) topic.maxSelections = req.body.maxSelections;

    await topic.save();

    const response = _.pick(topic.toObject(), [
        "_id",
        "name",
        "minSelections",
        "maxSelections",
        "insertDate",
        "updatedDate"
    ]);

    return success(res, req.apiId, TOPIC_CONSTANTS.UPDATE_SUCCESS, response);
});

router.delete("/:id", identityManager(["superAdmin"]), async (req, res) => {
    const topicId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(topicId)) return failure(res, req.apiId, TOPIC_CONSTANTS.INVALID_TOPIC_ID);

    const topic = await Topic.findById(topicId);
    if (!topic) return failure(res, req.apiId, TOPIC_CONSTANTS.NOT_FOUND);

    await topic.deleteOne({ _id: topic._id });

    return success(res, req.apiId, TOPIC_CONSTANTS.DELETE_SUCCESS);
});

router.get("/list", identityManager(["user", "superAdmin", "admin"]), async (req, res) => {
    const { error } = validateTopicList(req.query);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const criteria = {};

    const skipVal = isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset);
    const limitVal = isNaN(parseInt(req.query.limit)) ? 100 : parseInt(req.query.limit);

    if (req.query.topicId) criteria._id = new mongoose.Types.ObjectId(req.query.topicId);
    if (req.query.type) criteria.type = req.query.type;
    if (req.query.text) {
        const regexText = new RegExp(req.query.text, "i");
        criteria.$or = [{ title: regexText }];
    }

    const list = await Topic.aggregate([
        { $match: criteria },
        { $sort: { sortOrder: 1 } },
        {
            $project: {
                _id: 0,
                topicId: "$_id",
                name: 1,
                minSelections: 1,
                maxSelections: 1,
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
    let topic = list[0].paginatedDocs;

    return successList(res, req.apiId, TOPIC_CONSTANTS.LIST_SUCCESS, totalCount, topic);
});

router.get("/topic-with-subtopics", async (req, res) => {
    try {
        const { error } = validateTopicList(req.query);
        if (error) return failure(res, req.apiId, error.details[0].message);

        const criteria = {};

        const skipVal = isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset);
        const limitVal = isNaN(parseInt(req.query.limit)) ? 100 : parseInt(req.query.limit);

        if (req.query.topicId) criteria._id = new mongoose.Types.ObjectId(req.query.topicId);
        if (req.query.text) {
            const regexText = new RegExp(req.query.text, "i");
            criteria.$or = [{ name: regexText }];
        }

        // Combined aggregation
        const list = await Topic.aggregate([
            { $match: criteria },
            { $sort: { sortOrder: 1 } },

            {
                $addFields: {
                    topicIdStr: { $toString: "$_id" }
                }
            },
            {
                $lookup: {
                    from: "subtopics",
                    localField: "topicIdStr",
                    foreignField: "topicId",
                    as: "subTopics"
                }
            },

            // Project clean structure
            {
                $project: {
                    _id: 0,
                    topicId: "$_id",
                    name: 1,
                    minSelections: 1,
                    maxSelections: 1,
                    insertDate: 1,
                    updatedDate: 1,
                    subTopics: 1,
                }
            },

            // For pagination
            {
                $facet: {
                    allDocs: [{ $group: { _id: null, totalCount: { $sum: 1 } } }],
                    paginatedDocs: [{ $skip: skipVal }, { $limit: limitVal }]
                }
            }
        ]);

        const totalCount =
            list[0].allDocs.length > 0 ? list[0].allDocs[0].totalCount : 0;

        const result = list[0].paginatedDocs;

        return successList(
            res,
            req.apiId,
            "TOPIC_WITH_SUBTOPICS_LIST_SUCCESS",
            totalCount,
            result
        );

    } catch (err) {
        console.error(err);
        return failure(res, req.apiId, "INTERNAL_SERVER_ERROR");
    }
}
);

// sub topic
router.post("/sub", identityManager(["superAdmin"]), async (req, res) => {
    const { error } = validateSubTopicCreate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);
    const topicId = req.body.topicId;
    const topic = await Topic.findById(topicId);
    if (!topic) return failure(res, req.apiId, TOPIC_CONSTANTS.NOT_FOUND);


    const lastTopic = await SubTopic.findOne().sort({ sortOrder: -1 });
    const newSortOrder = lastTopic ? lastTopic.sortOrder + 1 : 0;

    const newSubTopic = new SubTopic({
        name: req.body.name,
        minSelections: req.body.minSelections,
        maxSelections: req.body.maxSelections,
        sortOrder: newSortOrder,
        topicId: topicId
    });

    await newSubTopic.save();

    const response = _.pick(newSubTopic.toObject(), [
        "_id",
        "name",
        "minSelections",
        "maxSelections",
        "insertDate"
    ]);

    return success(res, req.apiId, TOPIC_CONSTANTS.CREATE_SUCCESS, response);
});

router.put("/sub", identityManager(["superAdmin"]), async (req, res) => {
    const { error } = validateSubTopicUpdate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const subTopicId = req.body.subTopicId;
    const subTopic = await SubTopic.findById(subTopicId);
    if (!subTopic) return failure(res, req.apiId, TOPIC_CONSTANTS.NOT_FOUND);

    if (req.body.name) subTopic.name = req.body.name;
    if (req.body.minSelections) subTopic.minSelections = req.body.minSelections;
    if (req.body.maxSelections) subTopic.maxSelections = req.body.maxSelections;
    if (req.body.topicId) subTopic.topicId = req.body.topicId;

    await subTopic.save();

    const response = _.pick(subTopic.toObject(), [
        "_id",
        "name",
        "minSelections",
        "maxSelections",
        "insertDate",
        "updatedDate"
    ]);

    return success(res, req.apiId, TOPIC_CONSTANTS.UPDATE_SUCCESS, response);
});

router.delete("/sub/:id", identityManager(["superAdmin"]), async (req, res) => {
    const subTopicId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(subTopicId)) return failure(res, req.apiId, TOPIC_CONSTANTS.INVALID_TOPIC_ID);

    const subTopic = await SubTopic.findById(subTopicId);
    if (!subTopic) return failure(res, req.apiId, TOPIC_CONSTANTS.NOT_FOUND);

    await subTopic.deleteOne({ _id: subTopic._id });

    return success(res, req.apiId, TOPIC_CONSTANTS.DELETE_SUCCESS);
});

router.get("/sub/list", identityManager(["user", "superAdmin", "admin"]), async (req, res) => {
    const { error } = validateSubTopicList(req.query);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const criteria = {};

    const skipVal = isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset);
    const limitVal = isNaN(parseInt(req.query.limit)) ? 100 : parseInt(req.query.limit);

    if (req.query.subTopicId) criteria._id = new mongoose.Types.ObjectId(req.query.subTopicId);
    if (req.query.type) criteria.type = req.query.type;
    if (req.query.text) {
        const regexText = new RegExp(req.query.text, "i");
        criteria.$or = [{ title: regexText }];
    }

    const list = await SubTopic.aggregate([
        { $match: criteria },
        { $sort: { sortOrder: 1 } },
        {
            $project: {
                _id: 0,
                subTopicId: "$_id",
                topicId: 1,
                name: 1,
                minSelections: 1,
                maxSelections: 1,
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
    let subTopic = list[0].paginatedDocs;

    return successList(res, req.apiId, TOPIC_CONSTANTS.LIST_SUCCESS, totalCount, subTopic);
});

// track
router.post("/track", identityManager(["superAdmin"]), async (req, res) => {
    const { error } = validateTrackCreate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const newTrack = new Track({
        name: req.body.name,
        description: req.body.minSelections,
    });

    await newTrack.save();

    const response = _.pick(newTrack.toObject(), [
        "_id",
        "name",
        "description",
        "insertDate"
    ]);

    return success(res, req.apiId, TOPIC_CONSTANTS.CREATE_SUCCESS, response);
});

router.put("/track", identityManager(["superAdmin"]), async (req, res) => {
    const { error } = validateTrackUpdate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const trackId = req.body.trackId;
    const track = await Track.findById(trackId);
    if (!track) return failure(res, req.apiId, TOPIC_CONSTANTS.NOT_FOUND);

    if (req.body.name) track.name = req.body.name;
    if (req.body.name) track.name = req.body.name;
    if (req.body.description) track.description = req.body.description;

    await track.save();

    const response = _.pick(track.toObject(), [
        "_id",
        "name",
        "description",
        "insertDate",
        "updatedDate"
    ]);

    return success(res, req.apiId, TOPIC_CONSTANTS.UPDATE_SUCCESS, response);
});

router.delete("/track/:id", identityManager(["superAdmin"]), async (req, res) => {
    const trackId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(trackId)) return failure(res, req.apiId, TOPIC_CONSTANTS.INVALID_TOPIC_ID);

    const track = await Track.findById(trackId);
    if (!track) return failure(res, req.apiId, TOPIC_CONSTANTS.NOT_FOUND);

    await track.deleteOne({ _id: track._id });

    return success(res, req.apiId, TOPIC_CONSTANTS.DELETE_SUCCESS);
});

router.get("/track/list", identityManager(["user", "superAdmin", "admin"]), async (req, res) => {
    const { error } = validateTrackList(req.query);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const criteria = {};

    const skipVal = isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset);
    const limitVal = isNaN(parseInt(req.query.limit)) ? 100 : parseInt(req.query.limit);

    if (req.query.trackId) criteria._id = new mongoose.Types.ObjectId(req.query.trackId);
    if (req.query.type) criteria.type = req.query.type;
    if (req.query.text) {
        const regexText = new RegExp(req.query.text, "i");
        criteria.$or = [{ title: regexText }];
    }

    const list = await Track.aggregate([
        { $match: criteria },
        { $sort: { insertDate: -1 } },
        {
            $project: {
                _id: 0,
                trackId: "$_id",
                name: 1,
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
    let track = list[0].paginatedDocs;

    return successList(res, req.apiId, TOPIC_CONSTANTS.LIST_SUCCESS, totalCount, track);
});

// Article
router.post("/article", identityManager(["superAdmin"]), async (req, res) => {
    const { error } = validateArticleCreate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const newArticle = new Article({
        name: req.body.name,
    });

    await newArticle.save();

    const response = _.pick(newArticle.toObject(), [
        "_id",
        "name",
        "insertDate"
    ]);

    return success(res, req.apiId, TOPIC_CONSTANTS.CREATE_SUCCESS, response);
});

router.put("/article", identityManager(["superAdmin"]), async (req, res) => {
    const { error } = validateArticleUpdate(req.body);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const articleId = req.body.articleId;
    const article = await Article.findById(articleId);
    if (!article) return failure(res, req.apiId, TOPIC_CONSTANTS.NOT_FOUND);

    if (req.body.name) article.name = req.body.name;

    await article.save();

    const response = _.pick(article.toObject(), [
        "_id",
        "name",
        "insertDate",
        "updatedDate"
    ]);

    return success(res, req.apiId, TOPIC_CONSTANTS.UPDATE_SUCCESS, response);
});

router.delete("/article/:id", identityManager(["superAdmin"]), async (req, res) => {
    const articleId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(articleId)) return failure(res, req.apiId, TOPIC_CONSTANTS.INVALID_TOPIC_ID);

    const article = await Article.findById(articleId);
    if (!article) return failure(res, req.apiId, TOPIC_CONSTANTS.NOT_FOUND);

    await article.deleteOne({ _id: article._id });

    return success(res, req.apiId, TOPIC_CONSTANTS.DELETE_SUCCESS);
});

router.get("/article/list", identityManager(["user", "superAdmin", "admin"]), async (req, res) => {
    const { error } = validateArticleList(req.query);
    if (error) return failure(res, req.apiId, error.details[0].message);

    const criteria = {};

    const skipVal = isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset);
    const limitVal = isNaN(parseInt(req.query.limit)) ? 100 : parseInt(req.query.limit);

    if (req.query.articleId) criteria._id = new mongoose.Types.ObjectId(req.query.articleId);
    if (req.query.type) criteria.type = req.query.type;
    if (req.query.text) {
        const regexText = new RegExp(req.query.text, "i");
        criteria.$or = [{ title: regexText }];
    }

    const list = await Article.aggregate([
        { $match: criteria },
        { $sort: { insertDate: -1 } },
        {
            $project: {
                _id: 0,
                articleId: "$_id",
                name: 1,
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
    let article = list[0].paginatedDocs;

    return successList(res, req.apiId, TOPIC_CONSTANTS.LIST_SUCCESS, totalCount, article);
});


router.put("/reorder", identityManager(["superAdmin"]), async (req, res) => {
    try {
        const { error } = validateTopicReorder(req.body);
        if (error) return failure(res, req.apiId, error.details[0].message);

        const { items, type = 'topic' } = req.body;
        const ModelName = type === 'subtopic' ? SubTopic : Topic;

        const bulkOperations = items.map((item) => ({
            updateOne: {
                filter: { _id: item._id },
                update: {
                    sortOrder: item.sortOrder,
                    updatedDate: Math.round(Date.now() / 1000)
                }
            }
        }));

        await ModelName.bulkWrite(bulkOperations);

        return success(res, req.apiId, TOPIC_CONSTANTS.REORDER_SUCCESS);
    } catch (error) {
        return failure(res, req.apiId, error.message);
    }
});

module.exports = router;