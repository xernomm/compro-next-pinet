import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload } from '@/lib/upload';
// @ts-ignore
import { Event } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { id } = await params;
  try {
    const event = await Event.findByPk(id);
    if (!event) return Response.json({ success: false, message: 'Event not found' }, { status: 404 });
    return Response.json({ success: true, data: event });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching event', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  const { id } = await params;
  try {
    const event = await Event.findByPk(id);
    if (!event) return Response.json({ success: false, message: 'Event not found' }, { status: 404 });
    const formData = await request.formData();
    const data: any = {};
    for (const [key, value] of formData.entries()) { if (key !== 'featured_image') data[key] = value; }
    if (!data.event_type || data.event_type === '') data.event_type = 'seminar';
    if (!data.status || data.status === '') data.status = 'upcoming';
    data.max_participants = data.max_participants ? parseInt(data.max_participants, 10) || null : null;
    if (typeof data.is_online === 'string') data.is_online = data.is_online === 'true';
    if (typeof data.is_featured === 'string') data.is_featured = data.is_featured === 'true';
    if (typeof data.is_published === 'string') data.is_published = data.is_published === 'true';
    ['start_date', 'end_date', 'start_time', 'end_time'].forEach(f => {
      if (data[f] === '' || data[f] === undefined) data[f] = null;
    });
    const imgPath = await handleFileUpload(formData, 'featured_image');
    if (imgPath) data.featured_image = imgPath;
    await event.update(data);
    return Response.json({ success: true, data: event, message: 'Event updated successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error updating event', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;
  const { id } = await params;
  try {
    const event = await Event.findByPk(id);
    if (!event) return Response.json({ success: false, message: 'Event not found' }, { status: 404 });
    await event.destroy();
    return Response.json({ success: true, message: 'Event deleted successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error deleting event', error: error.message }, { status: 500 });
  }
}
