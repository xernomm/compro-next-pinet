import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
// @ts-ignore
import { Career } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { id } = await params;
  try {
    const career = await Career.findByPk(id);
    if (!career) return Response.json({ success: false, message: 'Career not found' }, { status: 404 });
    await career.increment('views');
    return Response.json({ success: true, data: career });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching career', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  const { id } = await params;
  try {
    const career = await Career.findByPk(id);
    if (!career) return Response.json({ success: false, message: 'Career not found' }, { status: 404 });
    const body = await request.json();
    if (!body.employment_type || body.employment_type === '') body.employment_type = 'full_time';
    if (!body.status || body.status === '') body.status = 'open';
    if (body.experience_level === '') body.experience_level = null;
    body.views = parseInt(body.views, 10) || 0;
    if (typeof body.is_featured === 'string') body.is_featured = body.is_featured === 'true';
    if (typeof body.is_active === 'string') body.is_active = body.is_active === 'true';
    if (body.application_deadline === '' || body.application_deadline === undefined) body.application_deadline = null;
    await career.update(body);
    return Response.json({ success: true, data: career, message: 'Career updated successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error updating career', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;
  const { id } = await params;
  try {
    const career = await Career.findByPk(id);
    if (!career) return Response.json({ success: false, message: 'Career not found' }, { status: 404 });
    await career.destroy();
    return Response.json({ success: true, message: 'Career deleted successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error deleting career', error: error.message }, { status: 500 });
  }
}
