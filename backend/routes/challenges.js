const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // Temporary static challenges for frontend testing
  const challenges = [
    { title: "Intro Challenge", level: 1 },
    { title: "Intermediate Project", level: 2 },
  ];

  res.json(challenges);
});

module.exports = router;
