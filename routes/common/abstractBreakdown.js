"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { identityManager } = require("../../middleware/auth.js");
const AbstractBreakdown = require("../../models/common/AbstractBreakdown.js");

// Create
router.post("/add", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { name, value } = req.body;
        if (!name || !value) return res.status(400).json({ message: "Name and Value are required" });

        const newSection = new AbstractBreakdown({ name, value });
        await newSection.save();

        return res.status(200).json({ status: 200, message: "Added successfully", data: newSection });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Read - Get All
router.get("/list", async (req, res) => {
    try {
        const list = await AbstractBreakdown.find({ status: "active" }).sort({ createdAt: 1 });
        return res.status(200).json({ status: 200, data: list });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Read - Get All (Admin - includes inactive)
router.get("/admin-list", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const list = await AbstractBreakdown.find().sort({ createdAt: 1 });
        return res.status(200).json({ status: 200, data: list });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Update
router.patch("/update/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { name, value, status } = req.body;
        const updated = await AbstractBreakdown.findByIdAndUpdate(
            req.params.id,
            { name, value, status },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Not found" });
        return res.status(200).json({ status: 200, message: "Updated successfully", data: updated });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Delete
router.delete("/delete/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const deleted = await AbstractBreakdown.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Section not found" });
        
        return res.status(200).json({ status: 200, message: "Deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
