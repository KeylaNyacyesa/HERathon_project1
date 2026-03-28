const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Challenge = require("../models/Challenge");
const Team = require("../models/Team");
const Scholarship = require("../models/Scholarship");
const Submission = require("../models/Submission");
const Notification = require("../models/Notification");

const router = express.Router();

// Admin summary - platform stats
router.get("/summary", async (req, res) => {
  try {
    const [userCount, challengeCount, teamCount, scholarshipCount, submissionCount, notificationCount] = await Promise.all([
      User.countDocuments(),
      Challenge.countDocuments(),
      Team.countDocuments(),
      Scholarship.countDocuments(),
      Submission.countDocuments(),
      Notification.countDocuments(),
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    res.json({
      users: userCount,
      challenges: challengeCount,
      teams: teamCount,
      scholarships: scholarshipCount,
      submissions: submissionCount,
      notifications: notificationCount,
      usersByRole
    });
  } catch (err) {
    console.error("Admin summary error", err);
    res.status(500).json({ message: "Failed to load admin summary" });
  }
});

// POST /admin/challenges - Create challenge
router.post("/challenges", async (req, res) => {
  try {
    const challenge = await Challenge.create(req.body);
    res.status(201).json(challenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /admin/users - All users for management
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /admin/notifications - Send platform notification
router.post("/notifications", async (req, res) => {
  try {
    const { message, type, targetUsers } = req.body;
    const users = targetUsers ? await User.find({ _id: { $in: targetUsers } }) : await User.find();

    const notifications = users.map(user => ({
      userId: user._id,
      message,
      type
    }));

    await Notification.insertMany(notifications);

    res.json({ message: "Notifications sent", count: notifications.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

