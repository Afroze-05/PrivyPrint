const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Helper function to parse user agent string for device information
function parseUserAgent(userAgent) {
  const ua = userAgent.toLowerCase();
  
  // Detect browser
  let browser = 'Unknown';
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  // Detect OS
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  // Detect device type
  let deviceType = 'Desktop';
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    deviceType = 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    deviceType = 'Tablet';
  }
  
  return {
    browser,
    os,
    deviceType,
    userAgent: userAgent
  };
}

// Helper to sign JWT
function signJWT(user) {
  const payload = { id: user._id.toString(), role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    //.sign()method to generate the token. It returns token as a string
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// 1. SIGNUP: Generates OTP and hashes password
async function signup(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //“One or more characters that are NOT space and NOT @”
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Email already registered to PrivyPrint." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Ensure OTP is exactly 6 digits
    if (otp.length !== 6) {
      console.error("Generated OTP is not 6 digits:", otp);
      return res.status(500).json({ message: "OTP generation failed" });
    }

    console.log("Generated 6-digit OTP:", otp);
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: passwordHash,
      role: role || "customer",
      trustScore: 100,
      otp,
      otpExpires,
      isVerified: false,
    });

    try {
      await sendEmail({
        email: user.email,
        subject: "PrivyPrint, Verify your account",
        message: `Your verification code is: ${otp}. It expires in 10 minutes.`,
      });
      return res.status(201).json({ message: "OTP sent to email." });
    } catch (mailErr) {
      return res
        .status(500)
        .json({ message: "User created but email failed to send." });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Signup failed.", error: err.message });
  }
}

// 2. VERIFY OTP: The core logic for checking the code
async function verifyOTP(req, res) {
  const { email, otp } = req.body;

  try {
    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Validate OTP format (must be exactly 6 digits)
    if (!/^[0-9]{6}$/.test(otp.toString().trim())) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP format. OTP must be exactly 6 digits.",
      });
    }

    console.log("Verifying OTP:", { email, otp });

    // Normalizing input to match signup storage
    const normalizedEmail = email?.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(404).json({ message: "User not found" });

    // A. Check for expiration
    if (user.otpExpires && user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please signup again." });
    }

    // B. Strict OTP validation - check if code matches exactly
    const storedOtp = user.otp?.toString();
    const enteredOtp = otp?.toString().trim();

    if (storedOtp !== enteredOtp) {
      console.log("OTP mismatch:", {
        stored: storedOtp,
        entered: enteredOtp,
      });
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP",
      });
    }

    console.log("OTP verification successful");

    // C. Update User Status
    user.isVerified = true;
    user.otp = undefined; // Clear the code so it can't be reused
    user.otpExpires = undefined;
    await user.save();

    // D. Generate JWT token for automatic login after verification
    const token = signJWT(user);

    res.status(200).json({
      success: true,
      message: "Verification successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        trustScore: user.trustScore,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Verification error.", error: err.message });
  }
}

// 3. LOGIN: Checking for isVerified status
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Verify account status
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account not verified. Please check your email for the OTP.",
        notVerified: true,
      });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signJWT(user);

    // Extract device and session information
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'Unknown';
    
    // Parse user agent for device info
    const deviceInfo = parseUserAgent(userAgent);
    
    // Update user's last login
    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
      lastLoginIP: ip,
      lastLoginDevice: deviceInfo,
      isOnline: true
    });

    // Emit real-time login success event
    if (global.emitToUser && user._id) {
      global.emitToUser(user._id, 'login:success', {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          trustScore: user.trustScore,
          isOnline: true,
          lastLogin: new Date()
        },
        session: {
          loginTime: new Date(),
          status: 'active',
          device: deviceInfo,
          ip: ip,
          userAgent: userAgent
        },
        timestamp: new Date()
      });

      // Emit session update event
      global.emitToUser(user._id, 'session:update', {
        status: 'active',
        loginTime: new Date(),
        device: deviceInfo,
        ip: ip,
        lastActivity: new Date()
      });

      console.log(`Real-time events emitted: login:success + session:update for user ${user._id}`);
    }

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        trustScore: user.trustScore,
        isOnline: true,
        lastLogin: new Date()
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Login failed.", error: err.message });
  }
}

// 4. VERIFY TOKEN: Check if JWT token is valid and return user info
async function verifyToken(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required." });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //it is a buit in function for verifying the token. It returns the decoded payload if the token is valid, otherwise it throws an error.

    // Find user by ID from token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token -> user not found." });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account not verified. Please check your email for the OTP.",
        notVerified: true,
      });
    }

    // Return user data (excluding password)
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        trustScore: user.trustScore,
      },
    });
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    return res
      .status(500)
      .json({ message: "Token verification failed.", error: err.message });
  }
}

// 5. UPDATE PROFILE: Update user profile with real-time socket emission
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ message: "At least name or email must be provided." });
    }

    // Find user and update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return res.status(409).json({ message: "Email already registered." });
      }
    }

    // Update user profile
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase().trim();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    // Emit real-time profile update event
    if (global.emitToUser && userId) {
      global.emitToUser(userId, 'profile:update', {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          trustScore: updatedUser.trustScore,
          isVerified: updatedUser.isVerified,
          updatedAt: updatedUser.updatedAt
        },
        timestamp: new Date()
      });

      // Emit user data updated event for broader updates
      global.emitToUser(userId, 'user:data_updated', {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          trustScore: updatedUser.trustScore,
          isVerified: updatedUser.isVerified
        }
      });

      // Emit notification for profile update
      global.emitToUser(userId, 'notification:new', {
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated',
        timestamp: new Date()
      });

      console.log(`Real-time events emitted: profile:update + user:data_updated + notification:new for user ${userId}`);
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        trustScore: updatedUser.trustScore,
        isVerified: updatedUser.isVerified,
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (err) {
    console.error("Profile update error:", err);
    return res.status(500).json({ 
      message: "Profile update failed.", 
      error: err.message 
    });
  }
}

// 6. LOGOUT: Handle user logout with real-time socket emission
async function logout(req, res) {
  try {
    const userId = req.user.id;
    
    // Update user's online status and logout time
    await User.findByIdAndUpdate(userId, {
      isOnline: false,
      lastLogout: new Date()
    });

    // Emit real-time logout event
    if (global.emitToUser && userId) {
      global.emitToUser(userId, 'logout:event', {
        user: {
          id: userId,
          isOnline: false,
          lastLogout: new Date()
        },
        session: {
          status: 'inactive',
          logoutTime: new Date(),
          lastActivity: new Date()
        },
        timestamp: new Date()
      });

      // Emit session update event
      global.emitToUser(userId, 'session:update', {
        status: 'inactive',
        logoutTime: new Date(),
        lastActivity: new Date()
      });

      console.log(`Real-time events emitted: logout:event + session:update for user ${userId}`);
    }

    return res.status(200).json({
      message: "Logout successful.",
      timestamp: new Date()
    });

  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ 
      message: "Logout failed.", 
      error: err.message 
    });
  }
}

// 7. DEV ONLY: Clear users
const deleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.status(200).json({
      message: "Success! All users have been cleared.",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting users", error: err.message });
  }
};

module.exports = { signup, login, verifyOTP, verifyToken, updateProfile, logout, deleteAllUsers };
