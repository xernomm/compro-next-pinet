import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload } from '@/lib/upload';
// @ts-ignore
import { Service } from '@/lib/models/index';

const createSlug = (text: string) =>
  text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { id } = await params;
  try {
    const service = await Service.findByPk(id);
    if (!service) return Response.json({ success: false, message: 'Service not found' }, { status: 404 });
    return Response.json({ success: true, data: service });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching service', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  const { id } = await params;
  try {
    const service = await Service.findByPk(id);
    if (!service) return Response.json({ success: false, message: 'Service not found' }, { status: 404 });
    const formData = await request.formData();
    const data: any = {};
    for (const [key, value] of formData.entries()) { if (key !== 'image') data[key] = value; }
    data.order_number = parseInt(data.order_number, 10) || 0;
    if (typeof data.is_active === 'string') data.is_active = data.is_active === 'true';
    if (data.slug) data.slug = createSlug(data.slug);
    if (data.slug === '' && data.name) data.slug = createSlug(data.name);
    const imagePath = await handleFileUpload(formData, 'image');
    if (imagePath) data.image_url = imagePath;
    await service.update(data);
    return Response.json({ success: true, data: service, message: 'Service updated successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error updating service', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;
  const { id } = await params;
  try {
    const service = await Service.findByPk(id);
    if (!service) return Response.json({ success: false, message: 'Service not found' }, { status: 404 });
    await service.destroy();
    return Response.json({ success: true, message: 'Service deleted successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error deleting service', error: error.message }, { status: 500 });
  }
}
