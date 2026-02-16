"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { identityManager } = require("../../middleware/auth.js");
const ConferenceReminder = require("../../models/conference/ConferenceReminder.js");

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

// Add Reminder
router.post("/add", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const reminderData = {
            ...req.body,
            conferenceId: toObjectId(req.body.conferenceId)
        };
        
        const reminder = new ConferenceReminder(reminderData);
        await reminder.save();
        return res.status(200).json({ status: 200, message: "Reminder created", data: reminder });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get Conference-wise Reminders
router.get("/list", async (req, res) => {
    try {
        const { conferenceId, isActive } = req.query;
        
        if (!conferenceId) {
            return res.status(400).json({ message: "Conference ID is required" });
        }
        
        const targetConferenceId = toObjectId(conferenceId);
        if (!targetConferenceId) {
            return res.status(400).json({ message: "Invalid Conference ID format" });
        }

        const query = { conferenceId: targetConferenceId };
        
        // Only filter by isActive if explicitly provided
        if (isActive !== undefined && isActive !== "") {
            query.isActive = isActive === "true";
        }
        
        console.log("Fetching reminders with query:", query);
        
        const list = await ConferenceReminder.find(query).sort({ days: 1 });
        console.log("Found reminders:", list.length);
        
        return res.status(200).json({ status: 200, data: list });
    } catch (error) {
        console.error("Error fetching reminders:", error);
        return res.status(500).json({ message: error.message });
    }
});

// Get All Reminders (Admin)
router.get("/admin-list", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { conferenceId } = req.query;
        
        const query = {};
        if (conferenceId) {
            query.conferenceId = toObjectId(conferenceId);
        }
        
        const list = await ConferenceReminder.find(query).sort({ days: 1 });
        return res.status(200).json({ status: 200, data: list });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Update Reminder - Fixed to properly update and preserve data
router.patch("/update/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { id } = req.params;
        
        // First check if reminder exists
        const existingReminder = await ConferenceReminder.findById(id);
        
        if (!existingReminder) {
            return res.status(404).json({ message: "Reminder not found" });
        }
        
        // Build update object - only update fields that are provided
        const updateData = {};
        
        if (req.body.recipientType !== undefined) updateData.recipientType = req.body.recipientType;
        if (req.body.days !== undefined) updateData.days = req.body.days;
        if (req.body.timing !== undefined) updateData.timing = req.body.timing;
        if (req.body.subject !== undefined) updateData.subject = req.body.subject;
        if (req.body.message !== undefined) updateData.message = req.body.message;
        if (req.body.ccOptions !== undefined) updateData.ccOptions = req.body.ccOptions;
        if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;
        
        // Always update the updatedDate
        updateData.updatedDate = Math.round(Date.now() / 1000);
        
        const updated = await ConferenceReminder.findByIdAndUpdate(
            id, 
            { $set: updateData }, 
            { new: true }
        );
        
        return res.status(200).json({ status: 200, message: "Updated successfully", data: updated });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Delete Reminder
router.delete("/delete/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const deleted = await ConferenceReminder.findByIdAndDelete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ message: "Reminder not found" });
        }
        
        return res.status(200).json({ status: 200, message: "Deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Duplicate Reminder
router.post("/duplicate/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const original = await ConferenceReminder.findById(req.params.id);
        
        if (!original) {
            return res.status(404).json({ message: "Original reminder not found" });
        }

        // Create a copy but remove _id and timestamps
        const duplicateData = original.toObject();
        delete duplicateData._id;
        delete duplicateData.createdAt;
        delete duplicateData.updatedAt;

        duplicateData.subject = `${duplicateData.subject} (Copy)`;
        duplicateData.isActive = true;
        
        const newReminder = new ConferenceReminder(duplicateData);
        await newReminder.save();

        return res.status(200).json({ status: 200, message: "Reminder duplicated successfully", data: newReminder });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get Single Reminder
router.get("/:id", async (req, res) => {
    try {
        const reminder = await ConferenceReminder.findById(req.params.id);
        
        if (!reminder) {
            return res.status(404).json({ message: "Reminder not found" });
        }
        
        return res.status(200).json({ status: 200, data: reminder });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
