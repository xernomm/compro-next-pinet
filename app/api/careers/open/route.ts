import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { initDB } from '@/lib/db';
// @ts-ignore
import { Career } from '@/lib/models/index';

export async function GET() {
  await initDB();
  try {
    const careers = await Career.findAll({
      where: {
        status: 'open',
        is_active: true,
        [Op.or]: [
          { application_deadline: { [Op.gte]: new Date() } },
          { application_deadline: null },
        ],
      },
      order: [['posted_date', 'DESC']],
      limit: 20,
    });
    return Response.json({ success: true, count: careers.length, data: careers });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching open positions', error: error.message }, { status: 500 });
  }
}
