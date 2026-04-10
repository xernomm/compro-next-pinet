import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { initDB } from '@/lib/db';
// @ts-ignore
import { User } from '@/lib/models/index';

export async function GET(request: NextRequest) {
  await initDB();
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const fullUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
    });

    return Response.json({ success: true, data: fullUser });
  } catch (error: any) {
    return Response.json(
      { success: false, message: 'Error fetching user', error: error.message },
      { status: 500 }
    );
  }
}
