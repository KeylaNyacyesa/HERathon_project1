const express = require("express");
const router = express.Router();
const Submission = require("../models/Submission");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// GET /submissions - All submissions for mentor/admin review (?status=Under Review)
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const submissions = await Submission.find(filter).populate("userId challengeId");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /submissions/my - Student's own submissions
router.get("/my", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const submissions = await Submission.find({ userId: decoded.id }).populate("challengeId");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /submissions - Create new submission (increment attempts if exists for challenge)
router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const { challengeId, projectLink, description } = req.body;

    let submission = await Submission.findOne({ 
      userId: decoded.id, 
      challengeId 
    }).populate("challengeId");

    if (submission) {
      // Increment attempt
      submission.attempts += 1;
      submission.projectLink = projectLink;
      submission.description = description;
      submission.feedback = "";
      submission.status = "Under Review";
      submission.medal = "none";
      await submission.save();
    } else {
      submission = new Submission({
        userId: decoded.id,
        challengeId,
        projectLink,
        description,
        attempts: 1,
        medal: "none"
      });
      await submission.save();
      submission = await submission.populate("challengeId");
    }

    res.status(201).json({ message: "Submission created", submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /submissions/:id/review - Mentor/admin review with medal assignment
router.put("/:id/review", async (req, res) => {
  try {
    const { status, feedback } = req.body;
    let submission = await Submission.findById(req.params.id).populate("userId challengeId");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (status === "Approved" && submission.medal === "none") {
      // Assign medal ONLY on first approval
      const medal = submission.attempts === 1 ? "gold" : 
                    submission.attempts === 2 ? "silver" : "bronze";
      submission.medal = medal;
      
      // Award XP
      const user = await User.findById(submission.userId);
      if (user && !user.completedChallenges.some(cc => cc.toString() === submission.challengeId._id.toString())) {
        user.points += 50;
        user.completedChallenges.push(submission.challengeId._id);
        if (submission.challengeId.level === user.level) {
          user.level += 1;
        }
        await user.save();
      }
    }
    
    submission.status = status;
    submission.feedback = feedback;
    await submission.save();

    const updated = await Submission.findById(submission._id).populate("userId challengeId");
    res.json({ message: "Review updated", submission: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

