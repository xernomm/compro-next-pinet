import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
// @ts-ignore
import { Contact } from '@/lib/models/index';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin', 'editor');
  if (error) return error;
  const { id } = await params;
  try {
    const contact = await Contact.findByPk(id);
    if (!contact) return Response.json({ success: false, message: 'Contact not found' }, { status: 404 });
    if (contact.status === 'new') await contact.update({ status: 'read' });
    return Response.json({ success: true, data: contact });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error fetching contact', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;
  const { id } = await params;
  try {
    const contact = await Contact.findByPk(id);
    if (!contact) return Response.json({ success: false, message: 'Contact not found' }, { status: 404 });
    await contact.destroy();
    return Response.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Error deleting contact', error: error.message }, { status: 500 });
  }
}
