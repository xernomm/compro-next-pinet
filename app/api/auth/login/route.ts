import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import { initDB } from '@/lib/db';
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
