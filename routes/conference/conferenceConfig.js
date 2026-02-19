"use strict";
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ConferenceConfig = require('../../models/conference/ConferenceConfig');
<<<<<<< HEAD
=======
const ConferenceMeta = require('../../models/conference/ConferenceMeta');
>>>>>>> development-dummy

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

<<<<<<< HEAD
=======
// 3. GET SCHEDULE DATES - Returns formatted date range from ConferenceConfig
router.get("/get-schedule-date/:conferenceId", async (req, res) => {
    try {
        const { conferenceId } = req.params;
        
        const targetConfId = toObjectId(conferenceId);
        if (!targetConfId) {
            return res.status(400).json({ success: false, message: "Invalid Conference ID" });
        }

        // Get conference config to get fromDate and toDate
        const config = await ConferenceConfig.findOne({ 
            conferenceId: targetConfId 
        }).lean();

        if (!config || !config.fromDate || !config.toDate) {
            return res.status(200).json({ 
                success: true, 
                data: null, 
                message: "No schedule dates found" 
            });
        }

        // Convert dates to formatted array like ["21 feb", "22 feb", "23 feb", "24 feb", "25 feb"]
        const fromDate = new Date(config.fromDate);
        const toDate = new Date(config.toDate);
        
        const formattedDates = [];
        const currentDate = new Date(fromDate);
        
        while (currentDate <= toDate) {
            const day = currentDate.getDate();
            const month = currentDate.toLocaleString('en-US', { month: 'short' }).toLowerCase();
            formattedDates.push(`${day} ${month}`);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Get details from ConferenceMeta (detail collection)
        const metaDetails = await ConferenceMeta.find({
            conferenceId: targetConfId
        }).lean();

        res.status(200).json({ 
            success: true, 
            data: {
                scheduleDates: formattedDates.join(', '),
                scheduleDatesArray: formattedDates,
                fromDate: config.fromDate,
                toDate: config.toDate,
                details: metaDetails
            }
        });
    } catch (error) {
        console.error("GET SCHEDULE DATE ERROR:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

>>>>>>> development-dummy
module.exports = router;
