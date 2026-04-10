import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
// @ts-ignore
import { Career } from '@/lib/models/index';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;
  const { id } = await params;
  try {
    const { status } = await request.json();
    const career = await Career.findByPk(id);
    if (!career) return Response.json({ success: false, message: 'Career not found' }, { status: 404 });
    await career.update({ status });
    return Response.json({ success: true, data: career, message: 'Career status updated successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error updating career status', error: error.message }, { status: 500 });
  }
}
