import nodemailer from 'nodemailer';

// Make sure the name matches EXACTLY what you import in the controller
export const sendVerificationEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Nova AI Terminal" <auth@nova.ai>',
      to: email,
      subject: "Your Access Verification Code",
      html: `
        <div style="background-color: #020617; color: white; padding: 40px; font-family: sans-serif; border-radius: 20px;">
          <h1 style="color: #6366f1;">Verification Code</h1>
          <p style="font-size: 16px;">Enter this code to authorize your terminal access:</p>
          <div style="background: #1e1b4b; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 10px; text-align: center; border-radius: 10px; border: 1px solid #4f46e5;">
            ${otp}
          </div>
          <p style="margin-top: 20px; color: #94a3b8;">This code expires in 15 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent: " + info.response);
  } catch (error) {
    console.error("❌ Email Error: ", error);
    throw new Error("Failed to send verification email.");
  }
};