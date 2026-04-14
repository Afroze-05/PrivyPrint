const jwt = require("jsonwebtoken");
const User = require("../models/User");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log(" Auth Debug - Request URL:", req.originalUrl);
  console.log(" Auth Debug - Authorization header exists:", !!authHeader);
  console.log(
    " Auth Debug - Authorization header:",
    authHeader?.substring(0, 50) + "...",
  );

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Auth Debug - Missing or invalid Authorization header format");
    return res
      .status(401)
      .json({ message: "Missing or invalid Authorization header." });
  }

  const token = authHeader.split(" ")[1];
  console.log("Auth Debug - Token extracted, length:", token?.length);

  // Check if it's a test token (for dashboard testing)
  if (token.startsWith("test_admin_token_")) {
    console.log("Auth Debug - Using test token authentication");
    // For test tokens, find the test admin user
    User.findOne({ email: "testadmin@example.com", role: "admin" })
      .then((testUser) => {
        if (!testUser) {
          console.log("Auth Debug - Test admin user not found");
          return res
            .status(401)
            .json({ message: "Test admin user not found." });
        }
        console.log(" Auth Debug - Test authentication successful");
        req.user = { id: testUser._id, role: testUser.role };
        return next();
      })
      .catch((err) => {
        console.log(
          " Auth Debug - Server error during test authentication:",
          err.message,
        );
        return res
          .status(500)
          .json({ message: "Server error during test authentication." });
      });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(
      "Auth Debug - JWT verification successful, user ID:",
      decoded.id,
      "role:",
      decoded.role,
    );
    req.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch (err) {
    console.log("  Auth Debug - JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired JWT." });
  }
}

function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    console.log("🔍 Role Debug - Required roles:", allowed);
    console.log("🔍 Role Debug - User role:", req.user?.role);
    console.log("🔍 Role Debug - User exists:", !!req.user);

    if (!req.user || !allowed.includes(req.user.role)) {
      console.log(
        "Role Debug - Access forbidden. User:",
        req.user?.role,
        "Required:",
        allowed,
      );
      return res.status(403).json({ message: "Forbidden." });
    }
    console.log("Role Debug - Role check passed");
    return next();
  };
}

module.exports = { authMiddleware, requireRole };
