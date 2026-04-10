import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload, handleMultipleFileUpload } from '@/lib/upload';
// @ts-ignore
import { Product } from '@/lib/models/index';

export async function GET(request: NextRequest) {
  await initDB();
  try {
    const { searchParams } = new URL(request.url);
    const where: any = {};
    const is_active = searchParams.get('is_active');
    const is_featured = searchParams.get('is_featured');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    if (is_active !== null) where.is_active = is_active === 'true';
    if (is_featured !== null) where.is_featured = is_featured === 'true';
    if (category) where.category = category;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { short_description: { [Op.like]: `%${search}%` } },
      ];
    }
    const offset = (page - 1) * limit;
    const { count, rows } = await Product.findAndCountAll({
      where, order: [['order_number', 'ASC'], ['created_at', 'DESC']],
      limit, offset,
    });
    return Response.json({ success: true, count, totalPages: Math.ceil(count / limit), currentPage: page, data: rows });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching products', error: error.message }, { status: 500 });
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
      if (key !== 'image' && key !== 'gallery') data[key] = value;
    }
    data.order_number = parseInt(data.order_number, 10) || 0;
    if (typeof data.is_active === 'string') data.is_active = data.is_active === 'true';
    if (typeof data.is_featured === 'string') data.is_featured = data.is_featured === 'true';
    const imagePath = await handleFileUpload(formData, 'image');
    if (imagePath) data.image_url = imagePath;
    const galleryPaths = await handleMultipleFileUpload(formData, 'gallery');
    if (galleryPaths.length) data.gallery = JSON.stringify(galleryPaths);
    ['features', 'benefits', 'specifications'].forEach(field => {
      if (data[field] && typeof data[field] === 'string') {
        try { JSON.parse(data[field]); } catch { data[field] = JSON.stringify([data[field]]); }
      }
    });
    const product = await Product.create(data);
    return Response.json({ success: true, data: product, message: 'Product created successfully' }, { status: 201 });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error creating product', error: error.message }, { status: 500 });
  }
}
