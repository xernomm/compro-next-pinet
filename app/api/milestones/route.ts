import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload } from '@/lib/upload';
// @ts-ignore
import { Milestone } from '@/lib/models/index';

export async function GET(request: NextRequest) {
  await initDB();
  try {
    const { searchParams } = new URL(request.url);
    const where: any = {};
    const is_active = searchParams.get('is_active');
    if (is_active !== null) where.is_active = is_active === 'true';
    const category = searchParams.get('category');
    if (category) where.category = category;
    const milestones = await Milestone.findAll({ where, order: [['year', 'ASC'], ['order_number', 'ASC']] });
    return Response.json({ success: true, count: milestones.length, data: milestones });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching milestones', error: error.message }, { status: 500 });
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
    data.year = parseInt(data.year, 10) || new Date().getFullYear();
    data.order_number = parseInt(data.order_number, 10) || 0;
    if (typeof data.is_active === 'string') data.is_active = data.is_active === 'true';
    const imagePath = await handleFileUpload(formData, 'image');
    if (imagePath) data.image_url = imagePath;
    const milestone = await Milestone.create(data);
    return Response.json({ success: true, data: milestone, message: 'Milestone created successfully' }, { status: 201 });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error creating milestone', error: error.message }, { status: 500 });
  }
}
