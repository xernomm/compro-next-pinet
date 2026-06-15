const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local to avoid needing the dotenv dependency
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const equalIndex = trimmed.indexOf('=');
      if (equalIndex > 0) {
        const key = trimmed.substring(0, equalIndex).trim();
        const value = trimmed.substring(equalIndex + 1).trim();
        // Strip optional quotes around value
        const cleanValue = value.replace(/^['"]|['"]$/g, '');
        process.env[key] = cleanValue;
      }
    }
  });
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'company_profile',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'rich0505',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false,
    define: { timestamps: true, underscored: true, freezeTableName: true },
  }
);

const Client = sequelize.define('clients', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  logo_url: { type: DataTypes.STRING(255), allowNull: true },
  website_url: { type: DataTypes.STRING(255), allowNull: true },
  industry: { type: DataTypes.STRING(100), allowNull: true },
  project_description: { type: DataTypes.TEXT, allowNull: true },
  testimonial: { type: DataTypes.TEXT, allowNull: true },
  testimonial_author: { type: DataTypes.STRING(100), allowNull: true },
  testimonial_position: { type: DataTypes.STRING(100), allowNull: true },
  collaboration_since: { type: DataTypes.INTEGER, allowNull: true },
  order_number: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

const clients = [
  { id: 1, name: 'Hotel Mulia Senayan, Jakarta', slug: 'hotel-mulia-senayan-jakarta', description: 'Five-star luxury hospitality provider in Jakarta.', logo_url: 'https://logo.clearbit.com/themulia.com', website_url: 'https://www.themulia.com', industry: 'Hospitality', project_description: 'Infrastructure and network deployment for high-performance guest connectivity.', collaboration_since: 2014, order_number: 1, is_featured: true, is_active: true },
  { id: 2, name: 'Sinarmas Land', slug: 'sinarmas-land', description: 'One of the largest property developers in Indonesia.', logo_url: 'https://logo.clearbit.com/sinarmasland.com', website_url: 'https://www.sinarmasland.com', industry: 'Real Estate', project_description: 'Data center design, virtualization, and storage management systems.', collaboration_since: 2015, order_number: 2, is_featured: true, is_active: true },
  { id: 3, name: 'Sequis Life', slug: 'sequis-life', description: 'Leading life and health insurance provider in Indonesia.', logo_url: 'https://logo.clearbit.com/sequis.co.id', website_url: 'https://www.sequis.co.id', industry: 'Insurance', project_description: 'Database replication and business continuity orchestration.', collaboration_since: 2016, order_number: 3, is_featured: false, is_active: true },
  { id: 4, name: 'Jiwasraya', slug: 'jiwasraya', description: 'State-owned life insurance company in Indonesia.', logo_url: 'https://logo.clearbit.com/jiwasraya.co.id', website_url: 'https://www.jiwasraya.co.id', industry: 'Insurance', project_description: 'Enterprise core database consolidation and performance tuning.', collaboration_since: 2013, order_number: 4, is_featured: false, is_active: true },
  { id: 5, name: 'Pemerintah Provinsi DKI Jakarta', slug: 'pemerintah-provinsi-dki-jakarta', description: 'Provincial government of Jakarta.', logo_url: 'https://logo.clearbit.com/jakarta.go.id', website_url: 'https://jakarta.go.id', industry: 'Government', project_description: 'Smart city infrastructure, portal optimization, and data security governance.', collaboration_since: 2012, order_number: 5, is_featured: true, is_active: true },
  { id: 6, name: 'Komisi Pemberantasan Korupsi (KPK)', slug: 'komisi-pemberantasan-korupsi-kpk', description: 'Corruption Eradication Commission of the Republic of Indonesia.', logo_url: 'https://logo.clearbit.com/kpk.go.id', website_url: 'https://www.kpk.go.id', industry: 'Government', project_description: 'High-security database architecture, application integration, and threat prevention.', collaboration_since: 2015, order_number: 6, is_featured: true, is_active: true },
  { id: 7, name: 'Lotte', slug: 'lotte', description: 'Multinational retail and food corporation.', logo_url: 'https://logo.clearbit.com/lotte.co.id', website_url: 'https://www.lotte.co.id', industry: 'Retail', project_description: 'SD-WAN networking and multi-branch infrastructure optimization.', collaboration_since: 2017, order_number: 7, is_featured: false, is_active: true },
  { id: 8, name: 'Kementerian Komunikasi dan Informatika (Kemkominfo)', slug: 'kementerian-komunikasi-dan-informatika-kemkominfo', description: 'Ministry of Communication and Informatics of Indonesia.', logo_url: 'https://logo.clearbit.com/kominfo.go.id', website_url: 'https://www.kominfo.go.id', industry: 'Government', project_description: 'National digital transformation support and cloud architecture integration.', collaboration_since: 2016, order_number: 8, is_featured: true, is_active: true },
  { id: 9, name: 'Taspen', slug: 'taspen', description: 'State-owned social security provider for civil servants.', logo_url: 'https://logo.clearbit.com/taspen.co.id', website_url: 'https://www.taspen.co.id', industry: 'Financial Services', project_description: 'High-availability database administration and system optimization.', collaboration_since: 2015, order_number: 9, is_featured: false, is_active: true },
  { id: 10, name: 'Perusahaan Listrik Negara (PLN)', slug: 'perusahaan-listrik-negara-pln', description: 'State-owned electricity distribution utility.', logo_url: 'https://logo.clearbit.com/pln.co.id', website_url: 'https://www.pln.co.id', industry: 'Energy & Utilities', project_description: 'Mission-critical database clusters and real-time load orchestration.', collaboration_since: 2014, order_number: 10, is_featured: true, is_active: true },
  { id: 11, name: 'Polri (Badan Intelijen Keamanan)', slug: 'polri-badan-intelijen-keamanan', description: 'Intelligence and security agency of the Indonesian National Police.', logo_url: 'https://logo.clearbit.com/polri.go.id', website_url: 'https://www.polri.go.id', industry: 'Government', project_description: 'Custom software solutions and high-security tactical intelligence architecture.', collaboration_since: 2018, order_number: 11, is_featured: true, is_active: true },
  { id: 12, name: 'Sinarmas Forestry', slug: 'sinarmas-forestry', description: 'Pulp and paper forestry management division of Sinarmas.', logo_url: 'https://logo.clearbit.com/sinarmasforestry.com', website_url: 'https://www.sinarmasforestry.com', industry: 'Agriculture & Forestry', project_description: 'Remote branch networking, SD-WAN optimization, and data synchronization.', collaboration_since: 2016, order_number: 12, is_featured: false, is_active: true },
  { id: 13, name: 'Kementerian Pertahanan Republik Indonesia', slug: 'kementerian-pertahanan-republik-indonesia', description: 'Ministry of Defense of the Republic of Indonesia.', logo_url: 'https://logo.clearbit.com/kemhan.go.id', website_url: 'https://www.kemhan.go.id', industry: 'Government', project_description: 'Military logistics software development and secure data center architectures.', collaboration_since: 2019, order_number: 13, is_featured: true, is_active: true },
  { id: 14, name: 'Korps Brimob', slug: 'korps-brimob', description: 'Mobile Brigade Corps of the Indonesian National Police.', logo_url: 'https://logo.clearbit.com/polri.go.id', website_url: 'https://brimob.polri.go.id', industry: 'Government', project_description: 'Specialized inventory database and tactical communication integration.', collaboration_since: 2020, order_number: 14, is_featured: true, is_active: true },
  { id: 15, name: 'Bank DKI', slug: 'bank-dki', description: 'Regional development bank for the Special Capital Region of Jakarta.', logo_url: 'https://logo.clearbit.com/bankdki.co.id', website_url: 'https://www.bankdki.co.id', industry: 'Banking', project_description: 'Core banking database upgrades, tuning, and disaster recovery orchestration.', collaboration_since: 2013, order_number: 15, is_featured: false, is_active: true },
  { id: 16, name: 'Bank BTPN', slug: 'bank-btpn', description: 'National private commercial bank in Indonesia.', logo_url: 'https://logo.clearbit.com/btpn.com', website_url: 'https://www.btpn.com', industry: 'Banking', project_description: 'Scalable microservices infrastructure and enterprise database management.', collaboration_since: 2017, order_number: 16, is_featured: false, is_active: true },
  { id: 17, name: 'Bank NISP', slug: 'bank-nisp', description: 'OCBC NISP, one of the oldest private commercial banks in Indonesia.', logo_url: 'https://logo.clearbit.com/ocbcnisp.com', website_url: 'https://www.ocbcnisp.com', industry: 'Banking', project_description: 'Real-time database replication and high-availability systems.', collaboration_since: 2015, order_number: 17, is_featured: false, is_active: true },
  { id: 18, name: 'Bank BNI', slug: 'bank-bni', description: 'State-owned commercial bank, Bank Negara Indonesia.', logo_url: 'https://logo.clearbit.com/bni.co.id', website_url: 'https://www.bni.co.id', industry: 'Banking', project_description: 'Oracle engineered systems administration and database security solutions.', collaboration_since: 2012, order_number: 18, is_featured: true, is_active: true },
  { id: 19, name: 'Askes', slug: 'askes', description: 'Predecessor of BPJS Kesehatan, historical civil servant health insurance.', logo_url: 'https://logo.clearbit.com/bpjs-kesehatan.go.id', website_url: 'https://bpjs-kesehatan.go.id', industry: 'Insurance', project_description: 'Database integration and legacy application migration.', collaboration_since: 2011, order_number: 19, is_featured: false, is_active: true },
  { id: 20, name: 'Indah Kiat Pulp & Paper', slug: 'indah-kiat-pulp-paper', description: 'One of the largest pulp and paper manufacturing companies in Asia.', logo_url: 'https://logo.clearbit.com/app.co.id', website_url: 'https://www.app.co.id', industry: 'Manufacturing', project_description: 'Virtualization and enterprise resource database optimizations.', collaboration_since: 2016, order_number: 20, is_featured: false, is_active: true },
  { id: 21, name: 'Bank Indonesia', slug: 'bank-indonesia', description: 'The central bank of the Republic of Indonesia.', logo_url: 'https://logo.clearbit.com/bi.go.id', website_url: 'https://www.bi.go.id', industry: 'Banking', project_description: 'High-security financial database integration and data integrity audits.', collaboration_since: 2013, order_number: 21, is_featured: true, is_active: true },
  { id: 22, name: 'Semen Indonesia', slug: 'semen-indonesia', description: 'State-owned cement producer and building materials group.', logo_url: 'https://logo.clearbit.com/sig.id', website_url: 'https://sig.id', industry: 'Manufacturing', project_description: 'Industrial supply chain database performance tuning and monitoring.', collaboration_since: 2015, order_number: 22, is_featured: false, is_active: true },
  { id: 23, name: 'BPJS Ketenagakerjaan', slug: 'bpjs-ketenagakerjaan', description: 'Social security agency for workers in Indonesia.', logo_url: 'https://logo.clearbit.com/bpjsketenagakerjaan.go.id', website_url: 'https://www.bpjsketenagakerjaan.go.id', industry: 'Insurance', project_description: 'Oracle database consolidation, security audit, and data warehousing.', collaboration_since: 2014, order_number: 23, is_featured: true, is_active: true },
  { id: 24, name: 'Orang Tua Group (OT)', slug: 'orang-tua-group-ot', description: 'Leading fast-moving consumer goods (FMCG) manufacturer.', logo_url: 'https://logo.clearbit.com/ot.id', website_url: 'https://ot.id', industry: 'FMCG', project_description: 'SD-WAN deployments, corporate network routing, and data replication.', collaboration_since: 2018, order_number: 24, is_featured: false, is_active: true },
  { id: 25, name: 'Jamsostek', slug: 'jamsostek', description: 'Historical state workers social security agency.', logo_url: 'https://logo.clearbit.com/bpjsketenagakerjaan.go.id', website_url: 'https://www.bpjsketenagakerjaan.go.id', industry: 'Insurance', project_description: 'Database server migration and infrastructure support services.', collaboration_since: 2012, order_number: 25, is_featured: false, is_active: true },
  { id: 26, name: 'JNE', slug: 'jne', description: 'Leading express delivery and logistics services company.', logo_url: 'https://logo.clearbit.com/jne.co.id', website_url: 'https://www.jne.co.id', industry: 'Logistics', project_description: 'High-volume transaction database clusters and tracking API integration.', collaboration_since: 2017, order_number: 26, is_featured: false, is_active: true },
  { id: 27, name: 'Sinarmas MSIG Life', slug: 'sinarmas-msig-life', description: 'Joint venture life insurance company in Indonesia.', logo_url: 'https://logo.clearbit.com/sinarmasmsiglife.co.id', website_url: 'https://www.sinarmasmsiglife.co.id', industry: 'Insurance', project_description: 'High-performance database clustering and active-active replication.', collaboration_since: 2016, order_number: 27, is_featured: false, is_active: true },
  { id: 28, name: 'Telkomsel', slug: 'telkomsel', description: 'The largest mobile telecommunications operator in Indonesia.', logo_url: 'https://logo.clearbit.com/telkomsel.com', website_url: 'https://www.telkomsel.com', industry: 'Telecommunication', project_description: 'Engineered system support, database cluster maintenance, and optimization.', collaboration_since: 2013, order_number: 28, is_featured: true, is_active: true },
  { id: 29, name: 'Bank BRI', slug: 'bank-bri', description: 'State-owned commercial bank, Bank Rakyat Indonesia.', logo_url: 'https://logo.clearbit.com/bri.co.id', website_url: 'https://www.bri.co.id', industry: 'Banking', project_description: 'Enterprise data integration, replication, and high-capacity database systems.', collaboration_since: 2012, order_number: 29, is_featured: true, is_active: true },
  { id: 30, name: 'TNI Angkatan Laut', slug: 'tni-angkatan-laut', description: 'Indonesian Navy, branch of the Indonesian National Armed Forces.', logo_url: 'https://logo.clearbit.com/tnial.mil.id', website_url: 'https://www.tnial.mil.id', industry: 'Government', project_description: 'Tactical geolocation integration and custom secure mapping solutions.', collaboration_since: 2019, order_number: 30, is_featured: true, is_active: true },
  { id: 31, name: 'Kementerian Keuangan Republik Indonesia (Bea Cukai)', slug: 'kementerian-keuangan-republik-indonesia-bea-cukai', description: 'Directorate General of Customs and Excise of Indonesia.', logo_url: 'https://logo.clearbit.com/beacukai.go.id', website_url: 'https://www.beacukai.go.id', industry: 'Government', project_description: 'Import-export database tuning, integration, and security controls.', collaboration_since: 2014, order_number: 31, is_featured: true, is_active: true },
  { id: 32, name: 'Direktorat Jenderal Pajak (DJP)', slug: 'direktorat-jenderal-pajak-djp', description: 'Directorate General of Taxes of the Republic of Indonesia.', logo_url: 'https://logo.clearbit.com/pajak.go.id', website_url: 'https://www.pajak.go.id', industry: 'Government', project_description: 'Large-scale database performance optimization and high-availability design.', collaboration_since: 2013, order_number: 32, is_featured: true, is_active: true },
  { id: 33, name: 'BPJS Kesehatan', slug: 'bpjs-health', description: 'Social security agency for healthcare in Indonesia.', logo_url: 'https://logo.clearbit.com/bpjs-kesehatan.go.id', website_url: 'https://bpjs-kesehatan.go.id', industry: 'Insurance', project_description: 'National healthcare database performance optimization and data shielding.', collaboration_since: 2014, order_number: 33, is_featured: true, is_active: true }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync table
    await Client.sync({ alter: true });
    console.log('✅ Clients table synced');

    // Clear existing clients
    await Client.destroy({ where: {}, truncate: true });
    console.log('✅ Cleared existing clients');

    // Bulk create
    await Client.bulkCreate(clients);
    console.log(`✅ Seeded ${clients.length} clients successfully!`);

    await sequelize.close();
    console.log('\n✅ Done! Database connection closed.');
  } catch (error) {
    console.error('❌ Seed error:', error);
    try { await sequelize.close(); } catch(e) {}
    process.exit(1);
  }
}

seed();
