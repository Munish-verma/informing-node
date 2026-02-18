"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { identityManager } = require("../../middleware/auth.js");
const ConferenceTrack = require("../../models/conference/ConferenceTrack.js");

// Helper function to convert string to ObjectId
function toObjectId(id) {
    if (!id) return null;
    try {
        return new mongoose.Types.ObjectId(id);
    } catch (e) {
        return id;
    }
}

// Add Track
router.post("/add", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { conferenceId, name, description } = req.body;

        if (!conferenceId || !name) {
            return res.status(400).json({ status: 400, message: "Conference ID and Name are required." });
        }

        const newTrack = new ConferenceTrack({
            conferenceId: toObjectId(conferenceId),
            name,
            description
        });

        await newTrack.save();
        return res.status(200).json({ status: 200, message: "Track added successfully", data: newTrack });
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

        const targetConferenceId = toObjectId(conferenceId);

        // Get only conference-specific tracks (ONE collection)
        const tracks = await ConferenceTrack.find({ conferenceId: targetConferenceId })
            .sort({ insertDate: -1 });

        return res.status(200).json({ status: 200, data: tracks });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Update Track
router.patch("/update/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const updateData = { updatedDate: Math.round(Date.now() / 1000) };
        if (name) updateData.name = name;
        if (description) updateData.description = description;

        const updated = await ConferenceTrack.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Track not found" });
        
        return res.status(200).json({ status: 200, message: "Updated successfully", data: updated });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Delete Track
router.delete("/delete/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const deleted = await ConferenceTrack.findByIdAndDelete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ message: "Not found" });
        }
        
        return res.status(200).json({ status: 200, message: "Deleted successfully" });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Get Single Track
router.get("/:id", async (req, res) => {
    try {
        const track = await ConferenceTrack.findById(req.params.id);
        
        if (!track) return res.status(404).json({ message: "Track not found" });
        return res.status(200).json({ status: 200, data: track });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

module.exports = router;
