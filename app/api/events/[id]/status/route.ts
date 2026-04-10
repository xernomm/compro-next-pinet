import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
// @ts-ignore
import { Event } from '@/lib/models/index';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;
  const { id } = await params;
  try {
    const { status } = await request.json();
    const event = await Event.findByPk(id);
    if (!event) return Response.json({ success: false, message: 'Event not found' }, { status: 404 });
    await event.update({ status });
    return Response.json({ success: true, data: event, message: 'Event status updated successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error updating event status', error: error.message }, { status: 500 });
  }
}
