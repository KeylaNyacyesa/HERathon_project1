const express = require("express");
const router = express.Router();
const Mentorship = require("../models/Mentorship");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// GET available mentors (mentors role)
router.get("/available", async (req, res) => {
  try {
    const mentors = await User.find({ role: "mentor" }).select("name email skills");
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /mentors/my-students - Mentor's assigned students (via Mentorship model)
router.get("/my-students", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const mentorships = await Mentorship.find({ mentorId: decoded.id })
      .populate("menteeId");
    
    const students = mentorships.map(m => m.menteeId);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET user's mentorships
router.get("/my-mentorships", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const mentorships = await Mentorship.find({ 
      $or: [{ mentorId: decoded.id }, { menteeId: decoded.id }] 
    }).populate("mentorId menteeId");

    res.json(mentorships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

