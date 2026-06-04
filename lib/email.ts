import nodemailer from 'nodemailer';

export async function sendOTPEmail(emails: string[], otpCode: string, username: string) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true';
  const from = process.env.SMTP_FROM || '"PINET Admin" <no-reply@pinet.co.id>';

  console.log(`[OTP Verification] Generated OTP ${otpCode} for user "${username}"`);

  // Fallback to console if SMTP configuration is incomplete
  if (!host || !user || !pass) {
    console.warn('[OTP Verification] SMTP credentials not fully configured. Code output to console only.');
    return {
      success: true,
      message: 'SMTP not configured. OTP printed to server console.',
      sentConsole: true
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from,
      to: emails.join(', '),
      subject: 'PINET Admin Portal - Login Verification Code',
      html: `
        <div style="font-family: 'Space Grotesk', 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #0b0b0f; border: 1px solid #1f1f2e; border-radius: 16px; color: #ffffff;">
          <h2 style="font-size: 24px; color: #ff2d2d; border-bottom: 2px solid #ff2d2d; padding-bottom: 15px; margin-top: 0; text-transform: uppercase; letter-spacing: 0.05em;">
            // Verification Code
          </h2>
          <p style="font-size: 16px; color: #c0c0c0; line-height: 1.6;">
            A login request was made for the PINET Admin account: <strong>${username}</strong>.
          </p>
          <p style="font-size: 16px; color: #c0c0c0; line-height: 1.6;">
            Please use the 6-digit OTP verification code below to authorize this session. This code is valid for 5 minutes.
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <span style="display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 38px; font-weight: bold; color: #ffffff; letter-spacing: 0.2em; background-color: #1a0808; border: 1px solid rgba(255, 45, 45, 0.3); padding: 15px 30px; border-radius: 8px; box-shadow: 0 0 20px rgba(255, 45, 45, 0.15);">
              ${otpCode}
            </span>
          </div>
          <p style="font-size: 14px; color: #707080; border-top: 1px solid #1f1f2e; padding-top: 20px; margin-bottom: 0;">
            If you did not initiate this login request, please change your password immediately.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[OTP Verification] Email sent successfully to ${emails.join(', ')}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    const err = error as Error;
    console.error('[OTP Verification] Failed to send SMTP email:', err);
    return { success: false, error: err.message };
  }
}
