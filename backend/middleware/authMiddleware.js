const jwt = require("jsonwebtoken");
const User = require("../models/User");


const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      

      return next(); // ✅ Successful path ends here
    } catch (error) {
      console.error("🔐 JWT Error:", error.message);
      return res.status(401).json({ message: "Token failed" }); // ✅ Make sure to return here
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" }); // ✅ Always return
};


// Admin-only route check
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};
const coordinatorOnly = (req, res, next) => {
  if (req.user && req.user.role === "coordinator") {
    next();
  } else {
    return res.status(403).json({ message: "Coordinator access only" });
  }
};


const residentOnly = (req, res, next) => {
  if (req.user && req.user.role === "resident") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Resident only" });
  }
};




module.exports = { protect, adminOnly,coordinatorOnly, residentOnly };
