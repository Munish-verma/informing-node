"use strict"

const mongoose = require("mongoose");
const { Admin } = require("../models/admin/admin.js");
const EvaluationForm = require("../models/common/EvaluationForm.js");
const AbstractBreakdown = require("../models/common/AbstractBreakdown.js");
const { generateHash } = require("../services/bcrypt.js");
const config = require("config");

const environment = config.get("environment");

module.exports = async function () {
  try {
    // Create default admin if not exists
    let query = { email: "admin1@support.com" }
    let admin = await Admin.findOne(query);

    if (!admin) {
      let defaultPassword = '12345678';
      let password = generateHash(defaultPassword);

      let newAdmin = {
        email: "admin1@support.com",
        password: password,
        admin: true,
      }
      await Admin.create(newAdmin);
      console.log("Default admin created");
    }

    // Create dummy Evaluation Forms if not exists
    const dummyForms = [
      {
        title: "Research Article Evaluation",
        description: "Standard evaluation form for research articles",
        isPublic: true,
        inUse: true,
        category: "Research"
      },
      {
        title: "Case Study Review",
        description: "Evaluation criteria for case studies",
        isPublic: false,
        inUse: true,
        category: "Case Study"
      },
      {
        title: "General Peer Review",
        description: "Generic peer review form for all article types",
        isPublic: true,
        inUse: true,
        category: "General"
      }
    ];

    for (const formData of dummyForms) {
      const existingForm = await EvaluationForm.findOne({ title: formData.title });
      if (!existingForm) {
        await EvaluationForm.create(formData);
        console.log(`Dummy form created: ${formData.title}`);
      }
    }

    // Seed Abstract Breakdown sections
    const abstractSections = [
      { name: "Aim/Purpose", value: "aim-purpose" },
      { name: "Background", value: "background" },
      { name: "Methodology", value: "methodology" },
      { name: "Contribution", value: "contribution" },
      { name: "Findings", value: "findings" },
      { name: "Recommendations for Practitioners", value: "recommendations-practitioners" },
      { name: "Recommendation for Researchers", value: "recommendations-researchers" },
      { name: "Impact on Society", value: "impact-society" },
      { name: "Future Research", value: "future-research" }
    ];

    for (const section of abstractSections) {
      const existingSection = await AbstractBreakdown.findOne({ name: section.name });
      if (!existingSection) {
        await AbstractBreakdown.create(section);
        console.log(`Abstract section created: ${section.name}`);
      }
    }

    console.log("Database seeding completed");

  } catch (err) {
    console.error("Error seeding database:", err);
  }
};
