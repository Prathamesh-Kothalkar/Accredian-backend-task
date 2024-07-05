const nodemailer = require("nodemailer");

async function sendRefer(to, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "pkothalkar9021@gmail.com",
      pass: "fxrwvnnqatkntdub",
    },
  });

  const mailOptions = {
    from: {name:"Prathamesh",email:"pkothalkar9021@gmail.com"},
    to: to,
    subject: "Your Friend Referred You a Course",
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendRefer;
