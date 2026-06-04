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
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { success: false, message: 'Please provide email/username and password' },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      where: { [Op.or]: [{ email }, { username: email }] },
    });

    if (!user) {
      return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.is_active) {
      return Response.json({ success: false, message: 'Account is deactivated' }, { status: 401 });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // OTP security flow for administrative roles
    if (user.role === 'super_admin' || user.role === 'admin') {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

      await user.update({
        otp_code: otpCode,
        otp_expires_at: otpExpiresAt,
      });

      const adminEmailsStr = process.env.ADMIN_OTP_EMAILS || user.email;
      const adminEmails = adminEmailsStr.split(',').map(e => e.trim()).filter(Boolean);

      const emailResult = await sendOTPEmail(adminEmails, otpCode, user.username);

      const tempToken = jwt.sign(
        { id: user.id, purpose: 'otp_verification' },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '5m' }
      );

      return Response.json({
        success: true,
        requireOTP: true,
        tempToken,
        message: 'Verification OTP sent to administrator email(s).',
        emailStatus: emailResult.success ? 'sent' : 'failed',
      });
    }

    // Standard user login (e.g. editor) bypasses OTP if user requested it only for admin
    await user.update({ last_login: new Date() });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });

    return Response.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    return Response.json(
      { success: false, message: 'Error logging in', error: error.message },
      { status: 500 }
    );
  }
}
