"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { identityManager } = require("../../middleware/auth.js");
const JournalMember = require("../../models/journal/journalMember.js");

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
<<<<<<< HEAD
router.post("/journal-member/add", identityManager(["admin", "superAdmin"]), async (req, res) => {
=======
router.post("/add", identityManager(["admin", "superAdmin"]), async (req, res) => {
>>>>>>> development-dummy
    try {
        const { journalId, userId, membershipExpiration } = req.body;

        if (!journalId || !userId || !membershipExpiration) {
            return res.status(400).json({ status: 400, message: "Journal ID, User ID, and Expiration Date are required." });
        }

        const newMember = new JournalMember({
            journalId: toObjectId(journalId),
            userId: toObjectId(userId),
            membershipExpiration: new Date(membershipExpiration)
        });

        await newMember.save();
        return res.status(200).json({ status: 200, message: "Member linked to journal successfully", data: newMember });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: "User is already a member of this journal." });
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// List Members for a Particular Journal (Read)
<<<<<<< HEAD
router.get("/journal-member/list", async (req, res) => {
=======
router.get("/list", async (req, res) => {
>>>>>>> development-dummy
    try {
        const { journalId } = req.query;
        if (!journalId) return res.status(400).json({ message: "Journal ID is required." });

        const members = await JournalMember.find({ journalId: toObjectId(journalId) })
            .populate("userId", "personalName familyName email profilePic")
            .sort({ createdAt: -1 });

        return res.status(200).json({ status: 200, data: members });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// List Members for a User (Get all journals for a user)
router.get("/journal-member/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        const memberships = await JournalMember.find({ userId: toObjectId(userId) })
            .populate("journalId", "title acronym")
            .sort({ createdAt: -1 });

        return res.status(200).json({ status: 200, data: memberships });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Update Membership (Update)
<<<<<<< HEAD
router.patch("/journal-member/update/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
=======
router.patch("/update/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
>>>>>>> development-dummy
    try {
        const { membershipExpiration, status } = req.body;
        
        const updateData = {};
        if (membershipExpiration) updateData.membershipExpiration = new Date(membershipExpiration);
        if (status) updateData.status = status;

        const updatedMember = await JournalMember.findByIdAndUpdate(
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
<<<<<<< HEAD
router.delete("/journal-member/remove/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
=======
router.delete("/remove/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
>>>>>>> development-dummy
    try {
        const deleted = await JournalMember.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Record not found." });
        return res.status(200).json({ status: 200, message: "Member removed from journal." });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

// Get Single Membership
<<<<<<< HEAD
router.get("/journal-member/:id", async (req, res) => {
=======
router.get("/:id", async (req, res) => {
>>>>>>> development-dummy
    try {
        const membership = await JournalMember.findById(req.params.id)
            .populate("journalId", "title acronym")
            .populate("userId", "personalName familyName email profilePic");
        
        if (!membership) return res.status(404).json({ message: "Membership not found." });
        return res.status(200).json({ status: 200, data: membership });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
});

module.exports = router;
