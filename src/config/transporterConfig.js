import nodemailer from "nodemailer";
import config from '../config/index.js';

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: config.SMTP_MAIL_HOST,
    port: config.SMTP_Mail_PORT,
    // secure: false, // true for 465, false for other ports
    auth: {
      user: config.SMTP_MAIL_USERNAME, // generated ethereal user
      pass: config.SMTP_MAIL_PASSWORD, // generated ethereal password
    },
  });

  export default transporter 