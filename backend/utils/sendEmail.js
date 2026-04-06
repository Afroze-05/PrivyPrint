const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `PrivyPrint <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.textMessage || "Please view this email in an HTML-enabled email client.",
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
