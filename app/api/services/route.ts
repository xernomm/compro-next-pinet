import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload } from '@/lib/upload';
// @ts-ignore
import { Service } from '@/lib/models/index';

const createSlug = (text: string) =>
  text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');

export async function GET(request: NextRequest) {
  await initDB();
  try {
    const { searchParams } = new URL(request.url);
    const where: any = {};
    const is_active = searchParams.get('is_active');
    const search = searchParams.get('search');
    if (is_active !== null) where.is_active = is_active === 'true';
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { short_description: { [Op.like]: `%${search}%` } },
      ];
    }
    const services = await Service.findAll({ where, order: [['order_number', 'ASC'], ['created_at', 'DESC']] });
    return Response.json({ success: true, count: services.length, data: services });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching services', error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  try {
    const formData = await request.formData();
    const data: any = {};
    for (const [key, value] of formData.entries()) { if (key !== 'image') data[key] = value; }
    data.order_number = parseInt(data.order_number, 10) || 0;
    if (typeof data.is_active === 'string') data.is_active = data.is_active === 'true';
    if (!data.slug && data.name) data.slug = createSlug(data.name);
    else if (data.slug) data.slug = createSlug(data.slug);
    const imagePath = await handleFileUpload(formData, 'image');
    if (imagePath) data.image_url = imagePath;
    const service = await Service.create(data);
    return Response.json({ success: true, data: service, message: 'Service created successfully' }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError')
      return Response.json({ success: false, message: 'Service with this slug already exists' }, { status: 400 });
    return Response.json({ success: false, message: 'Error creating service', error: error.message }, { status: 500 });
  }
}
