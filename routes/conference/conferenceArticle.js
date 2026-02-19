"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { identityManager } = require("../../middleware/auth.js");
const { Article } = require("../../models/common/topic.js");
const ConferenceArticleSelection = require("../../models/conference/ConferenceArticleSelection.js");

// Helper function to convert string to ObjectId
function toObjectId(id) {
  if (!id) return null;
  if (id instanceof mongoose.Types.ObjectId) return id;
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (e) {
    return null;
  }
}

// Save Article Selections
router.post(
  "/save-selections",
  identityManager(["admin", "superAdmin"]),
  async (req, res) => {
    try {
      // console.log("Save selections request:", req.body);
      
      const { conferenceId, selections } = req.body;

      if (!conferenceId) {
        return res.status(400).json({
          success: false,
          message: "Conference ID is required",
        });
      }

      const targetConferenceId = toObjectId(conferenceId);
      if (!targetConferenceId) {
        return res.status(400).json({
          success: false,
          message: "Invalid Conference ID format",
        });
      }

      // Handle different selection formats
      let selectionArray = [];
      if (selections) {
        if (Array.isArray(selections)) {
          selectionArray = selections;
        } else if (typeof selections === "string") {
          try {
            selectionArray = JSON.parse(selections);
          } catch (e) {
            selectionArray = selections.split(",").map((s) => s.trim());
          }
        }
      }

      // console.log("Selection array:", selectionArray);

      // Delete old selections for this conference
      await ConferenceArticleSelection.deleteMany({
        conferenceId: targetConferenceId,
      });

      if (!selectionArray || selectionArray.length === 0) {
        return res.json({
          success: true,
          message: "All selections removed",
        });
      }

      // Format data for bulk insert
      const uniqueSelections = [];
      const seen = new Set();

      for (const item of selectionArray) {
        let articleIdStr;
        
        if (typeof item === "string") {
          articleIdStr = item;
        } else if (typeof item === "object") {
          articleIdStr = item.articleId || item._id || item.id || "";
        } else {
          articleIdStr = String(item);
        }

        articleIdStr = articleIdStr.trim();
        
        if (articleIdStr && !seen.has(articleIdStr)) {
          const articleId = toObjectId(articleIdStr);
          if (articleId) {
            seen.add(articleIdStr);
            uniqueSelections.push({
              conferenceId: targetConferenceId,
              articleId: articleId,
            });
          }
        }
      }

      // console.log("Unique selections:", uniqueSelections);

      if (uniqueSelections.length === 0) {
        return res.json({
          success: true,
          message: "No valid article IDs provided",
        });
      }

      // Save to database
      const savedData = await ConferenceArticleSelection.insertMany(
        uniqueSelections,
        {
          ordered: false,
        },
      );

      // console.log("Saved data count:", savedData.length);

      res.status(200).json({
        success: true,
        message: "Selections saved successfully",
        count: savedData.length,
      });
    } catch (error) {
      console.error("SAVE ARTICLE SELECTIONS ERROR:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

// Get List for a Particular Conference with Selection Status
router.get("/list", async (req, res) => {
  try {
    const { conferenceId, minimal } = req.query;

    // Get ALL articles from original Article collection
    let articles = await Article.find({}).sort({ insertDate: -1 });

    // If conferenceId provided, get selections for this conference
    let selectedIdsSet = new Set();

    if (conferenceId) {
      const targetConferenceId = toObjectId(conferenceId);

      if (targetConferenceId) {
        const selections = await ConferenceArticleSelection.find({
          conferenceId: targetConferenceId,
        });
        selectedIdsSet = new Set(
          selections.map((s) => (s.articleId ? s.articleId.toString() : null)),
        );
      }
    }

    // DEDUPLICATION - Use Map to remove duplicates by _id
    const articleMap = new Map();
    articles.forEach((article) => {
      if (!articleMap.has(article._id.toString())) {
        articleMap.set(article._id.toString(), article);
      }
    });

    // Add selection status to deduplicated articles
    const result = Array.from(articleMap.values()).map((article) => {
      const articleId = article._id.toString();
      const isSelected = selectedIdsSet.has(articleId);

      if (minimal === "true") {
        return {
          _id: article._id,
          name: article.name,
          selected: isSelected,
        };
      }

      return {
        ...article.toObject(),
        selected: isSelected,
      };
    });

    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    console.error("Error in list route:", error);
    return res.status(500).json({ status: 500, message: error.message });
  }
});

module.exports = router;
