"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { identityManager } = require("../../middleware/auth.js");
const ConferenceAuthor = require("../../models/conference/ConferenceAuthor.js");

// Helper function to convert string to ObjectId
function toObjectId(id) {
    if (!id) return null;
    try {
        return new mongoose.Types.ObjectId(id);
    } catch (e) {
        return id;
    }
}

// Add Author (Create)
router.post("/add", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { conferenceId, userId } = req.body;

        if (!conferenceId || !userId) {
            return res.status(400).json({ status: 400, message: "Conference ID and User ID are required." });
        }

        const newAuthor = new ConferenceAuthor({
            conferenceId: toObjectId(conferenceId),
            userId: toObjectId(userId)
        });

        await newAuthor.save();
        return res.status(200).json({ status: 200, message: "Author linked to conference successfully", data: newAuthor });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: "This user is already an author for this conference." });
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// List Authors (Read)
router.get("/list", async (req, res) => {
    try {
        const { conferenceId } = req.query;
        if (!conferenceId) return res.status(400).json({ message: "Conference ID is required." });

        const authors = await ConferenceAuthor.find({ 
            conferenceId: toObjectId(conferenceId),
            status: { $ne: "deleted" }
        })
        .populate("userId", "personalName familyName email profilePic")
        .sort({ createdAt: -1 });

        return res.status(200).json({ status: 200, data: authors });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Update Author Status
router.patch("/update/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { status } = req.body;
        
        const updated = await ConferenceAuthor.findByIdAndUpdate(
            req.params.id, 
            { $set: { status } }, 
            { new: true }
        );
        
        if (!updated) {
            return res.status(404).json({ message: "Author not found." });
        }
        
        return res.status(200).json({ status: 200, message: "Author status updated", data: updated });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Remove Author (Delete)
router.delete("/remove/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const deleted = await ConferenceAuthor.findByIdAndDelete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ message: "Author not found." });
        }
        
        return res.status(200).json({ status: 200, message: "Author removed from conference." });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Get Single Author
router.get("/:id", async (req, res) => {
    try {
        const author = await ConferenceAuthor.findById(req.params.id)
            .populate("userId", "personalName familyName email profilePic");
        
        if (!author) {
            return res.status(404).json({ message: "Author not found." });
        }
        
        return res.status(200).json({ status: 200, data: author });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

module.exports = router;
