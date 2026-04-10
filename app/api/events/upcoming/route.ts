import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { initDB } from '@/lib/db';
// @ts-ignore
import { Event } from '@/lib/models/index';

export async function GET() {
  await initDB();
  try {
    const events = await Event.findAll({
      where: { status: 'upcoming', is_published: true, start_date: { [Op.gte]: new Date() } },
      order: [['start_date', 'ASC']],
      limit: 10,
    });
    return Response.json({ success: true, count: events.length, data: events });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching upcoming events', error: error.message }, { status: 500 });
  }
}
