import { NextRequest } from 'next/server';
import { requireRole, requireAuth } from '@/lib/auth';
import { initDB } from '@/lib/db';
// @ts-ignore
import { Contact } from '@/lib/models/index';

export async function GET(request: NextRequest) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  try {
    const { searchParams } = new URL(request.url);
    const where: any = {};
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    if (status) where.status = status;
    if (category) where.category = category;
    const offset = (page - 1) * limit;
    const { count, rows } = await Contact.findAndCountAll({
      where, order: [['created_at', 'DESC']], limit, offset,
    });
    return Response.json({ success: true, count, totalPages: Math.ceil(count / limit), currentPage: page, data: rows });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching contacts', error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await initDB();
  try {
    const body = await request.json();
    const { name, email, phone, company, subject, message, category } = body;
    const contactData = {
      name, email, phone, company, subject, message, category,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent'),
    };
    const contact = await Contact.create(contactData);
    return Response.json(
      { success: true, data: contact, message: 'Your message has been sent successfully. We will contact you soon.' },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error sending message', error: error.message }, { status: 500 });
  }
}
