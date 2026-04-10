import { NextRequest } from 'next/server';
import { initDB } from '@/lib/db';
// @ts-ignore
import { Event } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await initDB();
  const { slug } = await params;
  try {
    const event = await Event.findOne({ where: { slug } });
    if (!event) return Response.json({ success: false, message: 'Event not found' }, { status: 404 });
    return Response.json({ success: true, data: event });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching event', error: error.message }, { status: 500 });
  }
}
