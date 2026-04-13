/**
 * Alert Controller - Security Alert Management
 * 
 * Handles security alerts for the PrivyPrint system including:
 * - Mobile phone detection alerts
 * - Multiple face detection alerts
 * - Email notifications for security violations
 * - Alert logging and tracking
 * 
 * @author PrivyPrint Team
 * @version 1.2.0
 */

const nodemailer = require("nodemailer");

const Alert = require("../models/Alert");
const Document = require("../models/Document");
const User = require("../models/User");

// Supported alert types for security monitoring
const ALERT_TYPES = ["mobile_detected", "multiple_faces"];

// Alert severity levels for categorization
const ALERT_SEVERITY = {
  mobile_detected: "HIGH",
  multiple_faces: "MEDIUM"
};

/**
 * Sends email notification for security alerts
 * 
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.token - Associated print token
 * @param {string} params.alertType - Type of alert triggered
 * @returns {Promise<Object>} Email sending result
 * @returns {boolean} returns.sent - Whether email was sent successfully
 * @returns {string} returns.messageId - Email message ID if sent
 * @returns {string} returns.reason - Reason for failure if not sent
 */
async function sendAlertEmail({ to, token, alertType }) {
  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_FROM,
  } = process.env;

  // Input validation
  if (!to || !token || !alertType) {
    return { sent: false, reason: "Missing required parameters: to, token, alertType" };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    return { sent: false, reason: "Invalid email format" };
  }

  // Alert type validation
  if (!ALERT_TYPES.includes(alertType)) {
    return { sent: false, reason: `Invalid alert type: ${alertType}` };
  }

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !EMAIL_FROM) {
    // Keep the API functional even if email isn't configured.
    return { sent: false, reason: "Email environment variables not configured" };
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: String(EMAIL_SECURE).toLowerCase() === "true",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject: "PrivyPrint Security Alert",
      text: `Security alert triggered: ${alertType}\nToken: ${token}\nSeverity: ${ALERT_SEVERITY[alertType] || 'UNKNOWN'}\nTimestamp: ${new Date().toISOString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">PrivyPrint Security Alert</h2>
          <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Alert Type:</strong> ${alertType}</p>
            <p><strong>Severity:</strong> ${ALERT_SEVERITY[alertType] || 'UNKNOWN'}</p>
            <p><strong>Token:</strong> ${token}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          </div>
          <p style="color: #6b7280;">This is an automated security alert from PrivyPrint.</p>
        </div>
      `
    });

    console.log(`Security alert email sent successfully to ${to}`, {
      messageId: info.messageId,
      alertType,
      token: token.substring(0, 8) + '...'
    });

    return { sent: true, messageId: info.messageId };
  } catch (emailError) {
    console.error('Failed to send security alert email:', {
      error: emailError.message,
      to,
      alertType,
      token: token.substring(0, 8) + '...'
    });
    return { sent: false, reason: `Email sending failed: ${emailError.message}` };
  }
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
    const doc = await Document.findOne({ token }).populate("userId", "email name");
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
    return res.status(500).json({ message: "Failed to store alert.", error: err.message });
  }
}

module.exports = { createAlert };

