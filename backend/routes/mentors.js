const express = require("express");
const router = express.Router();

// Basic mentorship listing for now
router.get("/", (req, res) => {
  const mentors = [
    { name: "Alice", expertise: "Web Development" },
    { name: "Bob", expertise: "Data Science" },
  ];

  res.json(mentors);
});

module.exports = router;

