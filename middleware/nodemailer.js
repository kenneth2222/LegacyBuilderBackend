const nodemailer = require("nodemailer");

exports.send_mail = async (recipient) => {
<<<<<<< HEAD
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: process.env.SERVICE,
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.APP_USERNAME,
      pass: process.env.APP_PASSWORD,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
=======
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

    // async..await is not allowed in global scope, must use a wrapper
    // async function main() {
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.APP_USERNAME, // sender address
      to: recipient.email, // list of receivers
      subject: recipient.subject, // Subject line
      html: recipient.html, // html body
    });

<<<<<<< HEAD
    console.log("Message sent: ", recipient.email);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

  main().catch(console.error);

}
=======
    console.log("Email sent successfully to:", recipient.email);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    // }

    // main().catch(console.error);

    // const mailOption = {
    //   subject: options.subject, text:options.text, from:"obusco4lyfe@gmail.com", to: options.email, html:options.html
    // };
    // await transporter.sendMail(mailOption)
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
