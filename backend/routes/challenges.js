const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Challenge = require("../models/Challenge");
const User = require("../models/User");

// GET /challenges [userId] - challenges with status (completed/unlocked/locked) for student dashboard
router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const userId = req.query.userId;
    let challenges;
    
    if (!token) {
      challenges = await Challenge.find().sort({ level: 1 });
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
      const user = await User.findById(decoded.id).populate("completedChallenges");
      
      // Filter by ?topic param or user's topics
      let query = {};
      if (req.query.topic) {
        query.topic = req.query.topic;
      } else if (user.topics && user.topics.length > 0) {
        query.topic = { $in: user.topics };
      }
      
      challenges = await Challenge.find(query).sort({ level: 1 });
      
      // Add status
      challenges = challenges.map(challenge => {
        const isCompleted = user.completedChallenges.some(cc => cc && cc._id && cc._id.toString() === challenge._id.toString());
        const isUnlocked = challenge.level === 1 || user.completedChallenges.some(cc => cc && cc.topic === challenge.topic && cc.level === challenge.level - 1);
        
        return {
          ...challenge.toObject(),
          status: isCompleted ? "completed" : isUnlocked ? "unlocked" : "locked"
        };
      });
    }

    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// COMPLETE challenge - already gamified with points/levels/badges
router.post("/complete/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const userId = decoded.id;
    const user = await User.findById(userId);
    const challenge = await Challenge.findById(req.params.id);

    if (!user || !challenge) {
      return res.status(404).json({ message: "Not found" });
    }

    if (user.completedChallenges.some(cc => cc.toString() === challenge._id.toString())) {
      return res.status(400).json({ message: "Already completed" });
    }

    if (challenge.level > user.level) {
      return res.status(400).json({ message: "Challenge locked" });
    }

    user.completedChallenges.push(challenge._id);
    user.points += 50;

    // LEVEL UP
    if (challenge.level === user.level) {
      user.level += 1;
    }

    // BADGES
    const totalPoints = user.points;
    if (totalPoints >= 100 && !user.badges.includes("Starter")) {
      user.badges.push("Starter");
    }
    if (totalPoints >= 300 && !user.badges.includes("Explorer")) {
      user.badges.push("Explorer");
    }
    if (totalPoints >= 500 && !user.badges.includes("Master")) {
      user.badges.push("Master");
    }

    await user.save();
    const updatedUser = await User.findById(userId).populate("completedChallenges");

    res.json({
      message: "Challenge completed!",
      user: {
        level: updatedUser.level,
        points: updatedUser.points,
        badges: updatedUser.badges,
        completedChallenges: updatedUser.completedChallenges
      }
    });
  } catch (err) {
    console.error("Complete challenge error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
