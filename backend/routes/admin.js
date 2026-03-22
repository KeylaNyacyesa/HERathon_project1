const express = require("express");
const User = require("../models/User");
const Challenge = require("../models/Challenge");
const Team = require("../models/Team");

const router = express.Router();

// Simple admin summary endpoint
router.get("/summary", async (req, res) => {
  try {
    const [userCount, challengeCount, teamCount] = await Promise.all([
      User.countDocuments(),
      Challenge.countDocuments(),
      Team.countDocuments(),
    ]);

    res.json({
      users: userCount,
      challenges: challengeCount,
      teams: teamCount,
    });
  } catch (err) {
    console.error("Admin summary error", err);
    res.status(500).json({ message: "Failed to load admin summary" });
  }
});

module.exports = router;

