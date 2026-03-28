// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const User = require("../models/User");

// function signJWT(user) {
//   const payload = { id: user._id.toString(), role: user.role };
//   return jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//   });
// }

// async function signup(req, res) {
//   try {
//     const { name, email, password, role } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "name, email, and password are required." });
//     }

//     const normalizedRole = role || "customer";
//     if (!["admin", "customer"].includes(normalizedRole)) {
//       return res.status(400).json({ message: "role must be 'admin' or 'customer'." });
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email format." });
//     }

//     const existing = await User.findOne({ email: email.toLowerCase().trim() });
//     if (existing) {
//       return res.status(409).json({ message: "Email already registered." });
//     }

//     const saltRounds = 10;
//     const passwordHash = await bcrypt.hash(password, saltRounds);

//     const user = await User.create({
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       password: passwordHash,
//       role: normalizedRole,
//       trustScore: 100,
//     });

//     return res.status(201).json({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       trustScore: user.trustScore,
//     });
//   } catch (err) {
//     return res.status(500).json({ message: "Signup failed.", error: err.message });
//   }
// }

// async function login(req, res) {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "email and password are required." });
//     }

//     const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password." });
//     }

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) {
//       return res.status(401).json({ message: "Invalid email or password." });
//     }

//     const token = signJWT(user);

//     return res.status(200).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         trustScore: user.trustScore,
//       },
//     });
//   } catch (err) {
//     return res.status(500).json({ message: "Login failed.", error: err.message });
//   }
// }

// module.exports = { signup, login };
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Helper to sign JWT
function signJWT(user) {
  const payload = { id: user._id.toString(), role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
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
        subject: "PrivyPrint - Verify your account",
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

    // B. Check if code matches (using .trim() to handle accidental spaces)
    if (user.otp !== otp?.toString().trim()) {
      return res.status(400).json({ message: "Invalid Code" });
    }

    // C. Update User Status
    user.isVerified = true;
    user.otp = undefined; // Clear the code so it can't be reused
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Verification successful!" });
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

    return res.status(200).json({
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
    return res
      .status(500)
      .json({ message: "Login failed.", error: err.message });
  }
}

// 4. DEV ONLY: Clear users
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

// Exporting using CommonJS to match your require statements
module.exports = { signup, login, verifyOTP, deleteAllUsers };
