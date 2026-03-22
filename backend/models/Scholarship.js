const mongoose = require("mongoose");

const ScholarshipSchema = new mongoose.Schema({
 name: String,
 description: String,
 deadline: String
});

module.exports = mongoose.model("Scholarship", ScholarshipSchema);