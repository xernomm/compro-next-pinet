import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { initDB } from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export async function POST(request: NextRequest) {
  await initDB();
  const { user, error } = await requireRole(request, 'super_admin', 'admin');
  if (error) return error;

  try {
    const backupDir = path.join(process.cwd(), 'backend', 'backup');
    const uploadsDir = path.join(process.cwd(), 'backend', 'uploads');

    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dbBackupFile = path.join(backupDir, `db_backup_${timestamp}.sql`);
    const mediaBackupDir = path.join(backupDir, `media_backup_${timestamp}`);

    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
    const mysqldumpCommand = `mysqldump -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > "${dbBackupFile}"`;

    await new Promise<void>((resolve, reject) => {
      exec(mysqldumpCommand, (error) => { error ? reject(error) : resolve(); });
    });

    if (fs.existsSync(uploadsDir)) {
      await fs.promises.cp(uploadsDir, mediaBackupDir, { recursive: true });
    }

    return Response.json({
      success: true,
      message: 'Backup created successfully',
      data: { database: `db_backup_${timestamp}.sql`, media: `media_backup_${timestamp}` },
    });
  } catch (error: any) {
    return Response.json({ success: false, message: 'Backup failed', error: error.message }, { status: 500 });
  }
}
