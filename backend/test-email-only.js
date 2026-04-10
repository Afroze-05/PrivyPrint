require('dotenv').config();
const nodemailer = require("nodemailer");

async function testEmailOnly() {
  console.log("🧪 Testing email sending only...");
  
  const {
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_FROM
  } = process.env;

  console.log("🔧 Email config check:", {
    EMAIL_USER: !!EMAIL_USER,
    EMAIL_PASS: !!EMAIL_PASS,
    EMAIL_FROM: !!EMAIL_FROM
  });

  if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_FROM) {
    console.log("❌ Email environment variables missing");
    return;
  }

  console.log("🚀 Creating email transporter...");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  const mailOptions = {
    from: `PrivyPrint <${EMAIL_FROM}>`,
    to: "test@example.com",
    subject: "⚠️ Test Suspicious Activity Detected",
    text: `
Suspicious Activity Detected

Type: tab_switch_detected
Time: ${new Date().toLocaleString()}
Token: TEST-12345

If this was not you, please re-upload your document.
`
  };

  console.log("📨 Sending test email...");

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully! MessageId:", info.messageId);
    console.log("📧 Email details:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    console.error("Error details:", error.message);
  }
}

testEmailOnly();
