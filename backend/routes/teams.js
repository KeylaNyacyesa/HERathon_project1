const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const teams = [
    { name: "Team Alpha", members: 4 },
    { name: "Team Beta", members: 3 },
  ];

  res.json(teams);
});

module.exports = router;