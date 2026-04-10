import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload } from '@/lib/upload';
// @ts-ignore
import { Client } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { id } = await params;
  try {
    const client = await Client.findByPk(id);
    if (!client) return Response.json({ success: false, message: 'Client not found' }, { status: 404 });
    return Response.json({ success: true, data: client });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching client', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  const { id } = await params;
  try {
    const client = await Client.findByPk(id);
    if (!client) return Response.json({ success: false, message: 'Client not found' }, { status: 404 });
    const formData = await request.formData();
    const data: any = {};
    for (const [key, value] of formData.entries()) { if (key !== 'logo') data[key] = value; }
    data.collaboration_since = data.collaboration_since ? parseInt(data.collaboration_since, 10) || null : null;
    data.order_number = parseInt(data.order_number, 10) || 0;
    if (typeof data.is_active === 'string') data.is_active = data.is_active === 'true';
    if (typeof data.is_featured === 'string') data.is_featured = data.is_featured === 'true';
    const logoPath = await handleFileUpload(formData, 'logo');
    if (logoPath) data.logo_url = logoPath;
    await client.update(data);
    return Response.json({ success: true, data: client, message: 'Client updated successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error updating client', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;
  const { id } = await params;
  try {
    const client = await Client.findByPk(id);
    if (!client) return Response.json({ success: false, message: 'Client not found' }, { status: 404 });
    await client.destroy();
    return Response.json({ success: true, message: 'Client deleted successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error deleting client', error: error.message }, { status: 500 });
  }
}
