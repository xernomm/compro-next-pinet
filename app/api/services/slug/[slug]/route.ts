import { NextRequest } from 'next/server';
import { initDB } from '@/lib/db';
// @ts-ignore
import { Service } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await initDB();
  const { slug } = await params;
  try {
    const service = await Service.findOne({ where: { slug } });
    if (!service) return Response.json({ success: false, message: 'Service not found' }, { status: 404 });
    return Response.json({ success: true, data: service });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching service', error: error.message }, { status: 500 });
  }
}
