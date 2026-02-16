"use strict";
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ConferenceTrackArticleTypeSelection = require('../../models/conference/ConferenceTrackArticleTypeSelection');
const { User } = require('../../models/auth/user');
const { Track, Article } = require('../../models/common/topic');
const ArticleType = require('../../models/conference/ArticleType');

// Helper function to convert string to ObjectId
function toObjectId(id) {
    if (!id) return null;
    if (mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
    }
    return null;
}

// GET: Fetch master data merged with current selections
router.get("/get-all-data", async (req, res) => {
    try {
        const { conferenceId } = req.query;
        if (!conferenceId) return res.status(400).json({ message: "Conference ID required" });

        const targetConfId = toObjectId(conferenceId);
        if (!targetConfId) {
            return res.status(400).json({ message: "Invalid Conference ID" });
        }

        // DEBUG: Log model field info
        console.log("DEBUG: Article model fields:", Object.keys(Article.schema.paths));
        console.log("DEBUG: ArticleType model fields:", Object.keys(ArticleType.schema.paths));
        
        // DEBUG: Test query with both models
        const articleResults = await Article.find({ conferenceId: targetConfId }).lean();
        const articleTypeResults = await ArticleType.find({ conferenceId: targetConfId }).lean();
        console.log("DEBUG: Article.find() result count:", articleResults.length);
        console.log("DEBUG: ArticleType.find() result count:", articleTypeResults.length);

        // Fetch all tracks and article types (Article without conferenceId filter), plus current selections
        const [allTracks, allTypes, currentSelections] = await Promise.all([
            Track.find().sort({ name: 1 }).lean(),
            Article.find().sort({ name: 1 }).lean(),
            ConferenceTrackArticleTypeSelection.find({ conferenceId: targetConfId }).lean()
        ]);

        // Get selected track IDs and article type IDs
        const selectedTracks = currentSelections.filter(s => s.selectionType === 'track');
        const selectedArticleTypes = currentSelections.filter(s => s.selectionType === 'articleType');

        // Fetch chair editor IDs from selected tracks
        const chairEditorIds = selectedTracks
            .map(s => s.chairEditorId)
            .filter(Boolean);

        // Fetch user details for chair editors
        let userMap = new Map();
        if (chairEditorIds.length > 0) {
            try {
                const chairEditors = await User.find({
                    _id: { $in: chairEditorIds.map(id => toObjectId(id)) }
                }).lean();

                chairEditors.forEach(user => {
                    userMap.set(user._id.toString(), {
                        _id: user._id.toString(),
                        personalName: user.personalName,
                        familyName: user.familyName,
                        email: user.email,
                        profilePic: user.profilePic || ""
                    });
                });
            } catch (err) {
                console.error("Error fetching chair editors:", err);
            }
        }

        // Lookup maps for O(1) performance
        const selectedTrackMap = new Map(
            selectedTracks
                .filter(s => s.trackId)
                .map(s => [s.trackId.toString(), s.chairEditorId ? s.chairEditorId.toString() : null])
        );

        const selectedTypesSet = new Set(
            selectedArticleTypes
                .filter(s => s.articleTypeId)
                .map(s => s.articleTypeId.toString())
        );

        const mergedTracks = allTracks.map(t => {
            const chairEditorId = selectedTrackMap.get(t._id.toString());
            const chairEditor = chairEditorId ? userMap.get(chairEditorId) : null;
            return {
                _id: t._id.toString(),
                name: t.name,
                description: t.description || "",
                selected: selectedTrackMap.has(t._id.toString()),
                chairEditorId: chairEditorId || "",
                chairEditor: chairEditor || null
            };
        });

        const mergedTypes = allTypes.map(at => ({
            _id: at._id.toString(),
            name: at.name,
            description: at.description || "",
            selected: selectedTypesSet.has(at._id.toString())
        }));

        res.json({ success: true, data: { tracks: mergedTracks, articleTypes: mergedTypes } });
    } catch (error) {
        console.error("GET ERROR:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST: Save all selections using Transactions
router.post("/save-all-selections", async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { conferenceId, tracks, articleTypes } = req.body;
        
        if (!conferenceId) {
            return res.status(400).json({ success: false, message: "Conference ID is required" });
        }

        const targetConfId = toObjectId(conferenceId);
        if (!targetConfId) {
            return res.status(400).json({ success: false, message: "Invalid Conference ID" });
        }

        const bulkData = [];

        if (Array.isArray(tracks)) {
            tracks.forEach(t => {
                bulkData.push({
                    conferenceId: targetConfId,
                    trackId: toObjectId(t.trackId),
                    chairEditorId: t.chairEditorId ? toObjectId(t.chairEditorId) : null,
                    selectionType: 'track'
                });
            });
        }

        if (Array.isArray(articleTypes)) {
            articleTypes.forEach(at => {
                bulkData.push({
                    conferenceId: targetConfId,
                    articleTypeId: toObjectId(at.articleTypeId),
                    selectionType: 'articleType'
                });
            });
        }

        await ConferenceTrackArticleTypeSelection.deleteMany({ conferenceId: targetConfId }, { session });
        
        if (bulkData.length > 0) {
            await ConferenceTrackArticleTypeSelection.insertMany(bulkData, { session });
        }

        await session.commitTransaction();
        
        res.status(200).json({ 
            success: true, 
            message: "Selections saved successfully",
            count: bulkData.length 
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("SAVE ERROR:", error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        session.endSession();
    }
});

module.exports = router;
