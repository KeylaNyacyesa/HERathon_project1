const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
 userId: String,
 challengeId: String,
 projectLink: String,
 feedback: String,
 status: { type: String, default: "Under Review" }
});

module.exports = mongoose.model("Submission", SubmissionSchema);