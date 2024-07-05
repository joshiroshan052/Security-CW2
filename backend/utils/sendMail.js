const nodemailer = require("nodemailer");

async function SendMail(email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });

  await transporter.sendMail({
    from: `"GamerConnect" <${process.env.email}>`,
    to: email,
    subject: "Suspicious Login Activity",
    html: `
      <p>Dear User,</p>
      <p>There have been multiple failed login attempts on your account. 
      Your account has been locked for 15 minutes as a security measure.</p>
      <p>If this was not you, please reset your password immediately.</p>
      <p>Best regards,<br/>GamerConnect Team</p>
    `,
  });
}

module.exports = { SendMail };
