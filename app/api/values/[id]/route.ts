import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload } from '@/lib/upload';
// @ts-ignore
import { Value } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { id } = await params;
  try {
    const value = await Value.findByPk(id);
    if (!value) return Response.json({ success: false, message: 'Value not found' }, { status: 404 });
    return Response.json({ success: true, data: value });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching value', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  const { id } = await params;
  try {
    const value = await Value.findByPk(id);
    if (!value) return Response.json({ success: false, message: 'Value not found' }, { status: 404 });
    const formData = await request.formData();
    const data: any = {};
    for (const [key, v] of formData.entries()) { if (key !== 'image') data[key] = v; }
    data.order_number = parseInt(data.order_number, 10) || 0;
    if (typeof data.is_active === 'string') data.is_active = data.is_active === 'true';
    const imagePath = await handleFileUpload(formData, 'image');
    if (imagePath) data.image_url = imagePath;
    await value.update(data);
    return Response.json({ success: true, data: value, message: 'Value updated successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error updating value', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;
  const { id } = await params;
  try {
    const value = await Value.findByPk(id);
    if (!value) return Response.json({ success: false, message: 'Value not found' }, { status: 404 });
    await value.destroy();
    return Response.json({ success: true, message: 'Value deleted successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error deleting value', error: error.message }, { status: 500 });
  }
}
