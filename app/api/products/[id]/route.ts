import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload, handleMultipleFileUpload } from '@/lib/upload';
// @ts-ignore
import { Product } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { id } = await params;
  try {
    const product = await Product.findByPk(id);
    if (!product) return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    return Response.json({ success: true, data: product });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching product', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  const { id } = await params;
  try {
    const product = await Product.findByPk(id);
    if (!product) return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
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
    if (galleryPaths.length) {
      let existing = product.gallery || [];
      if (typeof existing === 'string') { try { existing = JSON.parse(existing); } catch { existing = []; } }
      data.gallery = JSON.stringify([...existing, ...galleryPaths]);
    }
    ['features', 'benefits', 'specifications'].forEach(field => {
      if (data[field] && typeof data[field] === 'string') {
        try { JSON.parse(data[field]); } catch { data[field] = JSON.stringify([data[field]]); }
      }
    });
    await product.update(data);
    return Response.json({ success: true, data: product, message: 'Product updated successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error updating product', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;
  const { id } = await params;
  try {
    const product = await Product.findByPk(id);
    if (!product) return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    await product.destroy();
    return Response.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error deleting product', error: error.message }, { status: 500 });
  }
}
