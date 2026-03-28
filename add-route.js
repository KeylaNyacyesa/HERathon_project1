const fs = require('fs'); 
let content = fs.readFileSync('backend/routes/mentors.js', 'utf8'); 
const route = \
// PUT /request/:id/status - Update mentorship request status
router.put('/request/:id/status', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const { status } = req.body;

    const mentorship = await Mentorship.findById(req.params.id);
    if (!mentorship) return res.status(404).json({ message: 'Request not found' });

    // Ensure the user updating it is the assigned mentor
    if (mentorship.mentorId.toString() !== decoded.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    mentorship.status = status;
    await mentorship.save();
    res.json(mentorship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
\;
content = content.replace('module.exports = router;', route + '\nmodule.exports = router;'); 
fs.writeFileSync('backend/routes/mentors.js', content);
