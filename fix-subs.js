const fs = require('fs');
let c = fs.readFileSync('backend/routes/submissions.js', 'utf8');

c = c.replace(/const User = require\("\.\.\/models\/User"\);/, 'const User = require("../models/User");\nconst Challenge = require("../models/Challenge");');

const oldRoute = `router.post("/", async (req, res) => {
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
});`;

const newRoute = `router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");  
    const { challengeId, projectLink, description, answer, isSimple } = req.body;

    const challenge = await Challenge.findById(challengeId);
    let finalStatus = "Under Review";
    let finalProjectLink = projectLink || "None";
    let finalDescription = description || "No description";

    if (challenge && challenge.level <= 3 && isSimple) {
      finalStatus = "Approved"; // Automatically grade levels 1-3
      finalProjectLink = "Simple Answer";
      finalDescription = answer || "No answer provided";
    }

    let submission = await Submission.findOne({
      userId: decoded.id,
      challengeId
    }).populate("challengeId");

    if (submission) {
      submission.attempts += 1;
      submission.projectLink = finalProjectLink;
      submission.description = finalDescription;
      submission.feedback = "";
      submission.status = finalStatus;
      submission.medal = "none";
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

    if (finalStatus === "Approved") {
      const medal = submission.attempts === 1 ? "gold" : 
                    submission.attempts === 2 ? "silver" : "bronze";
      submission.medal = medal;
      await submission.save();

      const user = await User.findById(decoded.id);
      if (user && !user.completedChallenges.some(cc => cc.toString() === challengeId.toString())) {
        user.points += 50;
        user.completedChallenges.push(challengeId);
        if (challenge.level === user.level) {
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
});`;

c = c.replace(oldRoute, newRoute);
fs.writeFileSync('backend/routes/submissions.js', c);
console.log('Fixed backend/routes/submissions.js');
