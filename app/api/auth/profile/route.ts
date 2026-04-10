import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { initDB } from '@/lib/db';
// @ts-ignore
import { User } from '@/lib/models/index';

export async function PUT(request: NextRequest) {
  await initDB();
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { full_name, email, username } = await request.json();
    const currentUser = await User.findByPk(user.id);

    if (email && email !== currentUser.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return Response.json({ success: false, message: 'Email already in use' }, { status: 400 });
      }
    }

    if (username && username !== currentUser.username) {
      const usernameExists = await User.findOne({ where: { username } });
      if (usernameExists) {
        return Response.json(
          { success: false, message: 'Username already in use' },
          { status: 400 }
        );
      }
    }

    await currentUser.update({ full_name, email, username });

    return Response.json({
      success: true,
      data: {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        full_name: currentUser.full_name,
        role: currentUser.role,
      },
    });
  } catch (error: any) {
    return Response.json(
      { success: false, message: 'Error updating profile', error: error.message },
      { status: 500 }
    );
  }
}
