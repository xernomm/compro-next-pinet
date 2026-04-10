import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload } from '@/lib/upload';
// @ts-ignore
import { Partner } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { id } = await params;
  try {
    const partner = await Partner.findByPk(id);
    if (!partner) return Response.json({ success: false, message: 'Partner not found' }, { status: 404 });
    return Response.json({ success: true, data: partner });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching partner', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  const { id } = await params;
  try {
    const partner = await Partner.findByPk(id);
    if (!partner) return Response.json({ success: false, message: 'Partner not found' }, { status: 404 });
    const formData = await request.formData();
    const data: any = {};
    for (const [key, value] of formData.entries()) { if (key !== 'logo') data[key] = value; }
    if (!data.partnership_type || data.partnership_type === '') data.partnership_type = 'strategic';
    data.partnership_since = data.partnership_since ? parseInt(data.partnership_since, 10) || null : null;
    data.order_number = parseInt(data.order_number, 10) || 0;
    if (typeof data.is_active === 'string') data.is_active = data.is_active === 'true';
    const logoPath = await handleFileUpload(formData, 'logo');
    if (logoPath) data.logo_url = logoPath;
    await partner.update(data);
    return Response.json({ success: true, data: partner, message: 'Partner updated successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error updating partner', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;
  const { id } = await params;
  try {
    const partner = await Partner.findByPk(id);
    if (!partner) return Response.json({ success: false, message: 'Partner not found' }, { status: 404 });
    await partner.destroy();
    return Response.json({ success: true, message: 'Partner deleted successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error deleting partner', error: error.message }, { status: 500 });
  }
}
