import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { initDB } from '@/lib/db';
import { generateToken } from '@/lib/auth';
// @ts-ignore
import { User } from '@/lib/models/index';

export async function POST(request: NextRequest) {
  await initDB();
  try {
    const { username, email, password, full_name, role } = await request.json();

    if (!username || !email || !password || !full_name) {
      return Response.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const userExists = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });

    if (userExists) {
      return Response.json({ success: false, message: 'User already exists' }, { status: 400 });
    }

    const user = await User.create({
      username,
      email,
      password,
      full_name,
      role: role || 'editor',
    });

    const token = generateToken(user.id);

    return Response.json(
      {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return Response.json(
        {
          success: false,
          message: 'Unique constraint error',
          fields: error.errors.map((e: any) => ({ field: e.path, message: e.message })),
        },
        { status: 400 }
      );
    }
    return Response.json(
      { success: false, message: 'Error creating user', error: error.message },
      { status: 500 }
    );
  }
}
