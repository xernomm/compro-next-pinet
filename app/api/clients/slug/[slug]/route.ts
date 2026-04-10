import { NextRequest } from 'next/server';
import { initDB } from '@/lib/db';
// @ts-ignore
import { Client } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await initDB();
  const { slug } = await params;
  try {
    const client = await Client.findOne({ where: { slug } });
    if (!client) return Response.json({ success: false, message: 'Client not found' }, { status: 404 });
    return Response.json({ success: true, data: client });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching client', error: error.message }, { status: 500 });
  }
}
