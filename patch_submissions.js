const fs = require('fs');
const content = fs.readFileSync('backend/routes/submissions.js', 'utf8');

const postRoute = 
// @route   POST /submissions
// @desc    Submit a project or challenge solution
router.post("/", auth, async (req, res) => {
  try {
    const { challengeId, isSimple, answer, projectLink, description } = req.body;

    const submission = new Submission({
      userId: req.user.id,
      challengeId,
      projectLink: projectLink || "",
      description: isSimple ? answer : description,
      status: "Under Review"
    });
    
    await submission.save();
    res.json({ message: "Submission successful!", submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

;

const newContent = content.replace('module.exports = router;', postRoute + 'module.exports = router;');
fs.writeFileSync('backend/routes/submissions.js', newContent);
