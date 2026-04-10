import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload } from '@/lib/upload';
// @ts-ignore
import { Client } from '@/lib/models/index';

export async function GET(request: NextRequest) {
  await initDB();
  try {
    const { searchParams } = new URL(request.url);
    const where: any = {};
    const is_active = searchParams.get('is_active');
    const is_featured = searchParams.get('is_featured');
    const industry = searchParams.get('industry');
    const search = searchParams.get('search');
    if (is_active !== null) where.is_active = is_active === 'true';
    if (is_featured !== null) where.is_featured = is_featured === 'true';
    if (industry) where.industry = industry;
    if (search) {
      where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { description: { [Op.like]: `%${search}%` } }];
    }
    const clients = await Client.findAll({ where, order: [['order_number', 'ASC'], ['created_at', 'DESC']] });
    return Response.json({ success: true, count: clients.length, data: clients });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching clients', error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  try {
    const formData = await request.formData();
    const data: any = {};
    for (const [key, value] of formData.entries()) { if (key !== 'logo') data[key] = value; }
    data.collaboration_since = data.collaboration_since ? parseInt(data.collaboration_since, 10) || null : null;
    data.order_number = parseInt(data.order_number, 10) || 0;
    if (typeof data.is_active === 'string') data.is_active = data.is_active === 'true';
    if (typeof data.is_featured === 'string') data.is_featured = data.is_featured === 'true';
    const logoPath = await handleFileUpload(formData, 'logo');
    if (logoPath) data.logo_url = logoPath;
    const client = await Client.create(data);
    return Response.json({ success: true, data: client, message: 'Client created successfully' }, { status: 201 });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error creating client', error: error.message }, { status: 500 });
  }
}
