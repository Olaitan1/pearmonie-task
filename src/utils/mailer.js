/** @format */

const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const nodemailer = require("nodemailer");

module.exports.mail = async function (mailTemp) {
  const { tempPath, name, emailAddress, subject, payUrl, username, password } =
    mailTemp;
  const emailTemplate = fs.readFileSync(
    path.join(__dirname, tempPath),
    "utf-8"
  );

  const template = handlebars.compile(emailTemplate);

  const messageBody = template({
    name,
    emailAddress,
    payUrl,
    username,
    password,
  });

  const transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    // port: "587",
    // service: "gmail",
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
    //tls:transport layer security is used to get the status of the message sent to the mail, either suuccessful or failed
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: emailAddress,
    subject,
    html: messageBody,
  };

  const isSent = await transporter.sendMail(mailOptions);
  return isSent;
};
