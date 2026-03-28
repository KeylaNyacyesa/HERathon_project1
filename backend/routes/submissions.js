const express = require("express");
const router = express.Router();
const Submission = require("../models/Submission");
const User = require("../models/User");
const Challenge = require("../models/Challenge");
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

// POST /submissions - Create new submission
router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");  
    const { challengeId, projectLink, description, answer, isSimple } = req.body;

    const challenge = await Challenge.findById(challengeId);
    let finalStatus = "Under Review";
    let finalProjectLink = projectLink || "None";
    let finalDescription = description || "No description";

    // Auto-grading for levels <= 3
    if (challenge && challenge.level <= 3 && isSimple) {
      if (!answer) return res.status(400).json({ message: "Answer required" });
      
      const isCorrect = answer.trim().toLowerCase() === (challenge.correctAnswer || "").trim().toLowerCase();
      
      if (!isCorrect) {
        return res.status(400).json({ 
          message: "Incorrect answer. Please try again!",
          autoGraded: false,
          isCorrect: false
        });
      }

      finalDescription = answer;
      finalStatus = "Approved";
      submission.projectLink = finalProjectLink;
      submission.description = finalDescription;
      submission.feedback = "";
      submission.status = finalStatus;
      if(finalStatus !== "Approved") submission.medal = "none";
      await submission.save();
    } else {
      submission = new Submission({
        userId: decoded.id,
        challengeId,
        projectLink: finalProjectLink,
        description: finalDescription,
        attempts: 1,
        status: finalStatus,
        medal: "none"
      });
      await submission.save();
    }

    // Process auto-leveling if auto-approved
    if (finalStatus === "Approved") {
      const medal = submission.attempts === 1 ? "gold" :
                    submission.attempts === 2 ? "silver" : "bronze";
      submission.medal = medal;
      await submission.save();

      const user = await User.findById(decoded.id);
      if (user && !user.completedChallenges.some(cc => cc.toString() === challengeId.toString())) {
        user.points += 50;
        user.completedChallenges.push(challengeId);
        // Only level up if the challenge level matches their current level
        if (challenge.level >= user.level) {
          user.level += 1;
        }
        await user.save();
      }
    }

    submission = await Submission.findById(submission._id).populate("challengeId");
    
    res.status(201).json({ 
      message: finalStatus === "Approved" ? "Auto-graded successfully!" : "Submission created", 
      submission,
      autoGraded: finalStatus === "Approved"
    });
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
      const medal = submission.attempts === 1 ? "gold" :
                    submission.attempts === 2 ? "silver" : "bronze";
      submission.medal = medal;

      const user = await User.findById(submission.userId);
      if (user && !user.completedChallenges.some(cc => cc.toString() === submission.challengeId._id.toString())) {
        user.points += 50;
        user.completedChallenges.push(submission.challengeId._id);
        // Ensure they only level up past complex challenges if they match their level
        if (submission.challengeId.level >= user.level) {
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
