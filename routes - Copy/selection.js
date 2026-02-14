"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { identityManager } = require("../middleware/auth.js");
const Selection = require("../models/Selection.js");
const { Topic, SubTopic } = require("../models/topic.js");

// Helper function to convert string to ObjectId
function toObjectId(id) {
  if (!id) return null;
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (e) {
    return null;
  }
}

// Save/Update Selections for a journal
router.post(
  "/save-selections",
  identityManager(["user", "superAdmin", "admin"]),
  async (req, res) => {
    try {
      const { journalId, selections } = req.body;

      if (!journalId) {
        return res.status(400).json({
          success: false,
          message: "Journal ID is required",
        });
      }

      if (!selections || !Array.isArray(selections)) {
        return res.status(400).json({
          success: false,
          message: "Selections array is required",
        });
      }

      // 1. Delete old selections for this journal
      await Selection.deleteMany({ journalId: toObjectId(journalId) });

      // 2. Check if array is empty (User unselected all)
      if (selections.length === 0) {
        return res.json({
          success: true,
          message: "All selections removed",
        });
      }

      // 3. Format data for bulk insert
      const selectionData = selections.map((item) => ({
        journalId: toObjectId(journalId),
        topicId: toObjectId(item.topicId),
        subTopicId: item.subTopicId ? toObjectId(item.subTopicId) : null,
      }));

      // 4. Save to database (ignoreDuplicates for safety)
      const savedData = await Selection.insertMany(selectionData, {
        ordered: false,
      });

      res.status(200).json({
        success: true,
        message: "Selections saved successfully",
        count: savedData.length,
      });
    } catch (error) {
      console.error("SAVE SELECTIONS ERROR:", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

// Get List with Selection Status (nested Topic -> SubTopics)
// router.get("/list-with-selection", async (req, res) => {
//     try {
//         const { journalId } = req.query;

//         if (!journalId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Journal ID is required"
//             });
//         }

//         const targetJournalId = toObjectId(journalId);

//         // Get all topics with their subtopics and selection status
//         const list = await Topic.aggregate([
//             { $sort: { sortOrder: 1 } },

//             // Lookup SubTopics for each Topic
//             {
//                 $lookup: {
//                     from: "subtopics",
//                     localField: "_id",
//                     foreignField: "topicId",
//                     as: "subTopics"
//                 }
//             },

//             // Sort subtopics by sortOrder
//             {
//                 $addFields: {
//                     subTopics: { $sortArray: { input: "$subTopics", sortBy: { sortOrder: 1 } } }
//                 }
//             },

//             // Lookup selections for this journal
//             {
//                 $lookup: {
//                     from: "selections",
//                     let: { topicId: "$_id" },
//                     pipeline: [
//                         {
//                             $match: {
//                                 $expr: {
//                                     $and: [
//                                         { $eq: ["$journalId", targetJournalId] },
//                                         { $eq: ["$topicId", "$$topicId"] },
//                                         { $eq: ["$subTopicId", null] }
//                                     ]
//                                 }
//                             }
//                         }
//                     ],
//                     as: "topicSelections"
//                 }
//             },

//             // Lookup subtopic selections
//             {
//                 $lookup: {
//                     from: "selections",
//                     let: { topicId: "$_id" },
//                     pipeline: [
//                         {
//                             $match: {
//                                 $expr: {
//                                     $and: [
//                                         { $eq: ["$journalId", targetJournalId] },
//                                         { $eq: ["$topicId", "$$topicId"] },
//                                         { $ne: ["$subTopicId", null] }
//                                     ]
//                                 }
//                             }
//                         }
//                     ],
//                     as: "subTopicSelections"
//                 }
//             },

//             // Project with selection status
//             {
//                 $project: {
//                     name: 1,
//                     minSelections: 1,
//                     maxSelections: 1,
//                     // Topic is selected if topicSelections array has items
//                     selected: { $gt: [{ $size: "$topicSelections" }, 0] },
//                     // Transform subTopics to include selected flag
//                     subTopics: {
//                         $map: {
//                             input: "$subTopics",
//                             as: "sub",
//                             in: {
//                                 _id: "$$sub._id",
//                                 name: "$$sub.name",
//                                 minSelections: "$$sub.minSelections",
//                                 maxSelections: "$$sub.maxSelections",
//                                 // Check if this subtopic is in subTopicSelections
//                                 selected: {
//                                     $in: ["$$sub._id", {
//                                         $map: {
//                                             input: "$subTopicSelections",
//                                             as: "sel",
//                                             in: "$$sel.subTopicId"
//                                         }
//                                     }]
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         ]);

//         return res.json({ success: true, data: list });
//     } catch (error) {
//         console.error("LIST WITH SELECTION ERROR:", error.message);
//         return res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

router.get("/list-with-selection", async (req, res) => {
  try {
    const { journalId } = req.query;
    if (!journalId)
      return res
        .status(400)
        .json({ success: false, message: "Journal ID is required" });

    const targetJournalId = toObjectId(journalId);

    const list = await Topic.aggregate([
      { $sort: { sortOrder: 1 } },

      // 1. Join SubTopics (Type conversion handle karte huye)
      {
        $lookup: {
          from: "subtopics",
          let: { tId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$topicId", { $toString: "$$tId" }] },
              },
            },
            { $sort: { sortOrder: 1 } },
          ],
          as: "subTopics",
        },
      },

      // 2. Journal ki saari selections ek hi baar fetch karein (Efficiency)
      {
        $lookup: {
          from: "selections",
          let: { tId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$journalId", targetJournalId] },
                    { $eq: ["$topicId", "$$tId"] },
                  ],
                },
              },
            },
          ],
          as: "allSelections",
        },
      },

      // 3. Final Project with selection flags
      {
        $project: {
          name: 1,
          minSelections: 1,
          maxSelections: 1,
          // Topic tab selected hai jab selection mein subTopicId null ho
          selected: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$allSelections",
                    as: "sel",
                    cond: { $eq: ["$$sel.subTopicId", null] },
                  },
                },
              },
              0,
            ],
          },
          subTopics: {
            $map: {
              input: "$subTopics",
              as: "sub",
              in: {
                _id: "$$sub._id",
                name: "$$sub.name",
                selected: {
                  $in: [
                    "$$sub._id",
                    {
                      $map: {
                        input: "$allSelections",
                        as: "s",
                        in: "$$s.subTopicId",
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    return res.json({ success: true, data: list });
  } catch (error) {
    console.error("LIST WITH SELECTION ERROR:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Get all selections for a journal (flat list)
router.get(
  "/list",
  identityManager(["admin", "superAdmin"]),
  async (req, res) => {
    try {
      const { journalId } = req.query;

      if (!journalId) {
        return res.status(400).json({
          success: false,
          message: "Journal ID is required",
        });
      }

      const selections = await Selection.find({
        journalId: toObjectId(journalId),
      })
        .populate("topicId", "name")
        .populate("subTopicId", "name")
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        count: selections.length,
        data: selections,
      });
    } catch (error) {
      console.error("SELECTION LIST ERROR:", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

// Delete single selection
router.delete(
  "/:id",
  identityManager(["user", "superAdmin", "admin"]),
  async (req, res) => {
    try {
      const deleted = await Selection.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Selection not found",
        });
      }

      return res.json({
        success: true,
        message: "Selection deleted successfully",
      });
    } catch (error) {
      console.error("DELETE SELECTION ERROR:", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

module.exports = router;
