const express = require("express");
const router = express.Router();

// Simple challenge progression-style submissions list
router.get("/", (req, res) => {
  const submissions = [
    { userId: "u1", challengeId: "c1", status: "Under Review" },
    { userId: "u2", challengeId: "c1", status: "Approved" },
  ];

  res.json(submissions);
});

module.exports = router;
