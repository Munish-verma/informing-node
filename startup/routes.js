"use strict";

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger_output.json");

// Admin routes
const admins = require("../routes/admin/admins.js");

// Auth routes
const users = require("../routes/auth/users.js");

// Common routes
const topics = require("../routes/common/topics.js");
const faq = require("../routes/common/faq.js");
const contentManagements = require("../routes/common/contentManagements.js");
const articles = require("../routes/common/articles.js");
const evaluationForms = require("../routes/common/evaluationForms.js");
const guidelines = require("../routes/common/guidelines.js");
const specialIssue = require("../routes/common/specialIssue.js");
const reminder = require("../routes/common/reminder.js");
const selection = require("../routes/common/selection.js");
const abstractBreakdown = require("../routes/common/abstractBreakdown.js");

// Conference routes
const conferences = require("../routes/conference/conferences.js");
const conferenceAbstract = require("../routes/conference/conferenceAbstract.js");
const conferenceArticle = require("../routes/conference/conferenceArticle.js");
const conferenceAuthor = require("../routes/conference/conferenceAuthor.js");
const conferenceEvalForm = require("../routes/conference/conferenceEvalForm.js");
const conferenceGuideline = require("../routes/conference/conferenceGuideline.js");
const conferenceMember = require("../routes/conference/conferenceMember.js");
const conferenceReminder = require("../routes/conference/conferenceReminder.js");
const conferenceSelection = require("../routes/conference/conferenceSelection.js");
const conferenceSpecialIssue = require("../routes/conference/conferenceSpecialIssue.js");
const conferenceTopic = require("../routes/conference/conferenceTopic.js");
const conferenceTrack = require("../routes/conference/conferenceTrack.js");
const articleTrackTypeSelection = require("../routes/conference/articleTrackTypeSelection.js");
const conferenceSchedule = require("../routes/conference/conferenceSchedule.js");
const conferenceMeta = require("../routes/conference/conferenceMeta.js");
const conferenceConfig = require("../routes/conference/conferenceConfig.js");

// Journal routes
const journals = require("../routes/journal/journals.js");
const journalAbstract = require("../routes/journal/journalAbstract.js");
const journalMember = require("../routes/journal/journalMember.js");
const journalAuthor = require("../routes/journal/journalAuthor.js");

// Media routes
const banners = require("../routes/media/banners.js");
const mediaUpload = require("../routes/media/mediaUpload.js");
const webviews = require("../routes/media/webviews.js");

// Dashboard routes
const dashboard = require("../routes/dashboard/dashboard.js");

// Category routes
const categories = require("../routes/category.js");

module.exports = function (app) {
  app.use(express.json());

  const allowedOrigins = [
    "https://www.informingscience.fyi",
    "https://informingscience.fyi",
    "http://localhost:5173"
  ];

  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
          const msg =
            "The CORS policy for this site does not allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      credentials: true,
    }),
  );

  // Request logging middleware
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const ip = req.ip || req.connection.remoteAddress;

    // console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

    // Log response when finished
    res.on("finish", () => {
      const statusCode = res.statusCode;
      // console.log(`[${timestamp}] ${method} ${url} - Status: ${statusCode}`);
    });

    next();
  });

  // API Routes
  app.use("/api/admin", admins);
  app.use("/api/user", users);

  // Common routes
  app.use("/api/topic", topics);
  app.use("/api/faq", faq);
  app.use("/api/content", contentManagements);
  app.use("/api/article", articles);
  app.use("/api/evaluation-form", evaluationForms);
  app.use("/api/guideline", guidelines);
  app.use("/api/special-issue", specialIssue);
  app.use("/api", reminder);
  app.use("/api", selection);
  app.use("/api/abstract-breakdown", abstractBreakdown);

  // Conference routes
  app.use("/api/conference", conferences);
  app.use("/api/conference-abstract", conferenceAbstract);
  app.use("/api/conference-article", conferenceArticle);
  app.use("/api/conference-author", conferenceAuthor);
  app.use("/api/conference-eval-form", conferenceEvalForm);
  app.use("/api/conference-guideline", conferenceGuideline);
  app.use("/api/conference-member", conferenceMember);
  app.use("/api/conference-reminder", conferenceReminder);
  app.use("/api/conference-selection", conferenceSelection);
  app.use("/api/conference-special-issue", conferenceSpecialIssue);
  app.use("/api/conference-topic", conferenceTopic);
  app.use("/api/conference-track", conferenceTrack);
  app.use("/api/conference-track-type-selection", articleTrackTypeSelection);
  app.use("/api/conference-article-selection", articleTrackTypeSelection); // Alias for conference-track-type-selection
  app.use("/api/conference-schedule", conferenceSchedule);
  app.use("/api/conference-meta", conferenceMeta);
  app.use("/api/conference-config", conferenceConfig);

  // Journal routes
  app.use("/api/journal", journals);
  app.use("/api/journal-abstract", journalAbstract);
  app.use("/api/journal-member", journalMember);
  app.use("/api/journal-author", journalAuthor);

  // Media routes
  app.use("/api/banner", banners);
  app.use("/api/mediaUpload", mediaUpload);
  app.use("/api/webviews", webviews);

  // Dashboard routes
  app.use("/api/dashboard", dashboard);

  // Category routes
  app.use("/api/category", categories);

  // Swagger Documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Root route
  app.get("/", (req, res) => {
    res.send("Informing Science API is running");
  });
};
