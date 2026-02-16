"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { identityManager } = require("../../middleware/auth.js");
const EvaluationForm = require("../../models/common/EvaluationForm.js");
const ConferenceEvalSelection = require("../../models/conference/ConferenceEvalSelection.js");

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

// Save Evaluation Form Selections
router.post(
  "/save-selections",
  identityManager(["admin", "superAdmin"]),
  async (req, res) => {
    try {
      console.log("Save evaluation form selections request:", req.body);
      
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

      console.log("Selection array:", selectionArray);

      // Delete old selections for this conference
      await ConferenceEvalSelection.deleteMany({
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
        let evalFormIdStr;
        
        if (typeof item === "string") {
          evalFormIdStr = item;
        } else if (typeof item === "object") {
          evalFormIdStr = item.evaluationFormId || item._id || item.id || "";
        } else {
          evalFormIdStr = String(item);
        }

        evalFormIdStr = evalFormIdStr.trim();
        
        if (evalFormIdStr && !seen.has(evalFormIdStr)) {
          const evaluationFormId = toObjectId(evalFormIdStr);
          if (evaluationFormId) {
            seen.add(evalFormIdStr);
            uniqueSelections.push({
              conferenceId: targetConferenceId,
              evaluationFormId: evaluationFormId,
            });
          }
        }
      }

      console.log("Unique selections:", uniqueSelections);

      if (uniqueSelections.length === 0) {
        return res.json({
          success: true,
          message: "No valid evaluation form IDs provided",
        });
      }

      // Save to database
      const savedData = await ConferenceEvalSelection.insertMany(
        uniqueSelections,
        {
          ordered: false,
        },
      );

      console.log("Saved data count:", savedData.length);

      res.status(200).json({
        success: true,
        message: "Selections saved successfully",
        count: savedData.length,
      });
    } catch (error) {
      console.error("SAVE EVAL FORM SELECTIONS ERROR:", error);
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

    // Get ALL evaluation forms from original collection
    let evaluationForms = await EvaluationForm.find({}).sort({ insertDate: -1 });

    // If conferenceId provided, get selections for this conference
    let selectedIdsSet = new Set();

    if (conferenceId) {
      const targetConferenceId = toObjectId(conferenceId);

      if (targetConferenceId) {
        const selections = await ConferenceEvalSelection.find({
          conferenceId: targetConferenceId,
        });
        selectedIdsSet = new Set(
          selections.map((s) => (s.evaluationFormId ? s.evaluationFormId.toString() : null)),
        );
      }
    }

    // DEDUPLICATION - Use Map to remove duplicates by _id
    const evalFormMap = new Map();
    evaluationForms.forEach((evalForm) => {
      if (!evalFormMap.has(evalForm._id.toString())) {
        evalFormMap.set(evalForm._id.toString(), evalForm);
      }
    });

    // Add selection status to deduplicated evaluation forms
    const result = Array.from(evalFormMap.values()).map((evalForm) => {
      const evalFormId = evalForm._id.toString();
      const isSelected = selectedIdsSet.has(evalFormId);

      if (minimal === "true") {
        return {
          _id: evalForm._id,
          name: evalForm.name,
          selected: isSelected,
        };
      }

      return {
        ...evalForm.toObject(),
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
