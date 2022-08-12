const nodemailer = require("nodemailer");
const { transport } = require("winston");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "stayhydratedever@outlook.com",
    pass: "y4C2g8nKvsZerYV",
  },
});

module.exports = transporter;
