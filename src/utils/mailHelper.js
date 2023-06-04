import transporter from "../config/transporterConfig.js";
import config from "../config/index.js";

// send mail with defined transport object
// options is an json object type
const mailHelper = async (options)=>{
    const message={
      from: config.SMTP_SENDER_EMAIL, // sender address
      to: options.to, // list of receivers
      subject: options.subject, // Subject line
      text: options.text, // plain text body
      html: "<b>Hello world?</b>", // html body
    }

    await transporter.sendMail(message)
};

export default mailHelper