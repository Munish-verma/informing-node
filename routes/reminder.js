"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { identityManager } = require("../middleware/auth.js");
const Reminder = require("../models/reminder.js");

// Helper function to convert string to ObjectId
function toObjectId(id) {
    if (!id) return null;
    try {
        return new mongoose.Types.ObjectId(id);
    } catch (e) {
        return id;
    }
}

// Add Reminder
router.post("/reminder/add", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const reminderData = {
            ...req.body,
            journalId: toObjectId(req.body.journalId)
        };
        
        const reminder = new Reminder(reminderData);
        await reminder.save();
        return res.status(200).json({ status: 200, message: "Reminder created", data: reminder });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get Journal-wise Reminders
router.get("/reminder/list", async (req, res) => {
    try {
        const { journalId } = req.query;
        
        if (!journalId) {
            return res.status(400).json({ message: "Journal ID is required" });
        }
        
        const list = await Reminder.find({ 
            journalId: toObjectId(journalId),
            isActive: true 
        }).sort({ days: 1 });
        
        return res.status(200).json({ status: 200, data: list });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get All Reminders (Admin)
router.get("/reminder/admin-list", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { journalId } = req.query;
        
        const query = {};
        if (journalId) {
            query.journalId = toObjectId(journalId);
        }
        
        const list = await Reminder.find(query).sort({ days: 1 });
        return res.status(200).json({ status: 200, data: list });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Update Reminder
router.patch("/reminder/update/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const updated = await Reminder.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true }
        );
        
        if (!updated) {
            return res.status(404).json({ message: "Reminder not found" });
        }
        
        return res.status(200).json({ status: 200, message: "Updated", data: updated });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Delete Reminder
router.delete("/reminder/delete/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const deleted = await Reminder.findByIdAndDelete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ message: "Reminder not found" });
        }
        
        return res.status(200).json({ status: 200, message: "Deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Duplicate Reminder
router.post("/reminder/duplicate/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const original = await Reminder.findById(req.params.id);
        
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
        
        const newReminder = new Reminder(duplicateData);
        await newReminder.save();

        return res.status(200).json({ status: 200, message: "Reminder duplicated successfully", data: newReminder });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get Single Reminder
router.get("/reminder/:id", async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);
        
        if (!reminder) {
            return res.status(404).json({ message: "Reminder not found" });
        }
        
        return res.status(200).json({ status: 200, data: reminder });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
