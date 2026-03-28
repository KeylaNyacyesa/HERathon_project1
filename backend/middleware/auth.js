const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function(req, res, next) {
  // Get token from header
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "herathon_secret");
    
    // We fetch user from database to ensure fresh role and state
    const user = await User.findById(decoded.user.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Token is valid but user no longer exists" });
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (err) {
    res.status(403).json({ message: "Token is not valid" });
  }
};
