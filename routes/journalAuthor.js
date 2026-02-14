"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { identityManager } = require("../middleware/auth.js");
const JournalAuthor = require("../models/journalAuthor.js");

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
router.post("/journal-author/add", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { journalId, userId } = req.body;

        if (!journalId || !userId) {
            return res.status(400).json({ status: 400, message: "Journal ID and User ID are required." });
        }

        const newAuthor = new JournalAuthor({
            journalId: toObjectId(journalId),
            userId: toObjectId(userId)
        });

        await newAuthor.save();
        return res.status(200).json({ status: 200, message: "Author linked to journal successfully", data: newAuthor });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: "This user is already an author for this journal." });
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// List Authors (Read)
router.get("/journal-author/list", async (req, res) => {
    try {
        const { journalId } = req.query;
        if (!journalId) return res.status(400).json({ message: "Journal ID is required." });

        const authors = await JournalAuthor.find({ 
            journalId: toObjectId(journalId),
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
router.patch("/journal-author/update/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { status } = req.body;
        
        const updated = await JournalAuthor.findByIdAndUpdate(
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
router.delete("/journal-author/remove/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const deleted = await JournalAuthor.findByIdAndDelete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ message: "Author not found." });
        }
        
        return res.status(200).json({ status: 200, message: "Author removed from journal." });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Get Single Author
router.get("/journal-author/:id", async (req, res) => {
    try {
        const author = await JournalAuthor.findById(req.params.id)
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
