const nodemailer = require("nodemailer");

exports.send_mail = async (recipient) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: process.env.APP_USERNAME,
        pass: process.env.APP_PASSWORD,
      },
    });

    
    const info = await transporter.sendMail({
      from: process.env.APP_USERNAME, // sender address
      to: recipient.email, // list of receivers
      subject: recipient.subject, // Subject line
      html: recipient.html, // html body
    });

    console.log("Email sent successfully to:", recipient.email);
    
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};