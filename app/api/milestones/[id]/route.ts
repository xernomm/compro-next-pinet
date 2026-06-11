import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload } from '@/lib/upload';
// @ts-ignore
import { Milestone } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { id } = await params;
  try {
    const milestone = await Milestone.findByPk(id);
    if (!milestone) return Response.json({ success: false, message: 'Milestone not found' }, { status: 404 });
    return Response.json({ success: true, data: milestone });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching milestone', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  const { id } = await params;
  try {
    const milestone = await Milestone.findByPk(id);
    if (!milestone) return Response.json({ success: false, message: 'Milestone not found' }, { status: 404 });
    const formData = await request.formData();
    const data: any = {};
    for (const [key, v] of formData.entries()) { if (key !== 'image') data[key] = v; }
    data.year = parseInt(data.year, 10) || milestone.year;
    data.order_number = parseInt(data.order_number, 10) || 0;
    if (typeof data.is_active === 'string') data.is_active = data.is_active === 'true';
    const imagePath = await handleFileUpload(formData, 'image');
    if (imagePath) data.image_url = imagePath;
    await milestone.update(data);
    return Response.json({ success: true, data: milestone, message: 'Milestone updated successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error updating milestone', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;
  const { id } = await params;
  try {
    const milestone = await Milestone.findByPk(id);
    if (!milestone) return Response.json({ success: false, message: 'Milestone not found' }, { status: 404 });
    await milestone.destroy();
    return Response.json({ success: true, message: 'Milestone deleted successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error deleting milestone', error: error.message }, { status: 500 });
  }
}
