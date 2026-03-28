const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Health check for auth routes
router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Auth service healthy" });
});

// Register: create user with role (student or mentor)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields (name, email, password, role) are required",
      });
    }

    if (!["student", "mentor"].includes(role)) {
      return res.status(400).json({
        message: "Role must be student or mentor",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({
      message: "Server error during registration",
      error: err.message,
    });
  }
});

// Login: return JWT with role so frontend can decide dashboard access
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).populate("completedChallenges");
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const payload = {
      id: user._id,
      role: user.role,
      name: user.name,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        level: user.level,
        points: user.points,
        badges: user.badges || [],
        skills: user.skills || "",
        completedChallenges: user.completedChallenges || []
      },
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({
      message: "Server error during login",
      error: err.message,
    });
  }
});

// GET /auth/me - Fetch authenticated user profile + gamification data
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const user = await User.findById(decoded.id).populate("completedChallenges");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        level: user.level,
        points: user.points,
        badges: user.badges || [],
        skills: user.skills || "",
        completedChallenges: user.completedChallenges || [],
        courses: user.courses || [],
        topics: user.topics || [],
        firstName: user.firstName,
        lastName: user.lastName,
        school: user.school,
        bio: user.bio,
        picture: user.picture,
        certificates: user.certificates || []
      },
      hasTopics: (user.topics || []).length > 0
    });
  } catch (err) {
    console.error("Auth me error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
