"use strict"
const express = require("express");
const router = express.Router();
const { success, failure } = require("../helper/responseHelper.js");
const { ADMIN_CONSTANTS } = require("../config/constant.js")
const { identityManager } = require("../middleware/auth.js");
const { User } = require("../models/user.js");
const { Journal } = require("../models/journal.js")
const { Conference } = require("../models/conference.js")

router.get("/admin", identityManager(["superAdmin"]), async (req, res) => {
    try {
        const { period = "all" } = req.query; // all, weekly, monthly, yearly

        const getDateFilter = (periodType) => {
            const currentDate = new Date();
            const currentTimestamp = Math.floor(currentDate.getTime() / 1000); // Convert to Unix timestamp

            switch (periodType) {
                case "weekly":
                    const oneWeekAgo = new Date(currentDate);
                    oneWeekAgo.setDate(currentDate.getDate() - 7);
                    const weeklyTimestamp = Math.floor(oneWeekAgo.getTime() / 1000);
                    return { insertDate: { $gte: weeklyTimestamp } };

                case "monthly":
                    const oneMonthAgo = new Date(currentDate);
                    oneMonthAgo.setMonth(currentDate.getMonth() - 1);
                    const monthlyTimestamp = Math.floor(oneMonthAgo.getTime() / 1000);
                    return { insertDate: { $gte: monthlyTimestamp } };

                case "yearly":
                    const oneYearAgo = new Date(currentDate);
                    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
                    const yearlyTimestamp = Math.floor(oneYearAgo.getTime() / 1000);
                    return { insertDate: { $gte: yearlyTimestamp } };

                default:
                    return {};
            }
        };

        const dateFilter = getDateFilter(period);

        // Build queries
        const baseUserQuery = period === "all" ? {} : dateFilter;
        const baseContentQuery = period === "all" ? {} : dateFilter;

        const [
            activeUsers,
            inactiveUsers,
            deletedUsers,
            totalJournal,
            totalConference
        ] = await Promise.all([
            User.countDocuments({ ...baseUserQuery, status: "active" }),
            User.countDocuments({ ...baseUserQuery, status: "inactive" }),
            User.countDocuments({ ...baseUserQuery, status: "deleted" }),
            Journal.countDocuments(baseContentQuery),
            Conference.countDocuments(baseContentQuery)
        ]);

        const totalUsers = activeUsers + inactiveUsers;

        const response = {
            period: period,
            totalUsers,
            activeUsers,
            inactiveUsers,
            deletedUsers,
            totalJournal,
            totalConference
        };

        return success(res, req.apiId, ADMIN_CONSTANTS.SUCCESS, response);
    } catch (error) {
        return failure(res, req.apiId, error.message);
    }
});

module.exports = router;