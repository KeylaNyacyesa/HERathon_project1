const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");  
    req.userId = decoded.id || (decoded.user && decoded.user.id);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// POST /users/courses - Save selected courses
router.post("/courses", async (req, res) => {
  try {
    const { courses } = req.body;
    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ message: "Courses array required" });       
    }
    await User.findByIdAndUpdate(req.userId, { courses });
    res.json({ message: "Courses saved", courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /users/topics - Save selected topics (require courses)
router.post("/topics", async (req, res) => {
  try {
    const { topics } = req.body;
    if (!Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ message: "At least one topic required" });  
    }
    const user = await User.findById(req.userId);
    if (!user.courses || user.courses.length === 0) {
      return res.status(400).json({ message: "Select courses first" });
    }
    await User.findByIdAndUpdate(req.userId, { topics });
    res.json({ message: "Topics saved. Dashboard unlocked!", topics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /users/setup-status
router.get("/setup-status", async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("courses topics firstName lastName school name");
    res.json({
      hasCourses: user.courses && user.courses.length > 0,
      hasTopics: user.topics && user.topics.length > 0,
      profileComplete: user.school && user.firstName && user.lastName
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /users/profile - update profile
router.put("/profile", async (req, res) => {
  try {
    const { name, firstName, lastName, school, skills, bio, picture, certificates } = req.body;

    const update = {};
    if (name !== undefined) update.name = name;
    if (firstName !== undefined) update.firstName = firstName;
    if (lastName !== undefined) update.lastName = lastName;
    if (school !== undefined) update.school = school;
    if (bio !== undefined) update.bio = bio;
    if (picture !== undefined) update.picture = picture;
    
    if (skills !== undefined) {
      update.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(s => s);
    }
    if (certificates !== undefined) {
      update.certificates = Array.isArray(certificates) ? certificates : [];
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, update, { new: true }).select("-password");
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
