"use strict";
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ConferenceSchedule = require('../../models/conference/ConferenceSchedule');

// Helper function to convert string to ObjectId
function toObjectId(id) {
    if (!id) return null;
    if (mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
    }
    return null;
}

// 1. GET Schedule by Date
router.get("/get-schedule", async (req, res) => {
    try {
        const { conferenceId, date } = req.query;

        if (!conferenceId || !date) {
            return res.status(400).json({ message: "Conference ID and Date are required" });
        }

        const targetConfId = toObjectId(conferenceId);
        if (!targetConfId) {
            return res.status(400).json({ message: "Invalid Conference ID" });
        }

        const schedule = await ConferenceSchedule.findOne({ 
            conferenceId: targetConfId, 
            date: date 
        }).lean();

        // Agar data nahi hai, toh empty structure bhejenge frontend ko
        res.status(200).json({
            success: true,
            data: schedule || { overview: "", fullDescription: "", date: date }
        });

    } catch (error) {
        console.error("GET SCHEDULE ERROR:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. SAVE or UPDATE Schedule
router.post("/save-schedule", async (req, res) => {
    try {
        const { conferenceId, date, overview, fullDescription } = req.body;

        if (!conferenceId || !date) {
            return res.status(400).json({ message: "Conference ID and Date are required" });
        }

        const targetConfId = toObjectId(conferenceId);
        if (!targetConfId) {
            return res.status(400).json({ message: "Invalid Conference ID" });
        }

        // findOneAndUpdate with upsert: true (Create if not exists, Update if exists)
        const updatedSchedule = await ConferenceSchedule.findOneAndUpdate(
            { 
                conferenceId: targetConfId, 
                date: date 
            },
            { 
                overview, 
                fullDescription 
            },
            { 
                new: true, 
                upsert: true, 
                setDefaultsOnInsert: true 
            }
        );

        res.status(200).json({
            success: true,
            message: "Schedule saved successfully",
            data: updatedSchedule
        });

    } catch (error) {
        console.error("SCHEDULE SAVE ERROR:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
