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
    const { current_password, new_password } = await request.json();

    if (!current_password || !new_password) {
      return Response.json(
        { success: false, message: 'Please provide current and new password' },
        { status: 400 }
      );
    }

    const currentUser = await User.findByPk(user.id);
    const isPasswordValid = await currentUser.comparePassword(current_password);

    if (!isPasswordValid) {
      return Response.json(
        { success: false, message: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    await currentUser.update({ password: new_password });

    return Response.json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    return Response.json(
      { success: false, message: 'Error changing password', error: error.message },
      { status: 500 }
    );
  }
}
