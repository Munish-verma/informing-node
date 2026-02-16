"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { identityManager } = require("../../middleware/auth.js");
const JournalAbstractSelection = require("../../models/journal/JournalAbstractSelection.js");
const AbstractBreakdown = require("../../models/common/AbstractBreakdown.js");

// Helper function to convert string to ObjectId
function toObjectId(id) {
    if (!id) return null;
    try {
        return new mongoose.Types.ObjectId(id);
    } catch (e) {
        return id;
    }
}

// Save Selection
router.post("/save", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { journalId, breakdownId, status } = req.body;

        if (!journalId || !breakdownId) {
            return res.status(400).json({ message: "Journal ID and Breakdown ID are required" });
        }

        const selection = await JournalAbstractSelection.findOneAndUpdate(
            { 
                journalId: toObjectId(journalId), 
                breakdownId: toObjectId(breakdownId) 
            },
            { status: status || "active" },
            { new: true, upsert: true }
        );

        return res.status(200).json({ status: 200, message: "Selection saved", data: selection });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get List with Selection Status
router.get("/list-with-status", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { journalId } = req.query;
        if (!journalId) return res.status(400).json({ message: "Journal ID is required" });

        const targetJournalId = toObjectId(journalId);

        const list = await AbstractBreakdown.aggregate([
            { $match: { status: "active" } },
            {
                $lookup: {
                    from: "journalabstractselections",
                    let: { bId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$breakdownId", "$$bId"] },
                                        { $eq: ["$journalId", targetJournalId] },
                                        { $eq: ["$status", "active"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "selection"
                }
            },
            {
                $addFields: {
                    isSelected: { $gt: [{ $size: "$selection" }, 0] }
                }
            },
            { $project: { selection: 0 } }
        ]);

        return res.status(200).json({ status: 200, data: list });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Remove Selection
router.delete("/remove", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { journalId, breakdownId } = req.query;

        if (!journalId || !breakdownId) {
            return res.status(400).json({ message: "Journal ID and Breakdown ID are required" });
        }

        await JournalAbstractSelection.findOneAndDelete({
            journalId: toObjectId(journalId),
            breakdownId: toObjectId(breakdownId)
        });

        return res.status(200).json({ status: 200, message: "Removed successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
