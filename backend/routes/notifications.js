const express = require("express");
const router = express.Router();

// Basic in-memory notifications placeholder
router.get("/", (req, res) => {
  const notifications = [
    { id: 1, message: "Welcome to HERathon!", type: "info" },
    { id: 2, message: "New challenge available.", type: "reminder" },
  ];

  res.json(notifications);
});

module.exports = router;

