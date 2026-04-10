import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload } from '@/lib/upload';
// @ts-ignore
import { Event } from '@/lib/models/index';

export async function GET(request: NextRequest) {
  await initDB();
  try {
    const { searchParams } = new URL(request.url);
    const where: any = {};
    const is_published = searchParams.get('is_published');
    const is_featured = searchParams.get('is_featured');
    const event_type = searchParams.get('event_type');
    const status = searchParams.get('status');
    const is_online = searchParams.get('is_online');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    if (is_published !== null) where.is_published = is_published === 'true';
    if (is_featured !== null) where.is_featured = is_featured === 'true';
    if (event_type) where.event_type = event_type;
    if (status) where.status = status;
    if (is_online !== null) where.is_online = is_online === 'true';
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
      ];
    }
    const offset = (page - 1) * limit;
    const { count, rows } = await Event.findAndCountAll({
      where, order: [['start_date', 'DESC'], ['created_at', 'DESC']], limit, offset,
    });
    return Response.json({ success: true, count, totalPages: Math.ceil(count / limit), currentPage: page, data: rows });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching events', error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  try {
    const formData = await request.formData();
    const data: any = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'featured_image') data[key] = value;
    }
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
    const event = await Event.create(data);
    return Response.json({ success: true, data: event, message: 'Event created successfully' }, { status: 201 });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error creating event', error: error.message }, { status: 500 });
  }
}
