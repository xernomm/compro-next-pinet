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

const Event = sequelize.define('events', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  slug: { type: DataTypes.STRING(300), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT('long'), allowNull: true },
  event_type: {
    type: DataTypes.ENUM('seminar', 'workshop', 'conference', 'webinar', 'training', 'exhibition', 'other'),
    defaultValue: 'seminar'
  },
  start_date: { type: DataTypes.DATE, allowNull: false },
  end_date: { type: DataTypes.DATE, allowNull: true },
  start_time: { type: DataTypes.TIME, allowNull: true },
  end_time: { type: DataTypes.TIME, allowNull: true },
  location: { type: DataTypes.STRING(255), allowNull: true },
  venue: { type: DataTypes.STRING(255), allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },
  is_online: { type: DataTypes.BOOLEAN, defaultValue: false },
  meeting_link: { type: DataTypes.STRING(255), allowNull: true },
  featured_image: { type: DataTypes.STRING(255), allowNull: true },
  gallery: { type: DataTypes.TEXT, allowNull: true },
  organizer: { type: DataTypes.STRING(100), allowNull: true },
  contact_person: { type: DataTypes.STRING(100), allowNull: true },
  contact_email: { type: DataTypes.STRING(100), allowNull: true },
  contact_phone: { type: DataTypes.STRING(50), allowNull: true },
  registration_url: { type: DataTypes.STRING(255), allowNull: true },
  max_participants: { type: DataTypes.INTEGER, allowNull: true },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: {
    type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
    defaultValue: 'upcoming'
  }
});

const events = [
  {
    title: 'Oracle Cloud Infrastructure (OCI) Modernization Workshop 2026',
    slug: 'oracle-cloud-infrastructure-oci-modernization-workshop-2026',
    description: 'Learn how to optimize database workloads and deploy hybrid cloud configurations on Oracle Cloud Infrastructure (OCI). This hands-on workshop led by PINET senior engineers is designed for IT admins, database administrators, and cloud architects.',
    event_type: 'workshop',
    start_date: new Date('2026-07-15'),
    end_date: new Date('2026-07-15'),
    start_time: '09:00:00',
    end_time: '15:00:00',
    location: 'Jakarta',
    venue: 'PINET Enterprise Training Center',
    address: 'Gedung PINET Lt. 4, Jl. Jend. Sudirman No. 21, Jakarta Selatan',
    is_online: false,
    meeting_link: null,
    featured_image: '/assets/images/events/oci-workshop-2026.jpg',
    gallery: JSON.stringify(['/assets/images/events/oci-workshop-gallery1.jpg']),
    organizer: 'PT. Prima Integrasi Network',
    contact_person: 'Ayu Rejeki',
    contact_email: 'ayurejeki249@gmail.com',
    contact_phone: '+6281234567890',
    registration_url: 'https://pinet.co.id/events/oci-workshop-2026/register',
    max_participants: 30,
    is_featured: true,
    is_published: true,
    status: 'upcoming'
  },
  {
    title: 'Indonesia Enterprise AI Summit 2026',
    slug: 'indonesia-enterprise-ai-summit-2026',
    description: 'Discover how modern enterprises and government agencies in Indonesia are leveraging artificial intelligence. Co-hosted by PINET, Oracle, and IBM, this summit features keynote speakers, case studies on GovTech, and panel discussions on AI-driven cybersecurity.',
    event_type: 'conference',
    start_date: new Date('2026-08-20'),
    end_date: new Date('2026-08-20'),
    start_time: '08:30:00',
    end_time: '17:00:00',
    location: 'Jakarta',
    venue: 'Grand Ballroom, Hotel Indonesia Kempinski',
    address: 'Jl. MH Thamrin No. 1, Menteng, Jakarta Pusat',
    is_online: false,
    meeting_link: null,
    featured_image: '/assets/images/events/ai-summit-2026.jpg',
    gallery: JSON.stringify(['/assets/images/events/ai-summit-gallery1.jpg']),
    organizer: 'PT. Prima Integrasi Network & Oracle Indonesia',
    contact_person: 'Ayu Rejeki',
    contact_email: 'ayurejeki249@gmail.com',
    contact_phone: '+6281234567890',
    registration_url: 'https://pinet.co.id/events/ai-summit-2026/register',
    max_participants: 200,
    is_featured: true,
    is_published: true,
    status: 'upcoming'
  },
  {
    title: 'Masterclass: Securing Enterprise Hybrid Cloud with AI-Driven Threat Hunting',
    slug: 'masterclass-securing-hybrid-cloud-ai-threat-hunting',
    description: 'In an era of rising cybersecurity challenges, traditional network perimeters are no longer enough. Join our technical webinar with cybersecurity experts from Cisco and Trend Micro as they demo AI-driven security detection and autonomous threat response.',
    event_type: 'webinar',
    start_date: new Date('2026-09-10'),
    end_date: new Date('2026-09-10'),
    start_time: '14:00:00',
    end_time: '16:00:00',
    location: 'Online',
    venue: 'Zoom Webinar',
    address: null,
    is_online: true,
    meeting_link: 'https://zoom.us/j/9876543210',
    featured_image: '/assets/images/events/cybersecurity-webinar-2026.jpg',
    gallery: null,
    organizer: 'PT. Prima Integrasi Network',
    contact_person: 'Ayu Rejeki',
    contact_email: 'ayurejeki249@gmail.com',
    contact_phone: '+6281234567890',
    registration_url: 'https://pinet.co.id/events/cybersecurity-webinar-2026/register',
    max_participants: 500,
    is_featured: false,
    is_published: true,
    status: 'upcoming'
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync table
    await Event.sync({ alter: true });
    console.log('✅ Events table synced');

    // Clear existing events
    await Event.destroy({ where: {}, truncate: true });
    console.log('✅ Cleared existing events');

    // Bulk create
    await Event.bulkCreate(events);
    console.log(`✅ Seeded ${events.length} events successfully!`);

    await sequelize.close();
    console.log('\n✅ Done! Database connection closed.');
  } catch (error) {
    console.error('❌ Seed error:', error);
    try { await sequelize.close(); } catch(e) {}
    process.exit(1);
  }
}

seed();
