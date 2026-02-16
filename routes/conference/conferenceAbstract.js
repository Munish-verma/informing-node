"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { identityManager } = require("../../middleware/auth.js");
const ConferenceAbstractSelection = require("../../models/conference/ConferenceAbstractSelection.js");
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
        const { conferenceId, breakdownId, status } = req.body;

        if (!conferenceId || !breakdownId) {
            return res.status(400).json({ message: "Conference ID and Breakdown ID are required" });
        }

        const selection = await ConferenceAbstractSelection.findOneAndUpdate(
            { 
                conferenceId: toObjectId(conferenceId), 
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
        const { conferenceId } = req.query;
        if (!conferenceId) return res.status(400).json({ message: "Conference ID is required" });

        const targetConferenceId = toObjectId(conferenceId);

        const list = await AbstractBreakdown.aggregate([
            { $match: { status: "active" } },
            {
                $lookup: {
                    from: "conferenceabstractselections",
                    let: { bId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$breakdownId", "$$bId"] },
                                        { $eq: ["$conferenceId", targetConferenceId] },
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
        const { conferenceId, breakdownId } = req.query;

        if (!conferenceId || !breakdownId) {
            return res.status(400).json({ message: "Conference ID and Breakdown ID are required" });
        }

        await ConferenceAbstractSelection.findOneAndDelete({
            conferenceId: toObjectId(conferenceId),
            breakdownId: toObjectId(breakdownId)
        });

        return res.status(200).json({ status: 200, message: "Removed successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
