import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload } from '@/lib/upload';
// @ts-ignore
import { Hero } from '@/lib/models/index';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDB();
  const { id } = await params;
  try {
    const hero = await Hero.findByPk(id);
    if (!hero) return Response.json({ success: false, message: 'Hero not found' }, { status: 404 });
    return Response.json({ success: true, data: hero });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching hero', error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  const { id } = await params;

  try {
    const hero = await Hero.findByPk(id);
    if (!hero) return Response.json({ success: false, message: 'Hero not found' }, { status: 404 });

    const formData = await request.formData();
    const data: any = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'image') data[key] = value;
    }
    data.order_number = parseInt(data.order_number, 10) || 0;
    if (typeof data.is_active === 'string') data.is_active = data.is_active === 'true';

    const imagePath = await handleFileUpload(formData, 'image');
    if (imagePath) data.image_url = imagePath;

    await hero.update(data);
    return Response.json({ success: true, data: hero, message: 'Hero updated successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error updating hero', error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;
  const { id } = await params;

  try {
    const hero = await Hero.findByPk(id);
    if (!hero) return Response.json({ success: false, message: 'Hero not found' }, { status: 404 });
    await hero.destroy();
    return Response.json({ success: true, message: 'Hero deleted successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error deleting hero', error: error.message }, { status: 500 });
  }
}
