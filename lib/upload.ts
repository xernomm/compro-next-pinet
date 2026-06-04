import path from 'path';
import fs from 'fs';

const UPLOAD_BASE = path.join(process.cwd(), 'public', 'uploads');

const DIRS = ['images', 'documents', 'logos', 'gallery', 'videos'];

function ensureDirs() {
  DIRS.forEach((dir) => {
    const fullPath = path.join(UPLOAD_BASE, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
}

function getFolder(fieldname: string, filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (['.mp4', '.mov', '.mkv', '.avi', '.webm'].includes(ext)) {
    return 'videos';
  }
  if (fieldname.includes('logo') || fieldname.includes('icon')) return 'logos';
  if (fieldname.includes('document') || fieldname.includes('brochure')) return 'documents';
  if (fieldname.includes('gallery')) return 'gallery';
  return 'images';
}

export async function handleFileUpload(
  formData: FormData,
  fieldname: string
): Promise<string | null> {
  ensureDirs();

  const file = formData.get(fieldname) as File | null;
  if (!file || !(file instanceof File)) return null;

  const ext = path.extname(file.name).toLowerCase();
  const isVideo = ['.mp4', '.mov', '.mkv', '.avi', '.webm'].includes(ext);

  const defaultMaxSize = parseInt(process.env.MAX_FILE_SIZE || '5242880');
  const maxSize = isVideo ? 2 * 1024 * 1024 * 1024 : defaultMaxSize; // 2GB for videos

  if (file.size > maxSize) {
    throw new Error(isVideo ? 'Video file size exceeds the 2GB limit' : 'File size exceeds limit');
  }

  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|mov|mkv|avi|webm/;
  if (!allowedTypes.test(ext.replace('.', ''))) {
    throw new Error('Only images, documents, and videos (mp4, mov, mkv, avi, webm) are allowed');
  }

  const folder = getFolder(fieldname, file.name);
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `${fieldname}-${uniqueSuffix}${ext}`;
  const filePath = path.join(UPLOAD_BASE, folder, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return `/uploads/${folder}/${filename}`;
}

export async function handleMultipleFileUpload(
  formData: FormData,
  fieldname: string
): Promise<string[]> {
  ensureDirs();
  const files = formData.getAll(fieldname);
  const paths: string[] = [];

  for (const file of files) {
    if (!(file instanceof File)) continue;

    const ext = path.extname(file.name).toLowerCase();
    const isVideo = ['.mp4', '.mov', '.mkv', '.avi', '.webm'].includes(ext);

    const defaultMaxSize = parseInt(process.env.MAX_FILE_SIZE || '5242880');
    const maxSize = isVideo ? 2 * 1024 * 1024 * 1024 : defaultMaxSize;

    if (file.size > maxSize) continue;

    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|mov|mkv|avi|webm/;
    if (!allowedTypes.test(ext.replace('.', ''))) continue;

    const folder = getFolder(fieldname, file.name);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${fieldname}-${uniqueSuffix}${ext}`;
    const filePath = path.join(UPLOAD_BASE, folder, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    paths.push(`/uploads/${folder}/${filename}`);
  }

  return paths;
}

