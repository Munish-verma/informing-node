"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { identityManager } = require("../../middleware/auth.js");
const { Topic, SubTopic } = require("../../models/common/topic.js");
const ConferenceTopicSelection = require("../../models/conference/ConferenceTopicSelection.js");

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

// Save Topic and SubTopic Selections
router.post(
  "/save-selections",
  identityManager(["admin", "superAdmin"]),
  async (req, res) => {
    try {
      console.log("Save topic selections request:", req.body);
      
      const { conferenceId, topics, subTopics } = req.body;

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

      // Delete old selections for this conference
      await ConferenceTopicSelection.deleteMany({
        conferenceId: targetConferenceId,
      });

      const uniqueSelections = [];
      const seen = new Set();

      // Handle topic selections
      if (topics && Array.isArray(topics)) {
        for (const item of topics) {
          let topicIdStr;
          
          if (typeof item === "string") {
            topicIdStr = item;
          } else if (typeof item === "object") {
            topicIdStr = item.topicId || item._id || item.id || "";
          } else {
            topicIdStr = String(item);
          }

          topicIdStr = topicIdStr.trim();
          
          if (topicIdStr && !seen.has(`topic_${topicIdStr}`)) {
            const topicId = toObjectId(topicIdStr);
            if (topicId) {
              seen.add(`topic_${topicIdStr}`);
              uniqueSelections.push({
                conferenceId: targetConferenceId,
                topicId: topicId,
              });
            }
          }
        }
      }

      // Handle subTopic selections
      if (subTopics && Array.isArray(subTopics)) {
        for (const item of subTopics) {
          let subTopicIdStr;
          
          if (typeof item === "string") {
            subTopicIdStr = item;
          } else if (typeof item === "object") {
            subTopicIdStr = item.subTopicId || item._id || item.id || "";
          } else {
            subTopicIdStr = String(item);
          }

          subTopicIdStr = subTopicIdStr.trim();
          
          if (subTopicIdStr && !seen.has(`subtopic_${subTopicIdStr}`)) {
            const subTopicId = toObjectId(subTopicIdStr);
            if (subTopicId) {
              seen.add(`subtopic_${subTopicIdStr}`);
              uniqueSelections.push({
                conferenceId: targetConferenceId,
                subTopicId: subTopicId,
              });
            }
          }
        }
      }

      console.log("Unique selections:", uniqueSelections);

      if (uniqueSelections.length === 0) {
        return res.json({
          success: true,
          message: "No valid IDs provided",
        });
      }

      // Save to database - handle duplicate key errors gracefully
      let savedCount = 0;
      for (const selection of uniqueSelections) {
        try {
          await ConferenceTopicSelection.create(selection);
          savedCount++;
        } catch (err) {
          // Skip duplicates - already exists
          if (err.code === 11000) {
            console.log("Skipping duplicate:", selection);
            continue;
          }
          throw err;
        }
      }

      console.log("Saved data count:", savedCount);

      res.status(200).json({
        success: true,
        message: "Selections saved successfully",
        count: savedCount,
      });
    } catch (error) {
      console.error("SAVE TOPIC SELECTIONS ERROR:", error);
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

    // Get ALL topics from original Topic collection
    let topics = await Topic.find({}).sort({ sortOrder: 1, insertDate: -1 });
    
    // Get ALL subTopics from original SubTopic collection
    let subTopics = await SubTopic.find({}).sort({ sortOrder: 1, insertDate: -1 });

    // If conferenceId provided, get selections for this conference
    let selectedTopicIdsSet = new Set();
    let selectedSubTopicIdsSet = new Set();

    if (conferenceId) {
      const targetConferenceId = toObjectId(conferenceId);

      if (targetConferenceId) {
        const selections = await ConferenceTopicSelection.find({
          conferenceId: targetConferenceId,
        });
        
        selections.forEach((s) => {
          if (s.topicId) selectedTopicIdsSet.add(s.topicId.toString());
          if (s.subTopicId) selectedSubTopicIdsSet.add(s.subTopicId.toString());
        });
      }
    }

    // Build topic map for deduplication
    const topicMap = new Map();
    topics.forEach((topic) => {
      if (!topicMap.has(topic._id.toString())) {
        topicMap.set(topic._id.toString(), topic);
      }
    });

    // Build subTopic map for deduplication
    const subTopicMap = new Map();
    subTopics.forEach((subTopic) => {
      if (!subTopicMap.has(subTopic._id.toString())) {
        subTopicMap.set(subTopic._id.toString(), subTopic);
      }
    });

    // Add selection status to topics
    const topicResult = Array.from(topicMap.values()).map((topic) => {
      const topicId = topic._id.toString();
      const isSelected = selectedTopicIdsSet.has(topicId);

      if (minimal === "true") {
        return {
          _id: topic._id,
          name: topic.name,
          type: "topic",
          selected: isSelected,
        };
      }

      return {
        ...topic.toObject(),
        type: "topic",
        selected: isSelected,
      };
    });

    // Add selection status to subTopics
    const subTopicResult = Array.from(subTopicMap.values()).map((subTopic) => {
      const subTopicId = subTopic._id.toString();
      const isSelected = selectedSubTopicIdsSet.has(subTopicId);

      if (minimal === "true") {
        return {
          _id: subTopic._id,
          name: subTopic.name,
          topicId: subTopic.topicId,
          type: "subTopic",
          selected: isSelected,
        };
      }

      return {
        ...subTopic.toObject(),
        type: "subTopic",
        selected: isSelected,
      };
    });

    return res.status(200).json({ 
      status: 200, 
      data: {
        topics: topicResult,
        subTopics: subTopicResult
      }
    });
  } catch (error) {
    console.error("Error in list route:", error);
    return res.status(500).json({ status: 500, message: error.message });
  }
});

module.exports = router;
