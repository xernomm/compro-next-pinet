import { NextRequest } from 'next/server';
import { initDB } from '@/lib/db';
// @ts-ignore
import { Product } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await initDB();
  const { slug } = await params;
  try {
    const product = await Product.findOne({ where: { slug } });
    if (!product) return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    return Response.json({ success: true, data: product });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching product', error: error.message }, { status: 500 });
  }
}
