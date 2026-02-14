"use strict";
const express = require("express");
const router = express.Router();
const Guideline = require("../models/Guideline");

// Create or Update Guidelines for a Journal
router.post("/save", async (req, res) => {
  try {
    const { journalId, ...updateData } = req.body;
    updateData.updatedDate = Math.round(Date.now() / 1000);

    const guideline = await Guideline.findOneAndUpdate(
      { journalId: journalId },
      { $set: updateData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, message: "Guidelines saved successfully", data: guideline });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Guidelines by Journal ID
router.get("/:journalId", async (req, res) => {
  try {
    const guideline = await Guideline.findOne({ journalId: req.params.journalId });
    
    if (!guideline) {
      return res.json({ success: true, data: null, message: "No guidelines found for this journal" });
    }

    res.json({ success: true, data: guideline });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete Guidelines
router.delete("/delete/:journalId", async (req, res) => {
  try {
    await Guideline.findOneAndDelete({ journalId: req.params.journalId });
    res.json({ success: true, message: "Guidelines deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
