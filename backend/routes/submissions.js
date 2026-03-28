const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Submission = require("../models/Submission");
const User = require("../models/User");

// @route   GET /submissions
// @desc    Get all submissions (Mentor/Admin)
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "mentor" && req.user.role !== "admin") {
      const studentSubs = await Submission.find({ userId: req.user.id })        
        .populate("userId", "name email")
        .populate("challengeId", "title level");
      return res.json(studentSubs);
    }

    if (req.user.role === "mentor") {
      const Mentorship = require("../models/Mentorship");
      const activeMentorships = await Mentorship.find({
        mentorId: req.user.id,
        status: "accepted"
      });
      const menteeIds = activeMentorships.map(m => m.menteeId);
      
      const submissions = await Submission.find({ userId: { $in: menteeIds } }) 
        .populate("userId", "name email")
        .populate("challengeId", "title level")
        .sort({ createdAt: -1 });

      return res.json(submissions);
    }

    // Admin gets all
    const submissions = await Submission.find()
      .populate("userId", "name email")
      .populate("challengeId", "title level")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   GET /submissions/my
// @desc    Get current user's submissions
router.get("/my", auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id })
      .populate("challengeId", "title level");
    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   PATCH /submissions/:id
// @desc    Update submission status (Approve/Reject)
router.patch("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "mentor" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Mentors only." }); 
    }

    const { status, feedback } = req.body;
    if (!["approved", "rejected"].includes(status)) {
       return res.status(400).json({ message: "Invalid status" });
    }

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Update submission
    submission.status = status;
    if (feedback) submission.feedback = feedback;
    await submission.save();

    // Gamification logic: Check if we just approved the submission
    if (status === "approved") {
      const student = await User.findById(submission.userId);
      if (student) {
        student.points = (student.points || 0) + 50;
        student.level = Math.floor(student.points / 100) + 1;
        await student.save();
      }
    }

    res.json(submission);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   POST /submissions
// @desc    Create a new submission
router.post("/", auth, async (req, res) => {
  try {
    const { challengeId, isSimple, answer, projectLink, description } = req.body;

    if (isSimple) {
      // Auto-complete simple challenges
      const user = await User.findById(req.user.id);

      if (!user.completedChallenges.includes(challengeId)) {
        user.points = (user.points || 0) + 50;
        user.level = Math.floor(user.points / 100) + 1;
        user.completedChallenges.push(challengeId);
        await user.save();
      }

      const autoSubmission = new Submission({
        userId: req.user.id,
        challengeId,
        projectLink: "",
        description: answer || "",
        status: "approved"
      });
      await autoSubmission.save();

      return res.json({ message: "Submission auto-graded!", autoGraded: true, submission: autoSubmission });
    }

    const submission = new Submission({
      userId: req.user.id,
      challengeId,
      projectLink: projectLink || "",
      description: description,
      status: "pending"
    });

    await submission.save();
    res.json({ message: "Submission successful!", autoGraded: false, submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
