const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String},
  answer: { type: String },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  insertDate: { type: Number, default: () => { return Math.round(new Date() / 1000); }, },
  creationDate: { type: Date, default: () => { return new Date(); }, },
});

const FAQ = mongoose.model("faq", faqSchema);
module.exports = { FAQ };