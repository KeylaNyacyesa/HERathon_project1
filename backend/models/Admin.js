const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  role: { type: String, default: "admin" },
});

module.exports = mongoose.model("Admin", AdminSchema);

