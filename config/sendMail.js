import nodemailer from "nodemailer";

export const sendMail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = async () => {
      await transporter.sendMail({
        from: '"Dev Collab" <customersupport@devcollab.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    };

    mailOptions();

    console.log("Password reset email sent")
  } catch (error) {
    console.log("Send mail error:", error);
  }
};
