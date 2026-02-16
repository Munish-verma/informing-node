"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { identityManager } = require("../../middleware/auth.js");
const ConferenceMember = require("../../models/conference/ConferenceMember.js");

// Helper function to convert string to ObjectId
function toObjectId(id) {
    if (!id) return null;
    try {
        return new mongoose.Types.ObjectId(id);
    } catch (e) {
        return id;
    }
}

// Add Member (Create)
router.post("/add", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { conferenceId, userId, membershipExpiration } = req.body;

        if (!conferenceId || !userId || !membershipExpiration) {
            return res.status(400).json({ status: 400, message: "Conference ID, User ID, and Expiration Date are required." });
        }

        const newMember = new ConferenceMember({
            conferenceId: toObjectId(conferenceId),
            userId: toObjectId(userId),
            membershipExpiration: new Date(membershipExpiration)
        });

        await newMember.save();
        return res.status(200).json({ status: 200, message: "Member linked to conference successfully", data: newMember });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: "User is already a member of this conference." });
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// List Members for a Particular Conference (Read)
router.get("/list", async (req, res) => {
    try {
        const { conferenceId } = req.query;
        if (!conferenceId) return res.status(400).json({ message: "Conference ID is required." });

        const members = await ConferenceMember.find({ conferenceId: toObjectId(conferenceId) })
            .populate("userId", "personalName familyName email profilePic")
            .sort({ createdAt: -1 });

        return res.status(200).json({ status: 200, data: members });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// List Members for a User (Get all conferences for a user)
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        const memberships = await ConferenceMember.find({ userId: toObjectId(userId) })
            .populate("conferenceId", "title acronym")
            .sort({ createdAt: -1 });

        return res.status(200).json({ status: 200, data: memberships });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Update Membership (Update)
router.patch("/update/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const { membershipExpiration, status } = req.body;
        
        const updateData = {};
        if (membershipExpiration) updateData.membershipExpiration = new Date(membershipExpiration);
        if (status) updateData.status = status;

        const updatedMember = await ConferenceMember.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedMember) return res.status(404).json({ message: "Membership record not found." });
        return res.status(200).json({ status: 200, message: "Membership updated", data: updatedMember });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Remove Member (Delete)
router.delete("/remove/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
    try {
        const deleted = await ConferenceMember.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Record not found." });
        return res.status(200).json({ status: 200, message: "Member removed from conference." });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Get Single Membership
router.get("/:id", async (req, res) => {
    try {
        const membership = await ConferenceMember.findById(req.params.id)
            .populate("conferenceId", "title acronym")
            .populate("userId", "personalName familyName email profilePic");
        
        if (!membership) return res.status(404).json({ message: "Membership not found." });
        return res.status(200).json({ status: 200, data: membership });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

module.exports = router;
