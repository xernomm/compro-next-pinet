import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
// @ts-ignore
import { Contact } from '@/lib/models/index';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  const { id } = await params;
  try {
    const { status, notes } = await request.json();
    const contact = await Contact.findByPk(id);
    if (!contact) return Response.json({ success: false, message: 'Contact not found' }, { status: 404 });
    const updateData: any = { status };
    if (notes) updateData.notes = notes;
    if (status === 'replied') {
      updateData.replied_at = new Date();
      updateData.replied_by = user.id;
    }
    await contact.update(updateData);
    return Response.json({ success: true, data: contact, message: 'Contact status updated successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error updating contact', error: error.message }, { status: 500 });
  }
}
