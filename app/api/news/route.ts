import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload, handleMultipleFileUpload } from '@/lib/upload';
// @ts-ignore
import { News } from '@/lib/models/index';

export async function GET(request: NextRequest) {
  await initDB();
  try {
    const { searchParams } = new URL(request.url);
    const where: any = {};
    const is_published = searchParams.get('is_published');
    const is_featured = searchParams.get('is_featured');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    if (is_published !== null) where.is_published = is_published === 'true';
    if (is_featured !== null) where.is_featured = is_featured === 'true';
    if (category) where.category = category;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ];
    }
    const offset = (page - 1) * limit;
    const { count, rows } = await News.findAndCountAll({
      where, order: [['published_date', 'DESC'], ['created_at', 'DESC']], limit, offset,
    });
    return Response.json({ success: true, count, totalPages: Math.ceil(count / limit), currentPage: page, data: rows });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching news', error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  try {
    const formData = await request.formData();
    const data: any = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'featured_image' && key !== 'gallery') data[key] = value;
    }
    data.views = parseInt(data.views, 10) || 0;
    if (typeof data.is_published === 'string') data.is_published = data.is_published === 'true';
    if (typeof data.is_featured === 'string') data.is_featured = data.is_featured === 'true';
    if (data.published_date === '' || data.published_date === undefined) data.published_date = null;
    const imgPath = await handleFileUpload(formData, 'featured_image');
    if (imgPath) data.featured_image = imgPath;
    const galleryPaths = await handleMultipleFileUpload(formData, 'gallery');
    if (galleryPaths.length) data.gallery = JSON.stringify(galleryPaths);
    const news = await News.create(data);
    return Response.json({ success: true, data: news, message: 'News created successfully' }, { status: 201 });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error creating news', error: error.message }, { status: 500 });
  }
}
