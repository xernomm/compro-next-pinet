import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload } from '@/lib/upload';
// @ts-ignore
import { Partner } from '@/lib/models/index';

export async function GET(request: NextRequest) {
  await initDB();
  try {
    const { searchParams } = new URL(request.url);
    const where: any = {};
    const is_active = searchParams.get('is_active');
    const partnership_type = searchParams.get('partnership_type');
    const search = searchParams.get('search');
    if (is_active !== null) where.is_active = is_active === 'true';
    if (partnership_type) where.partnership_type = partnership_type;
    if (search) {
      where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { description: { [Op.like]: `%${search}%` } }];
    }
    const partners = await Partner.findAll({ where, order: [['order_number', 'ASC'], ['created_at', 'DESC']] });
    return Response.json({ success: true, count: partners.length, data: partners });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching partners', error: error.message }, { status: 500 });
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
    if (!data.partnership_type || data.partnership_type === '') data.partnership_type = 'strategic';
    data.partnership_since = data.partnership_since ? parseInt(data.partnership_since, 10) || null : null;
    data.order_number = parseInt(data.order_number, 10) || 0;
    if (typeof data.is_active === 'string') data.is_active = data.is_active === 'true';
    const logoPath = await handleFileUpload(formData, 'logo');
    if (logoPath) data.logo_url = logoPath;
    const partner = await Partner.create(data);
    return Response.json({ success: true, data: partner, message: 'Partner created successfully' }, { status: 201 });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error creating partner', error: error.message }, { status: 500 });
  }
}
