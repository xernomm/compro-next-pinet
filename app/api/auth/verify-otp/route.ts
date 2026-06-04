import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { initDB } from '@/lib/db';
// @ts-ignore
import { User } from '@/lib/models/index';

interface OTPPayload {
  id: number;
  purpose: string;
}

const JWT_SESSION_EXPIRE = '1h'; // 1 hour session

export async function POST(request: NextRequest) {
  await initDB();
  try {
    const { tempToken, otp } = await request.json();

    if (!tempToken || !otp) {
      return Response.json(
        { success: false, message: 'Please provide both the verification code and session token.' },
        { status: 400 }
      );
    }

    let decoded: OTPPayload;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'secret') as OTPPayload;
    } catch (err) {
      return Response.json(
        { success: false, message: 'Session has expired. Please request a new OTP.' },
        { status: 401 }
      );
    }

    if (decoded.purpose !== 'otp_verification') {
      return Response.json(
        { success: false, message: 'Invalid session token.' },
        { status: 400 }
      );
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    if (!user.is_active) {
      return Response.json(
        { success: false, message: 'Account has been deactivated.' },
        { status: 401 }
      );
    }

    // Verify OTP code and expiration
    if (!user.otp_code || user.otp_code !== otp) {
      return Response.json(
        { success: false, message: 'The verification code is invalid.' },
        { status: 400 }
      );
    }

    const now = new Date();
    if (!user.otp_expires_at || new Date(user.otp_expires_at) < now) {
      return Response.json(
        { success: false, message: 'The verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // OTP is valid — clear OTP columns, update last_login
    await user.update({
      otp_code: null,
      otp_expires_at: null,
      last_login: new Date(),
    });

    // Issue JWT session token — 1 hour only
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: JWT_SESSION_EXPIRE }
    );

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
      expiresIn: JWT_SESSION_EXPIRE,
    });
  } catch (error: any) {
    console.error('OTP verification error:', error);
    return Response.json(
      { success: false, message: 'Error verifying OTP.', error: error.message },
      { status: 500 }
    );
  }
}
