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

// POST /request - Request mentorship
router.post("/request", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const { mentorId, topic, message } = req.body;
    
    const Mentorship = require("../models/Mentorship");
    const newMentorship = new Mentorship({
      menteeId: decoded.id,
      mentorId,
      topic,
      message,
      status: "pending"
    });
    
    await newMentorship.save();
    res.status(201).json(newMentorship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /request/:id/status - Update mentorship request status
router.put("/request/:id/status", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const { status } = req.body;

    const mentorship = await Mentorship.findById(req.params.id);
    if (!mentorship) return res.status(404).json({ message: "Request not found" });

    if (mentorship.mentorId.toString() !== decoded.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    mentorship.status = status;
    await mentorship.save();
    res.json(mentorship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

