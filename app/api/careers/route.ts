import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
// @ts-ignore
import { Career } from '@/lib/models/index';

export async function GET(request: NextRequest) {
  await initDB();
  try {
    const { searchParams } = new URL(request.url);
    const where: any = {};
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const is_active = searchParams.get('is_active');
    const is_featured = searchParams.get('is_featured');
    const department = searchParams.get('department');
    const employment_type = searchParams.get('employment_type');
    const experience_level = searchParams.get('experience_level');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    if (is_active !== null) where.is_active = is_active === 'true';
    if (is_featured !== null) where.is_featured = is_featured === 'true';
    if (department) where.department = department;
    if (employment_type) where.employment_type = employment_type;
    if (experience_level) where.experience_level = experience_level;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { job_title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
      ];
    }
    const offset = (page - 1) * limit;
    const { count, rows } = await Career.findAndCountAll({
      where, order: [['posted_date', 'DESC'], ['created_at', 'DESC']], limit, offset,
    });
    return Response.json({ success: true, count, totalPages: Math.ceil(count / limit), currentPage: page, data: rows });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching careers', error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  try {
    const body = await request.json();
    if (!body.employment_type || body.employment_type === '') body.employment_type = 'full_time';
    if (!body.status || body.status === '') body.status = 'open';
    if (body.experience_level === '') body.experience_level = null;
    body.views = parseInt(body.views, 10) || 0;
    if (typeof body.is_featured === 'string') body.is_featured = body.is_featured === 'true';
    if (typeof body.is_active === 'string') body.is_active = body.is_active === 'true';
    if (body.application_deadline === '' || body.application_deadline === undefined) body.application_deadline = null;
    if (body.posted_date === '' || body.posted_date === undefined) body.posted_date = new Date();
    const career = await Career.create(body);
    return Response.json({ success: true, data: career, message: 'Career created successfully' }, { status: 201 });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error creating career', error: error.message }, { status: 500 });
  }
}
