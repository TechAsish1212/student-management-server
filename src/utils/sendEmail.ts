import nodemailer from "nodemailer";



export const sendEmail = async (
  email: string,
  subject: string,
  message: string,
  html: string,
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : undefined,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  } as nodemailer.TransportOptions);

  

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject,
    text: message,
    html,
  };

  await transporter.sendMail(mailOptions);
};
