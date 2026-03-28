const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
 title: String,
 description: String,
 level: Number,
 deadline: String,
 course: { type: String, required: true },
 topic: { type: String, required: true },
 correctAnswer: { type: String }
});

module.exports = mongoose.model("Challenge", ChallengeSchema);