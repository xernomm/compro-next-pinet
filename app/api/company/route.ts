import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
// @ts-ignore
import { CompanyInfo } from '@/lib/models/index';

export async function GET() {
  await initDB();
  try {
    let company = await CompanyInfo.findOne();
    if (!company) {
      company = await CompanyInfo.create({
        company_name: 'Your Company Name',
        tagline: 'Your Company Tagline',
      });
    }
    return Response.json({ success: true, data: company });
  } catch (error: any) {
    return Response.json(
      { success: false, message: 'Error fetching company info', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;

  try {
    const body = await request.json();
    let company = await CompanyInfo.findOne();

    if (!company) {
      company = await CompanyInfo.create(body);
    } else {
      await company.update(body);
    }

    return Response.json({
      success: true,
      data: company,
      message: 'Company info updated successfully',
    });
  } catch (error: any) {
    return Response.json(
      { success: false, message: 'Error updating company info', error: error.message },
      { status: 500 }
    );
  }
}
