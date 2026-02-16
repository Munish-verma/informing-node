"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const identityManager = require("../../middleware/auth").identityManager;
const EvaluationForm = require("../../models/common/EvaluationForm");
const EvalSelection = require("../../models/common/EvalSelection");
const ConferenceEvalSelection = require("../../models/conference/ConferenceEvalSelection");

// Create Evaluation Form
router.post("/evaluation-form/create", async (req, res) => {
  try {
    const newForm = new EvaluationForm(req.body);
    await newForm.save();
    res.status(201).json({ success: true, data: newForm });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// List with Filters & Search
router.get("/evaluation-form/list", async (req, res) => {
  try {
    const { journalId, conferenceId, keyword } = req.query;
    let criteria = { isArchived: false };

    if (journalId) criteria.journalId = new mongoose.Types.ObjectId(journalId);
    if (conferenceId) criteria.conferenceId = new mongoose.Types.ObjectId(conferenceId);
    
    if (keyword) {
      criteria.$or = [
        { title: new RegExp(keyword, "i") },
        { description: new RegExp(keyword, "i") }
      ];
    }

    const forms = await EvaluationForm.find(criteria).sort({ insertDate: -1 });
    res.json({ success: true, count: forms.length, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clone Form
router.post("/evaluation-form/clone/:id", async (req, res) => {
  try {
    const originalForm = await EvaluationForm.findById(req.params.id);
    if (!originalForm) return res.status(404).json({ message: "Form not found" });

    const clonedData = originalForm.toObject();
    delete clonedData._id;
    clonedData.title = `${clonedData.title} (Clone)`;
    clonedData.inUse = false;

    const newForm = new EvaluationForm(clonedData);
    await newForm.save();
    
    res.json({ success: true, message: "Form cloned successfully", data: newForm });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Archive Form
router.put("/evaluation-form/archive/:id", async (req, res) => {
  try {
    const updatedForm = await EvaluationForm.findByIdAndUpdate(
      req.params.id,
      { isArchived: true, updatedDate: Math.round(Date.now() / 1000) },
      { new: true }
    );
    res.json({ success: true, message: "Form archived", data: updatedForm });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Edit / Update Evaluation Form
router.put("/evaluation-form/update/:id", async (req, res) => {
  try {
    req.body.updatedDate = Math.round(Date.now() / 1000);

    const updatedForm = await EvaluationForm.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }

    res.json({ 
      success: true, 
      message: "Form updated successfully", 
      data: updatedForm 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete Evaluation Form (Hard Delete)
router.delete("/evaluation-form/delete/:id", async (req, res) => {
  try {
    const deletedForm = await EvaluationForm.findByIdAndDelete(req.params.id);

    if (!deletedForm) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }

    res.json({ 
      success: true, 
      message: "Form deleted permanently from database" 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save selected evaluation forms for a journal
router.post(
  "/save-evaluation-selections",
  identityManager(["user", "superAdmin", "admin"]),
  async (req, res) => {
    const { journalId, evaluationFormIds } = req.body;

    try {
      await EvalSelection.deleteMany({ journalId: journalId });

      if (!evaluationFormIds || evaluationFormIds.length === 0) {
        return res.json({ success: true, message: "All evaluation selections removed" });
      }

      const selectionData = evaluationFormIds.map((id) => ({
        journalId: journalId,
        evaluationFormId: id,
      }));

      const savedData = await EvalSelection.insertMany(selectionData);

      res.status(200).json({
        success: true,
        message: "Evaluation forms selection saved successfully",
        count: savedData.length,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Get all evaluation forms with selection status for a journal
router.get("/evaluations-with-selection", async (req, res) => {
  const { journalId } = req.query;

  if (!journalId) {
    return res.status(400).json({ success: false, message: "journalId is required" });
  }

  try {
    const list = await EvaluationForm.aggregate([
      {
        $lookup: {
          from: "evalselections",
          let: { formId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$evaluationFormId", "$$formId"] },
                    { $eq: ["$journalId", new mongoose.Types.ObjectId(journalId)] },
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
          title: 1,
          category: 1,
          isPublic: 1,
          selected: { $gt: [{ $size: "$selectionInfo" }, 0] },
        },
      },
      { $sort: { title: 1 } },
    ]);

    return res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ CONFERENCE EVALUATION FORM SELECTION ENDPOINTS ============

// Save selected evaluation forms for a conference
router.post(
  "/save-conference-evaluation-selections",
  identityManager(["user", "superAdmin", "admin"]),
  async (req, res) => {
    const { conferenceId, evaluationFormIds } = req.body;

    if (!conferenceId) {
      return res.status(400).json({ success: false, message: "conferenceId is required" });
    }

    try {
      await ConferenceEvalSelection.deleteMany({ conferenceId: new mongoose.Types.ObjectId(conferenceId) });

      if (!evaluationFormIds || evaluationFormIds.length === 0) {
        return res.json({ success: true, message: "All conference evaluation selections removed" });
      }

      const selectionData = evaluationFormIds.map((id) => ({
        conferenceId: new mongoose.Types.ObjectId(conferenceId),
        evaluationFormId: new mongoose.Types.ObjectId(id),
      }));

      const savedData = await ConferenceEvalSelection.insertMany(selectionData);

      res.status(200).json({
        success: true,
        message: "Conference evaluation forms selection saved successfully",
        count: savedData.length,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Get all evaluation forms with selection status for a conference
router.get("/conference-evaluations-with-selection", async (req, res) => {
  const { conferenceId } = req.query;

  if (!conferenceId) {
    return res.status(400).json({ success: false, message: "conferenceId is required" });
  }

  try {
    const list = await EvaluationForm.aggregate([
      {
        $lookup: {
          from: "conferenceevalselections",
          let: { formId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$evaluationFormId", "$$formId"] },
                    { $eq: ["$conferenceId", new mongoose.Types.ObjectId(conferenceId)] },
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
          title: 1,
          category: 1,
          isPublic: 1,
          selected: { $gt: [{ $size: "$selectionInfo" }, 0] },
        },
      },
      { $sort: { title: 1 } },
    ]);

    return res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
