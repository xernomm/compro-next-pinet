import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import { initDB } from '@/lib/db';
import { sendOTPEmail } from '@/lib/email';
// @ts-ignore
import { User } from '@/lib/models/index';

export async function POST(request: NextRequest) {
  await initDB();
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json(
        { success: false, message: 'Please provide your email or username.' },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      where: { [Op.or]: [{ email }, { username: email }] },
    });

    if (!user) {
      return Response.json(
        { success: false, message: 'No admin account found with that email.' },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return Response.json(
        { success: false, message: 'Account is deactivated.' },
        { status: 401 }
      );
    }

    if (user.role !== 'super_admin' && user.role !== 'admin') {
      return Response.json(
        { success: false, message: 'Access denied. Admin accounts only.' },
        { status: 403 }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    await user.update({
      otp_code: otpCode,
      otp_expires_at: otpExpiresAt,
    });

    // Send OTP to admin email(s)
    const adminEmailsStr = process.env.ADMIN_OTP_EMAILS || user.email;
    const adminEmails = adminEmailsStr.split(',').map((e: string) => e.trim()).filter(Boolean);

    const emailResult = await sendOTPEmail(adminEmails, otpCode, user.username);

    // Temporary token only for OTP verification (5 min)
    const tempToken = jwt.sign(
      { id: user.id, purpose: 'otp_verification' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '5m' }
    );

    return Response.json({
      success: true,
      requireOTP: true,
      tempToken,
      message: 'Verification code sent to administrator email.',
      emailStatus: emailResult.success ? 'sent' : 'failed',
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return Response.json(
      { success: false, message: 'Error processing login request.', error: error.message },
      { status: 500 }
    );
  }
}
