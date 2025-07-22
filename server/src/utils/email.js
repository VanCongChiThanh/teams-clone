import nodemailer from "nodemailer";

export const sendVerificationEmail = async (to, url) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Teams Clone <${process.env.EMAIL_USER}>`,
    to,
    subject: "Xác minh tài khoản Teams Clone",
    html: `<p>Nhấn vào link bên dưới để xác minh email:</p>
               <a href="${url}">${url}</a>`,
  };

  await transporter.sendMail(mailOptions);
};
