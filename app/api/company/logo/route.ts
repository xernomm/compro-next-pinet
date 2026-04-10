import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import { handleFileUpload } from '@/lib/upload';
// @ts-ignore
import { CompanyInfo } from '@/lib/models/index';

export async function POST(request: NextRequest) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;

  try {
    const formData = await request.formData();
    const logoPath = await handleFileUpload(formData, 'logo');

    if (!logoPath) {
      return Response.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    let company = await CompanyInfo.findOne();
    if (!company) {
      company = await CompanyInfo.create({ logo_url: logoPath });
    } else {
      await company.update({ logo_url: logoPath });
    }

    return Response.json({
      success: true,
      data: { logo_url: logoPath },
      message: 'Logo uploaded successfully',
    });
  } catch (error: any) {
    return Response.json(
      { success: false, message: 'Error uploading logo', error: error.message },
      { status: 500 }
    );
  }
}
