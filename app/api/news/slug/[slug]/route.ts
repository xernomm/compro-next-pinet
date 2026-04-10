import { NextRequest } from 'next/server';
import { initDB } from '@/lib/db';
// @ts-ignore
import { News } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await initDB();
  const { slug } = await params;
  try {
    const news = await News.findOne({ where: { slug } });
    if (!news) return Response.json({ success: false, message: 'News not found' }, { status: 404 });
    await news.increment('views');
    return Response.json({ success: true, data: news });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching news', error: error.message }, { status: 500 });
  }
}
