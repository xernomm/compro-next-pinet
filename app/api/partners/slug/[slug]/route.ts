import { NextRequest } from 'next/server';
import { initDB } from '@/lib/db';
// @ts-ignore
import { Partner } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await initDB();
  const { slug } = await params;
  try {
    const partner = await Partner.findOne({ where: { slug } });
    if (!partner) return Response.json({ success: false, message: 'Partner not found' }, { status: 404 });
    return Response.json({ success: true, data: partner });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching partner', error: error.message }, { status: 500 });
  }
}
