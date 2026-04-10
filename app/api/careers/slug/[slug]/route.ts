import { NextRequest } from 'next/server';
import { initDB } from '@/lib/db';
// @ts-ignore
import { Career } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await initDB();
  const { slug } = await params;
  try {
    const career = await Career.findOne({ where: { slug } });
    if (!career) return Response.json({ success: false, message: 'Career not found' }, { status: 404 });
    await career.increment('views');
    return Response.json({ success: true, data: career });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching career', error: error.message }, { status: 500 });
  }
}
