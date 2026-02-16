"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ConferenceGuideline = require("../../models/conference/ConferenceGuideline.js");

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

// Create or Update Guidelines for a Conference
router.post("/save", async (req, res) => {
  try {
    const { conferenceId, uploadedFiles, ...otherFields } = req.body;
    
    // Convert conferenceId to ObjectId
    const targetConferenceId = toObjectId(conferenceId);
    if (!targetConferenceId) {
      return res.status(400).json({ success: false, message: "Invalid Conference ID" });
    }

    const updateData = {
      ...otherFields,
      updatedDate: Math.round(Date.now() / 1000)
    };

    // Handle uploaded files if provided
    if (uploadedFiles && Array.isArray(uploadedFiles)) {
      updateData.uploadedFiles = uploadedFiles.map(file => ({
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        uploadedAt: file.uploadedAt || Math.round(Date.now() / 1000)
      }));
    }

    const guideline = await ConferenceGuideline.findOneAndUpdate(
      { conferenceId: targetConferenceId },
      { $set: updateData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, message: "Guidelines saved successfully", data: guideline });
  } catch (error) {
    console.error("Error saving guideline:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Guidelines by Conference ID
router.get("/:conferenceId", async (req, res) => {
  try {
    const targetConferenceId = toObjectId(req.params.conferenceId);
    if (!targetConferenceId) {
      return res.status(400).json({ success: false, message: "Invalid Conference ID" });
    }
    
    const guideline = await ConferenceGuideline.findOne({ conferenceId: targetConferenceId });
    
    if (!guideline) {
      return res.json({ success: true, data: null, message: "No guidelines found for this conference" });
    }

    res.json({ success: true, data: guideline });
  } catch (error) {
    console.error("Error fetching guideline:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete Guidelines
router.delete("/delete/:conferenceId", async (req, res) => {
  try {
    const targetConferenceId = toObjectId(req.params.conferenceId);
    if (!targetConferenceId) {
      return res.status(400).json({ success: false, message: "Invalid Conference ID" });
    }
    
    await ConferenceGuideline.findOneAndDelete({ conferenceId: targetConferenceId });
    res.json({ success: true, message: "Guidelines deleted successfully" });
  } catch (error) {
    console.error("Error deleting guideline:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
