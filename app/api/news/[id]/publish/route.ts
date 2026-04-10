import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
// @ts-ignore
import { News } from '@/lib/models/index';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;
  const { id } = await params;
  try {
    const news = await News.findByPk(id);
    if (!news) return Response.json({ success: false, message: 'News not found' }, { status: 404 });
    await news.update({ is_published: true, published_date: new Date() });
    return Response.json({ success: true, data: news, message: 'News published successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error publishing news', error: error.message }, { status: 500 });
  }
}
