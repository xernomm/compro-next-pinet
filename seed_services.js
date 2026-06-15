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

const Service = sequelize.define('services', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  short_description: { type: DataTypes.TEXT, allowNull: true },
  description: { type: DataTypes.TEXT('long'), allowNull: true },
  icon: { type: DataTypes.STRING(100), allowNull: true },
  image_url: { type: DataTypes.STRING(255), allowNull: true },
  order_number: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

const services = [
  {
    id: 1,
    name: 'Solution Architecture & Design',
    slug: 'solution-architecture-design',
    short_description: 'Business needs analysis and robust infrastructure design for scalable, secure, and high-performance IT environments.',
    description: 'We help you understand business challenges by providing comprehensive needs analysis and targeted technology recommendations. Our services include robust infrastructure design to build scalable, secure, and high-performance system architectures meeting hardware, database, and network requirements.',
    icon: 'fas fa-drafting-compass',
    image_url: null,
    order_number: 1,
    is_active: true
  },
  {
    id: 2,
    name: 'System Implementation & Integration',
    slug: 'system-implementation-integration',
    short_description: 'End-to-end integration of hardware and software components along with automated workflows for operational efficiency.',
    description: 'Providing full system integration to connect various technology components (both hardware and software) to run as a cohesive unit. We handle the deployment and configuration of IT infrastructure (including data centers, networks, and peripheral devices) and develop automated workflows to enhance corporate operational efficiency.',
    icon: 'fas fa-cogs',
    image_url: null,
    order_number: 2,
    is_active: true
  },
  {
    id: 3,
    name: 'Optimization & Maintenance',
    slug: 'optimization-maintenance',
    short_description: 'High-availability performance tuning, end-to-end data security protection, and 24/7 mission-critical technical support.',
    description: 'We ensure your systems run at peak performance (High Availability) backed by real-time data replication technologies. Our services feature end-to-end cybersecurity protection, including data governance, masking, and AI-driven threat mitigation, alongside dedicated 24/7 technical support from our engineering experts.',
    icon: 'fas fa-shield-alt',
    image_url: null,
    order_number: 3,
    is_active: true
  },
  {
    id: 4,
    name: 'Innovative IP Solutions',
    slug: 'innovative-ip-solutions',
    short_description: 'Custom technology development like tactical intelligence and geolocation systems, integrated with AI and data visualization.',
    description: 'We specialize in building tailor-made technology solutions (such as tactical intelligence systems, geolocation mapping, and weapons inventory systems) adapted to the unique needs of government and private sector clients. We also facilitate the adoption of future-ready technologies like AI, voice analysis, and interactive data visualization.',
    icon: 'fas fa-lightbulb',
    image_url: null,
    order_number: 4,
    is_active: true
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync table
    await Service.sync({ alter: true });
    console.log('✅ Services table synced');

    // Clear existing services
    await Service.destroy({ where: {}, truncate: true });
    console.log('✅ Cleared existing services');

    // Bulk create
    await Service.bulkCreate(services);
    console.log(`✅ Seeded ${services.length} services successfully!`);

    await sequelize.close();
    console.log('\n✅ Done! Database connection closed.');
  } catch (error) {
    console.error('❌ Seed error:', error);
    try { await sequelize.close(); } catch(e) {}
    process.exit(1);
  }
}

seed();
