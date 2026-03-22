const mongoose = require("mongoose");

const MentorshipSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  topic: String,
  status: { type: String, default: "pending" }, // pending, active, completed
});

module.exports = mongoose.model("Mentorship", MentorshipSchema);

