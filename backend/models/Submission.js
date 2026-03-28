const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
 userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
 projectLink: String,
 description: String,
 feedback: String,
 status: { type: String, default: "pending" },
 attempts: { type: Number, default: 1 },
 medal: {
   type: String,
   enum: ['none', 'bronze', 'silver', 'gold'],
   default: 'none'
 },
 submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Submission", SubmissionSchema);