"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const identityManager = require("../../middleware/auth").identityManager;
const ArticleSelection = require("../../models/common/ArticleSelection");
const { Article } = require("../../models/common/topic"); // Using topic.js as Article model based on existing code

// Save selected article types for a journal
router.post(
  "/save-article-selections",
  identityManager(["user", "superAdmin", "admin"]),
  async (req, res) => {
    const { journalId, articleTypeIds } = req.body;

    try {
      // 1. Purani selections delete karein
      await ArticleSelection.deleteMany({ journalId: journalId });

      // 2. Agar user ne sab unselect kar diya
      if (!articleTypeIds || articleTypeIds.length === 0) {
        return res.json({
          success: true,
          message: "All article selections removed",
        });
      }

      // 3. Bulk insert ke liye data format karein
      const selectionData = articleTypeIds.map((id) => ({
        journalId: journalId,
        articleTypeId: id,
      }));

      // 4. Database mein save karein
      const savedData = await ArticleSelection.insertMany(selectionData);

      res.status(200).json({
        success: true,
        message: "Articles saved successfully",
        count: savedData.length,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
);


router.get("/articles-with-selection", async (req, res) => {
  const { journalId, onlySelected } = req.query;

  if (!journalId) {
    return res
      .status(400)
      .json({ success: false, message: "journalId is required" });
  }

  try {
    const pipeline = [
      {
        $lookup: {
          from: "articleselections", // Check collection name in Compass
          let: { articleId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$articleTypeId", "$$articleId"] },
                    {
                      $eq: [
                        "$journalId",
                        new mongoose.Types.ObjectId(journalId),
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "selectionInfo",
        },
      },
      {
        $project: {
          articleId: "$_id",
          name: 1,
          insertDate: 1,
          updatedDate: 1,
          selected: { $gt: [{ $size: "$selectionInfo" }, 0] },
        },
      },
      { $sort: { name: 1 } },
    ];

    // Agar sirf selected chahiye (e.g. public view ke liye)
    if (onlySelected === "true") {
      pipeline.push({ $match: { selected: true } });
    }

    const list = await Article.aggregate(pipeline);
    return res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
