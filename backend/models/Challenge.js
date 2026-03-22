const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
 title: String,
 description: String,
 level: Number,
 deadline: String
});

module.exports = mongoose.model("Challenge", ChallengeSchema);