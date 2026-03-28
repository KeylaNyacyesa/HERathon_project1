const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
 name: String,
 firstName: String,
 lastName: String,
 email: { type: String, unique: true },
 password: String,
 school: { type: String }, // removed required:true so registration succeeds
 bio: String,
 picture: String,
 certificates: [String],

 role: { type: String, default: "student" },

 level: { type: Number, default: 1 },
 points: { type: Number, default: 0 },
 badges: [String],

 completedChallenges: [
   { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }
 ],

 skills: [String],
  courses: [String],
  topics: [String]
});

module.exports = mongoose.model("User", UserSchema);