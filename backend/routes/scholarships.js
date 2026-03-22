const express = require("express");
const router = express.Router();

// Basic scholarship listing for tracking
router.get("/", (req, res) => {
  const scholarships = [
    { name: "HERathon Women in Tech", deadline: "2026-06-01" },
    { name: "STEM Excellence Scholarship", deadline: "2026-09-15" },
  ];

  res.json(scholarships);
});

module.exports = router;
