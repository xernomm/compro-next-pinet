import { NextRequest } from 'next/server';
import { initDB } from '@/lib/db';
// @ts-ignore
import { CompanyInfo, Product, Service, Value, News, Event, Career, Client, Partner, Milestone } from '@/lib/models/index';

export async function GET(request: NextRequest) {
  try {
    await initDB();

    const [company, products, services, values, news, events, careers, clients, partners, milestones] =
      await Promise.all([
        CompanyInfo.findOne(),
        Product.findAll({ where: { is_active: true }, attributes: ['name', 'category', 'short_description', 'description', 'features', 'target_segment'] }),
        Service.findAll({ where: { is_active: true }, attributes: ['name', 'short_description', 'description'] }),
        Value.findAll({ where: { is_active: true }, attributes: ['title', 'description'] }),
        News.findAll({ where: { is_published: true }, limit: 20, order: [['published_date', 'DESC']], attributes: ['title', 'category', 'excerpt', 'content', 'author', 'published_date'] }),
        Event.findAll({ limit: 10, order: [['createdAt', 'DESC']], attributes: ['title', 'description', 'location', 'start_date', 'end_date'] }),
        Career.findAll({ where: { is_active: true, status: 'open' }, attributes: ['job_title', 'department', 'location', 'employment_type', 'experience_level', 'description'] }),
        Client.findAll({ where: { is_active: true }, attributes: ['name', 'industry', 'description'] }),
        Partner.findAll({ where: { is_active: true }, attributes: ['name', 'description', 'partnership_type'] }),
        Milestone.findAll({ order: [['year', 'ASC']], attributes: ['year', 'title', 'description'] }),
      ]);

    const context = buildNarrativeContext({ company, products, services, values, news, events, careers, clients, partners, milestones });

    return Response.json({ success: true, context });
  } catch (error: any) {
    console.error('RAG context error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

function buildNarrativeContext({ company, products, services, values, news, events, careers, clients, partners, milestones }: any) {
  const lines: string[] = [];

  // --- Company Profile ---
  if (company) {
    lines.push(`## Tentang Perusahaan`);
    if (company.company_name) lines.push(`Nama perusahaan: ${company.company_name}.`);
    if (company.tagline) lines.push(`Tagline: ${company.tagline}.`);
    if (company.about) lines.push(`Tentang: ${company.about}`);
    if (company.history) lines.push(`Sejarah perusahaan: ${company.history}`);
    if (company.vision) lines.push(`Visi: ${company.vision}`);
    if (company.mission) lines.push(`Misi: ${company.mission}`);
    if (company.established_year) lines.push(`Perusahaan didirikan pada tahun ${company.established_year}.`);
    if (company.address) lines.push(`Alamat: ${[company.address, company.city, company.province, company.postal_code, company.country].filter(Boolean).join(', ')}.`);
    if (company.email) lines.push(`Email: ${company.email}.`);
    if (company.phone) lines.push(`Telepon: ${company.phone}.`);
  }

  // --- Values ---
  if (values?.length > 0) {
    lines.push(`\n## Nilai-nilai Perusahaan`);
    values.forEach((v: any) => {
      lines.push(`- **${v.title}**: ${v.description || ''}`);
    });
  }

  // --- Milestones ---
  if (milestones?.length > 0) {
    lines.push(`\n## Perjalanan & Tonggak Sejarah`);
    milestones.forEach((m: any) => {
      lines.push(`- ${m.year}: ${m.title}. ${m.description || ''}`);
    });
  }

  // --- Services ---
  if (services?.length > 0) {
    lines.push(`\n## Layanan yang Ditawarkan`);
    services.forEach((s: any) => {
      lines.push(`### ${s.name}`);
      if (s.short_description) lines.push(s.short_description);
      if (s.description) lines.push(s.description);
    });
  }

  // --- Products ---
  if (products?.length > 0) {
    lines.push(`\n## Produk`);
    products.forEach((p: any) => {
      lines.push(`### ${p.name}${p.category ? ` (${p.category})` : ''}`);
      if (p.short_description) lines.push(p.short_description);
      if (p.description) lines.push(p.description);
      if (p.target_segment) lines.push(`Target segmen: ${p.target_segment}.`);
      if (p.features) {
        try {
          const feats = JSON.parse(p.features);
          if (Array.isArray(feats)) lines.push(`Fitur: ${feats.join(', ')}.`);
        } catch {}
      }
    });
  }

  // --- Clients ---
  if (clients?.length > 0) {
    lines.push(`\n## Klien`);
    const clientNames = clients.map((c: any) => c.name).filter(Boolean);
    if (clientNames.length) lines.push(`Perusahaan telah melayani klien antara lain: ${clientNames.join(', ')}.`);
  }

  // --- Partners ---
  if (partners?.length > 0) {
    lines.push(`\n## Mitra`);
    partners.forEach((p: any) => {
      lines.push(`- **${p.name}**${p.partnership_type ? ` (${p.partnership_type})` : ''}: ${p.description || ''}`);
    });
  }

  // --- Careers ---
  if (careers?.length > 0) {
    lines.push(`\n## Lowongan Pekerjaan Tersedia`);
    careers.forEach((c: any) => {
      lines.push(`- **${c.job_title}** – Departemen: ${c.department || '-'}, Lokasi: ${c.location || '-'}, Tipe: ${c.employment_type || '-'}, Level: ${c.experience_level || '-'}.`);
    });
  }

  // --- News ---
  if (news?.length > 0) {
    lines.push(`\n## Berita & Artikel Terbaru`);
    news.slice(0, 10).forEach((n: any) => {
      lines.push(`### ${n.title}${n.category ? ` [${n.category}]` : ''}`);
      if (n.excerpt) lines.push(n.excerpt);
    });
  }

  // --- Events ---
  if (events?.length > 0) {
    lines.push(`\n## Acara`);
    events.forEach((e: any) => {
      lines.push(`- **${e.title}**: ${e.description || ''}${e.location ? ` (Lokasi: ${e.location})` : ''}.`);
    });
  }

  return lines.join('\n');
}
