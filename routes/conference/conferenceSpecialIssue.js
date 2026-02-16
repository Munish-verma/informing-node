"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { identityManager } = require("../../middleware/auth.js");
const ConferenceSpecialIssue = require("../../models/conference/ConferenceSpecialIssue.js");

// Helper function to convert string to ObjectId
function toObjectId(id) {
    if (!id) return null;
    try {
        return new mongoose.Types.ObjectId(id);
    } catch (e) {
        return id;
    }
}

// Create Special Issue
router.post("/add", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { conferenceId, name, description, expirationDate, guestEditor } = req.body;

        if (!conferenceId || !name || !guestEditor) {
            return res.status(400).json({ status: 400, message: "Conference ID, Name, and Guest Editor are required." });
        }

        const newIssue = new ConferenceSpecialIssue({
            conferenceId: toObjectId(conferenceId),
            name,
            description,
            expirationDate: new Date(expirationDate),
            guestEditor: toObjectId(guestEditor)
        });

        await newIssue.save();
        return res.status(200).json({ status: 200, message: "Special Issue added successfully", data: newIssue });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Get List for a Particular Conference
router.get("/list", async (req, res) => {
    try {
        const { conferenceId } = req.query;

        if (!conferenceId) {
            return res.status(400).json({ status: 400, message: "Conference ID is required to fetch data." });
        }

        const list = await ConferenceSpecialIssue.find({ 
            conferenceId: toObjectId(conferenceId),
            status: { $ne: "deleted" } 
        })
        .populate("guestEditor", "personalName familyName email profilePic")
        .sort({ createdAt: -1 });

        return res.status(200).json({ status: 200, data: list });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Update Special Issue
router.patch("/update/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { name, description, expirationDate, guestEditor, status } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (expirationDate) updateData.expirationDate = new Date(expirationDate);
        if (guestEditor) updateData.guestEditor = toObjectId(guestEditor);
        if (status) updateData.status = status;

        const updated = await ConferenceSpecialIssue.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Special Issue not found" });
        return res.status(200).json({ status: 200, message: "Updated successfully", data: updated });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Delete Special Issue (Soft Delete)
router.delete("/delete/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const deleted = await ConferenceSpecialIssue.findByIdAndUpdate(
            req.params.id,
            { status: "deleted" },
            { new: true }
        );
        if (!deleted) return res.status(404).json({ message: "Not found" });
        return res.status(200).json({ status: 200, message: "Deleted successfully" });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Get Single Special Issue
router.get("/:id", async (req, res) => {
    try {
        const issue = await ConferenceSpecialIssue.findById(req.params.id)
            .populate("guestEditor", "personalName familyName email profilePic");
        
        if (!issue) return res.status(404).json({ message: "Special Issue not found" });
        return res.status(200).json({ status: 200, data: issue });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

module.exports = router;
