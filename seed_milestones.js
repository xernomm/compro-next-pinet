const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'company_profile',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false,
    define: { timestamps: true, underscored: true, freezeTableName: true },
  }
);

const Milestone = sequelize.define('milestones', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  year: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  icon: { type: DataTypes.STRING(100), allowNull: true },
  image_url: { type: DataTypes.STRING(255), allowNull: true },
  category: { type: DataTypes.ENUM('founding', 'partnership', 'achievement', 'expansion', 'product'), defaultValue: 'achievement' },
  order_number: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
});

const milestones = [
  {
    year: 2010,
    title: 'PT. Prima Integrasi Network Founded',
    description: 'PT. Prima Integrasi Network was established in Jakarta with a bold vision: to become Indonesia\'s most trusted IT System Integrator. Starting with a small but passionate team of engineers, the company set out to deliver enterprise-grade infrastructure solutions for mission-critical business environments.',
    icon: '🏛️',
    category: 'founding',
    order_number: 1,
  },
  {
    year: 2012,
    title: 'Oracle Partnership Established',
    description: 'A pivotal moment — PINET became an official Oracle Partner, gaining access to the world\'s leading enterprise database and infrastructure technologies. This partnership opened doors to serving larger enterprise clients with industry-standard solutions backed by Oracle\'s global ecosystem.',
    icon: '🤝',
    category: 'partnership',
    order_number: 1,
  },
  {
    year: 2014,
    title: 'First Enterprise Data Center Project',
    description: 'Successfully designed and deployed a full-scale enterprise data center solution for a major financial institution in Indonesia. This landmark project established PINET\'s reputation as a reliable infrastructure partner capable of handling complex, high-availability environments.',
    icon: '🏗️',
    category: 'achievement',
    order_number: 1,
  },
  {
    year: 2015,
    title: 'Oracle Gold Partner Status',
    description: 'Earned Oracle Gold Partner certification — a recognition of our deep technical expertise, proven delivery track record, and consistent customer satisfaction scores. This elevated status granted access to advanced Oracle resources, training, and priority support channels.',
    icon: '🥇',
    category: 'partnership',
    order_number: 1,
  },
  {
    year: 2016,
    title: 'Expansion to Cloud Solutions',
    description: 'Recognizing the industry\'s shift toward cloud computing, PINET expanded its portfolio to include hybrid cloud architecture, Oracle Cloud Infrastructure (OCI) deployments, and cloud migration services — helping clients modernize their IT landscape without compromising reliability.',
    icon: '☁️',
    category: 'expansion',
    order_number: 1,
  },
  {
    year: 2018,
    title: '100+ Enterprise Clients Milestone',
    description: 'Crossed the milestone of serving 100+ enterprise clients across banking, telecommunications, manufacturing, and government sectors. This achievement reflected PINET\'s growing reputation as a trusted systems integrator in the Indonesian market.',
    icon: '💯',
    category: 'achievement',
    order_number: 1,
  },
  {
    year: 2019,
    title: 'Oracle Engineered Systems Specialist',
    description: 'Achieved Oracle Engineered Systems specialization, becoming one of the few certified partners in Indonesia with deep expertise in Oracle Exadata, Oracle Database Appliance (ODA), and Oracle ZFS Storage — delivering maximum performance for data-intensive workloads.',
    icon: '⚙️',
    category: 'product',
    order_number: 1,
  },
  {
    year: 2020,
    title: 'Digital Transformation During Pandemic',
    description: 'Rapidly pivoted to support clients\' emergency digital transformation needs during the COVID-19 pandemic. Delivered remote infrastructure setups, VPN solutions, and cloud migrations that enabled business continuity for critical operations across Indonesia.',
    icon: '🌐',
    category: 'achievement',
    order_number: 1,
  },
  {
    year: 2022,
    title: '10th Anniversary & Office Expansion',
    description: 'Celebrated a decade of Oracle partnership with a new, expanded office space in Jakarta. The anniversary marked PINET\'s maturation from a startup to a mid-sized systems integrator with a team of 50+ specialized engineers and consultants.',
    icon: '🎉',
    category: 'expansion',
    order_number: 1,
  },
  {
    year: 2023,
    title: 'Oracle Cloud Infrastructure Focus',
    description: 'Deepened commitment to Oracle Cloud Infrastructure (OCI) with dedicated OCI consulting and managed services practice. Helped multiple government agencies and enterprises migrate workloads to OCI, achieving significant cost savings and improved scalability.',
    icon: '🚀',
    category: 'product',
    order_number: 1,
  },
  {
    year: 2024,
    title: '300+ Projects Delivered',
    description: 'Surpassed 300 successfully completed projects — spanning database consolidation, infrastructure modernization, disaster recovery, and cloud migration. Each project reinforced PINET\'s position as a battle-tested technology partner.',
    icon: '📊',
    category: 'achievement',
    order_number: 1,
  },
  {
    year: 2025,
    title: 'AI & Autonomous Database Initiative',
    description: 'Launched a strategic initiative around Oracle Autonomous Database and AI-powered infrastructure management. Positioned to help clients leverage machine learning and autonomous operations for next-generation IT environments.',
    icon: '🤖',
    category: 'product',
    order_number: 1,
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync the milestones table (create if not exists)
    await Milestone.sync({ alter: true });
    console.log('✅ Milestones table synced');

    // Check existing count
    const existingCount = await Milestone.count();
    if (existingCount > 0) {
      console.log(`⚠️  Milestones table already has ${existingCount} records. Skipping seed.`);
      console.log('   To re-seed, delete existing records first.');
      await sequelize.close();
      return;
    }

    // Bulk create
    await Milestone.bulkCreate(milestones);
    console.log(`✅ Seeded ${milestones.length} milestones successfully!`);

    // List them
    const all = await Milestone.findAll({ order: [['year', 'ASC']] });
    console.log('\n📋 Seeded milestones:');
    all.forEach(m => {
      console.log(`   ${m.year} | ${m.icon} ${m.title} [${m.category}]`);
    });

    await sequelize.close();
    console.log('\n✅ Done! Database connection closed.');
  } catch (error) {
    console.error('❌ Seed error:', error);
    await sequelize.close();
    process.exit(1);
  }
}

seed();
