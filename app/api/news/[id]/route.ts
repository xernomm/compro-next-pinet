import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload, handleMultipleFileUpload } from '@/lib/upload';
// @ts-ignore
import { News } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { id } = await params;
  try {
    const news = await News.findByPk(id);
    if (!news) return Response.json({ success: false, message: 'News not found' }, { status: 404 });
    await news.increment('views');
    return Response.json({ success: true, data: news });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching news', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  const { id } = await params;
  try {
    const news = await News.findByPk(id);
    if (!news) return Response.json({ success: false, message: 'News not found' }, { status: 404 });
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
    if (galleryPaths.length) {
      let existing = news.gallery || [];
      if (typeof existing === 'string') { try { existing = JSON.parse(existing); } catch { existing = []; } }
      data.gallery = JSON.stringify([...existing, ...galleryPaths]);
    }
    await news.update(data);
    return Response.json({ success: true, data: news, message: 'News updated successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error updating news', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;
  const { id } = await params;
  try {
    const news = await News.findByPk(id);
    if (!news) return Response.json({ success: false, message: 'News not found' }, { status: 404 });
    await news.destroy();
    return Response.json({ success: true, message: 'News deleted successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error deleting news', error: error.message }, { status: 500 });
  }
}
