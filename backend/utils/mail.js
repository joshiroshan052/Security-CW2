const nodemailer = require("nodemailer");
const path = require("path");

async function SendMail(link, email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.email}`,
      pass: `${process.env.password}`,
    },
    from: `${process.env.email}`,
  });

  await transporter.sendMail({
    from: "GamerConnect",
    to: [`${email}`],
    subject: "Reset Password Link",
    text: "",
    html: `
    <div style="width:100%;">
        <img 
            style="margin-left:-105px;padding-top:18px;width:150px" 
            src="cid:unique@logo" 
            alt="logo" 
            onerror="this.style.display='none';"
            oncontextmenu="return false;"
            draggable="false"
        />
        <p style="margin-left:25px;">Hi ,</p>
        <p style="margin-left:25px;">
            Reset your password of <span style="font-weight:bold">GamerConnect</span> using this link
            <a href="${link}" style="margin-left:4.5px;">Click here.</a>
            <br/>Link only valid for 24 hours
        </p>
    </div>
`,
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../assets/images/logo.png"),
        cid: "unique@logo",
      },
    ],
  });
}
module.exports = { SendMail };
