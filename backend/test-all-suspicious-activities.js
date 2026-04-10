require('dotenv').config();

const nodemailer = require("nodemailer");

// Test all suspicious activity types
const ALERT_TYPES = [
  "mobile_detected", 
  "multiple_faces",
  "tab_switch_detected",
  "copy_action_detected", 
  "paste_action_detected",
  "right_click_attempt",
  "phone_detected_near_screen"
];

async function testAllSuspiciousActivities() {
  console.log(" Testing all suspicious activity types...");
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { 
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    },
  });

  const formatAlertType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  for (const alertType of ALERT_TYPES) {
    console.log(`\n Testing: ${alertType}`);
    
    const mailOptions = {
      from: `PrivyPrint <${process.env.EMAIL_FROM}>`,
      to: "dikshadhanve4@gmail.com",
      subject: ` Test Suspicious Activity: ${formatAlertType(alertType)}`,
      text: `
Suspicious Activity Detected

Type: ${formatAlertType(alertType)}
Time: ${new Date().toLocaleString()}
Token: TEST-${alertType.toUpperCase()}

If this was not you, please re-upload your document.
`
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(` Email sent successfully! MessageId: ${info.messageId}`);
    } catch (error) {
      console.error(` Email sending failed: ${error.message}`);
    }
  }
  
  console.log("\n All suspicious activity tests completed!");
}

testAllSuspiciousActivities();
