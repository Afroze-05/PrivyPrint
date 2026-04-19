const nodemailer = require("nodemailer");
const Alert = require("../models/Alert");
const Document = require("../models/Document");
const User = require("../models/User");
const ALERT_TYPES = ["mobile_detected", "multiple_faces"];

async function sendAlertEmail({ to, token, alertType }) {
  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_FROM,
  } = process.env;

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !EMAIL_FROM) {
    return { sent: false, reason: "Email env vars missing." };
  }
  //trasporter is the object that is configured to send mail
  //creating a email sendig system
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: String(EMAIL_SECURE).toLowerCase() === "true",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS }, //email of the sender and password of the sender email
  });

  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject: "PrivyPrint Alert Triggered",
    text: `PrivyPrint reported alert: ${alertType}\nToken: ${token}`,
  });

  return { sent: true, messageId: info.messageId };
}

async function createAlert(req, res) {
  try {
    const { type, token } = req.body;

    if (!type || !token) {
      return res.status(400).json({ message: "type and token are required." });
    }
    if (!ALERT_TYPES.includes(type)) {
      return res.status(400).json({ message: "Invalid alert type." });
    }

    // Store the alert first (required behavior).
    const alert = await Alert.create({
      type,
      token,
      timestamp: new Date(),
    });

    // Reduce admin trustScore when alert is received.
    const admin = await User.findById(req.user.id);
    let updatedTrustScore = admin?.trustScore;
    if (admin) {
      const dec = Number(process.env.TRUST_SCORE_DECREMENT) || 10;
      admin.trustScore = Math.max(0, admin.trustScore - dec);
      await admin.save();
      updatedTrustScore = admin.trustScore;
    }

    // Send email to customer if we can resolve the document's customer.
    let emailResult = { sent: false, reason: "No matching document/user." };
    const doc = await Document.findOne({ token }).populate(
      "userId",
      "email name",
    );
    if (doc?.userId?.email) {
      emailResult = await sendAlertEmail({
        to: doc.userId.email,
        token,
        alertType: type,
      });
    }

    return res.status(201).json({
      message: "Alert stored.",
      alert: {
        id: alert._id,
        type: alert.type,
        token: alert.token,
        timestamp: alert.timestamp,
      },
      emailSent: emailResult.sent,
      emailMessageId: emailResult.messageId,
      trustScore: updatedTrustScore,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to store alert.", error: err.message });
  }
}

module.exports = { createAlert };
