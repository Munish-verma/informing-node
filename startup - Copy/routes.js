"use strict";

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger_output.json");
const users = require("../routes/users.js");
const admins = require("../routes/admins.js");
const banners = require("../routes/banners.js");
const topics = require("../routes/topics.js");
const journals = require("../routes/journals.js");
const conferences = require("../routes/conferences.js");
const faq = require("../routes/faq.js");
const contentManagements = require("../routes/contentManagements.js");
const mediaUpload = require("../routes/mediaUpload.js");
const dashboard = require("../routes/dashboard.js");
const webviews = require("../routes/webviews.js");
const articles = require("../routes/articles.js");
const evaluationForms = require("../routes/evaluationForms.js");
const guidelines = require("../routes/guidelines.js");
const journalAbstract = require("../routes/journalAbstract.js");
const specialIssue = require("../routes/specialIssue.js");
const reminder = require("../routes/reminder.js");
const journalMember = require("../routes/journalMember.js");
const journalAuthor = require("../routes/journalAuthor.js");
const selection = require("../routes/selection.js");

module.exports = function (app) {
  app.use(express.json());

  // Request logging middleware
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const ip = req.ip || req.connection.remoteAddress;

    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

    // Log response when finished
    res.on("finish", () => {
      const statusCode = res.statusCode;
      console.log(`[${timestamp}] ${method} ${url} - Status: ${statusCode}`);
    });

    next();
  });

  // API Routes
  app.use("/api/user", users);
  app.use("/api/admin", admins);
  app.use("/api/banner", banners);
  app.use("/api/topic", topics);
  app.use("/api/journal", journals);
  app.use("/api/conference", conferences);
  app.use("/api/faq", faq);
  app.use("/api/content", contentManagements);
  app.use("/api/mediaUpload", mediaUpload);
  app.use("/api/dashboard", dashboard);
  app.use("/api/webviews", webviews);
  app.use("/api/article", articles);
  app.use("/api/evaluation-form", evaluationForms);
  app.use("/api/guideline", guidelines);
  app.use("/api/journal-abstract", journalAbstract);
  app.use("/api/special-issue", specialIssue);
  app.use("/api", reminder);
  app.use("/api", journalMember);
  app.use("/api", journalAuthor);
  app.use("/api", selection);

  // Swagger Documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Root route
  app.get("/", (req, res) => {
    res.send("Informing Science API is running");
  });
};
