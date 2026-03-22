const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
 name: String,
 members: [String],
 projectIdea: String
});

module.exports = mongoose.model("Team", TeamSchema);