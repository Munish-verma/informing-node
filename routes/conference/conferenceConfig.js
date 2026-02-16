"use strict";
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ConferenceConfig = require('../../models/conference/ConferenceConfig');

// Helper function to convert string to ObjectId
function toObjectId(id) {
    if (!id) return null;
    if (mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
    }
    return null;
}

// 1. GET Configuration for a specific conference
router.get("/get-config/:conferenceId", async (req, res) => {
    try {
        const { conferenceId } = req.params;
        
        const targetConfId = toObjectId(conferenceId);
        if (!targetConfId) {
            return res.status(400).json({ success: false, message: "Invalid Conference ID" });
        }

        const config = await ConferenceConfig.findOne({ 
            conferenceId: targetConfId 
        }).lean();

        if (!config) {
            return res.status(200).json({ success: true, data: null, message: "No config found" });
        }

        res.status(200).json({ success: true, data: config });
    } catch (error) {
        console.error("GET CONFIG ERROR:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. SAVE or UPDATE Configuration
router.post("/save-config", async (req, res) => {
    try {
        const { conferenceId, ...configData } = req.body;

        if (!conferenceId) {
            return res.status(400).json({ success: false, message: "Conference ID is required" });
        }

        const targetConfId = toObjectId(conferenceId);
        if (!targetConfId) {
            return res.status(400).json({ success: false, message: "Invalid Conference ID" });
        }

        // findOneAndUpdate with upsert: true
        const updatedConfig = await ConferenceConfig.findOneAndUpdate(
            { conferenceId: targetConfId },
            { $set: configData },
            { 
                new: true, 
                upsert: true, 
                setDefaultsOnInsert: true 
            }
        );

        res.status(200).json({ 
            success: true, 
            message: "Configuration saved successfully", 
            data: updatedConfig 
        });

    } catch (error) {
        console.error("CONFIG SAVE ERROR:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
