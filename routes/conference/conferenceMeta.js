"use strict";
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ConferenceMeta = require('../../models/conference/ConferenceMeta');

// Helper function to convert string to ObjectId
function toObjectId(id) {
    if (!id) return null;
    if (mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
    }
    return null;
}

// GET: Fetch conference meta by conferenceId and category
router.get("/get-meta", async (req, res) => {
    try {
        const { conferenceId, category } = req.query;
        
        if (!conferenceId) {
            return res.status(400).json({ success: false, message: "Conference ID is required" });
        }

        const targetConfId = toObjectId(conferenceId);
        if (!targetConfId) {
            return res.status(400).json({ success: false, message: "Invalid Conference ID" });
        }

        const query = { conferenceId: targetConfId };
        
        if (category) {
            query.category = category;
        }

        const data = await ConferenceMeta.find(query).sort({ order: 1 });

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("GET META ERROR:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST: Create or update conference meta
router.post("/save-meta", async (req, res) => {
    try {
        const { id, conferenceId, category, name, date, info, url, image, order } = req.body;

        if (!conferenceId || !category) {
            return res.status(400).json({ success: false, message: "Conference ID and category are required" });
        }

        const targetConfId = toObjectId(conferenceId);
        if (!targetConfId) {
            return res.status(400).json({ success: false, message: "Invalid Conference ID" });
        }

        let result;
        if (id) {
            // Update existing entry
            const updateData = { name, date, info, url, image, order };
            // Remove undefined fields
            Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
            
            result = await ConferenceMeta.findByIdAndUpdate(id, updateData, { new: true });
        } else {
            // Create new entry
            result = await ConferenceMeta.create({
                conferenceId: targetConfId,
                category,
                name,
                date,
                info,
                url,
                image,
                order
            });
        }

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("SAVE META ERROR:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE: Delete conference meta by ID
router.delete("/delete-meta/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "ID is required" });
        }

        await ConferenceMeta.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
        console.error("DELETE META ERROR:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
