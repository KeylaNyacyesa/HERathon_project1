const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
 name: String,
 email: { type: String, unique: true },
 password: String,
 role: { type: String, default: "student" },
 level: { type: Number, default: 1 },
 skills: String
});

module.exports = mongoose.model("User", UserSchema);