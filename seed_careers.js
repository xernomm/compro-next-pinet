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

const Career = sequelize.define('careers', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  job_title: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  department: { type: DataTypes.STRING(100), allowNull: true },
  location: { type: DataTypes.STRING(100), allowNull: true },
  employment_type: {
    type: DataTypes.ENUM('full_time', 'part_time', 'contract', 'internship', 'freelance'),
    defaultValue: 'full_time'
  },
  experience_level: {
    type: DataTypes.ENUM('entry', 'junior', 'mid', 'senior', 'lead', 'manager'),
    allowNull: true
  },
  salary_range: { type: DataTypes.STRING(100), allowNull: true },
  description: { type: DataTypes.TEXT('long'), allowNull: false },
  responsibilities: { type: DataTypes.TEXT('long'), allowNull: true },
  requirements: { type: DataTypes.TEXT('long'), allowNull: true },
  qualifications: { type: DataTypes.TEXT, allowNull: true },
  benefits: { type: DataTypes.TEXT, allowNull: true },
  application_deadline: { type: DataTypes.DATE, allowNull: true },
  posted_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  contact_email: { type: DataTypes.STRING(100), allowNull: true },
  application_url: { type: DataTypes.STRING(255), allowNull: true },
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  status: {
    type: DataTypes.ENUM('open', 'closed', 'on_hold'),
    defaultValue: 'open'
  }
});

const careers = [
  {
    job_title: 'Senior Oracle Database Administrator (DBA)',
    slug: 'senior-oracle-database-administrator-dba',
    department: 'Infrastructure',
    location: 'Jakarta (Hybrid)',
    employment_type: 'full_time',
    experience_level: 'senior',
    salary_range: 'Rp 18.000.000 - Rp 25.000.000',
    description: 'PT. Prima Integrasi Network is seeking an experienced Senior Oracle DBA to oversee, design, and optimize our enterprise customers\' database infrastructure. You will work on-site and remotely with high-availability systems including Oracle Exadata, RAC, and OCI.',
    responsibilities: JSON.stringify([
      'Manage, configure, and maintain multi-tenant Oracle database environments',
      'Implement high availability database architectures using Oracle Real Application Clusters (RAC) and Data Guard',
      'Diagnose, troubleshoot, and resolve complex database performance issues',
      'Perform backup and recovery operations using Oracle Recovery Manager (RMAN)',
      'Collaborate with cloud engineers to manage databases on OCI'
    ]),
    requirements: JSON.stringify([
      '5+ years of active experience as an Oracle Database Administrator',
      'Strong knowledge of Oracle database architecture, ASM, RAC, and GoldenGate',
      'Proven experience with performance tuning, query optimization, and capacity planning',
      'Experience with cloud platforms (specifically OCI) is highly desired',
      'Strong English communication skills'
    ]),
    qualifications: JSON.stringify([
      'Bachelor\'s degree in Computer Science, Information Technology, or related disciplines',
      'Oracle Database Administration Certified Professional (OCP) certification is highly preferred'
    ]),
    benefits: JSON.stringify([
      'Competitive salary and performance bonuses',
      'Comprehensive family health insurance',
      'Professional development and database certifications sponsored by PINET',
      'Flexible hybrid working arrangement'
    ]),
    application_deadline: new Date('2026-08-31T23:59:59Z'),
    posted_date: new Date('2026-06-15T12:00:00Z'),
    contact_email: 'careers@pinet.co.id',
    application_url: 'https://pinet.co.id/careers/apply/senior-oracle-dba',
    views: 12,
    is_featured: true,
    is_active: true,
    status: 'open'
  },
  {
    job_title: 'Cloud Infrastructure Engineer (OCI & Hybrid Cloud)',
    slug: 'cloud-infrastructure-engineer-oci-hybrid-cloud',
    department: 'Cloud Operations',
    location: 'Jakarta',
    employment_type: 'full_time',
    experience_level: 'mid',
    salary_range: 'Rp 12.000.000 - Rp 17.000.000',
    description: 'We are looking for a Cloud Infrastructure Engineer to design, deploy, and manage public and hybrid cloud solutions. In this role, you will be instrumental in migrating on-premise infrastructure to Oracle Cloud Infrastructure (OCI) and VMware for enterprise clients.',
    responsibilities: JSON.stringify([
      'Provision, configure, and manage cloud infrastructure elements on OCI',
      'Migrate on-premise servers, storage, and networking to OCI',
      'Develop infrastructure as code scripts using Terraform',
      'Monitor cloud environments and optimize costs and resources',
      'Provide third-level support for cloud-related incidents'
    ]),
    requirements: JSON.stringify([
      '3+ years of experience in system engineering, virtualization, or cloud administration',
      'Hands-on experience configuring OCI, AWS, or Azure services',
      'Familiarity with Infrastructure as Code (IaC) tools like Terraform',
      'Understanding of network topology, DNS, and secure VPN setup',
      'Ability to work collaboratively in a team environment'
    ]),
    qualifications: JSON.stringify([
      'Bachelor\'s degree in Computer Engineering, Network Engineering, or related fields',
      'OCI Cloud Architect Associate certification is a strong plus'
    ]),
    benefits: JSON.stringify([
      'Competitive base salary',
      'Health and dental coverage',
      'Sponsorship for OCI, VMware, or Red Hat certifications',
      'Career advancement paths in cloud architecture'
    ]),
    application_deadline: new Date('2026-09-15T23:59:59Z'),
    posted_date: new Date('2026-06-15T12:00:00Z'),
    contact_email: 'careers@pinet.co.id',
    application_url: 'https://pinet.co.id/careers/apply/cloud-infrastructure-engineer',
    views: 8,
    is_featured: false,
    is_active: true,
    status: 'open'
  },
  {
    job_title: 'Enterprise AI Solutions Engineer',
    slug: 'enterprise-ai-solutions-engineer',
    department: 'Data & AI',
    location: 'Jakarta (Hybrid)',
    employment_type: 'full_time',
    experience_level: 'mid',
    salary_range: 'Rp 14.000.000 - Rp 20.000.000',
    description: 'Join our newly formed Data & AI practice. As an Enterprise AI Solutions Engineer, you will build, integrate, and deploy advanced AI solutions, including Retrieval-Augmented Generation (RAG) and LLM-based agents using platforms like IBM watsonx for our clients.',
    responsibilities: JSON.stringify([
      'Develop and integrate AI agents and LLMs into client software platforms',
      'Design and maintain vectorized databases and RAG pipelines',
      'Collaborate with data engineers to ingest, clean, and structure text datasets',
      'Conduct testing and benchmarking of model latency and accuracy',
      'Build custom client prototypes and demos'
    ]),
    requirements: JSON.stringify([
      '2+ years of professional development experience using Python',
      'Hands-on experience with LLM frameworks (LangChain, LlamaIndex, or AutoGen)',
      'Experience with vector databases such as Milvus, Pinecone, or pgvector',
      'Familiarity with containerized applications (Docker) and RESTful APIs',
      'Strong analytical skills and passion for artificial intelligence'
    ]),
    qualifications: JSON.stringify([
      'Bachelor\'s degree in Data Science, Computer Science, Statistics, or equivalent analytical field',
      'Demonstrated GitHub portfolio of AI or machine learning projects'
    ]),
    benefits: JSON.stringify([
      'Competitive salary and flexible working hours',
      'Opportunities to work on cutting-edge AI and agentic software',
      'Health and wellness allowance',
      'Ongoing learning resources and conference attendance support'
    ]),
    application_deadline: new Date('2026-08-15T23:59:59Z'),
    posted_date: new Date('2026-06-15T12:00:00Z'),
    contact_email: 'careers@pinet.co.id',
    application_url: 'https://pinet.co.id/careers/apply/enterprise-ai-solutions-engineer',
    views: 15,
    is_featured: true,
    is_active: true,
    status: 'open'
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync table
    await Career.sync({ alter: true });
    console.log('✅ Careers table synced');

    // Clear existing careers
    await Career.destroy({ where: {}, truncate: true });
    console.log('✅ Cleared existing careers');

    // Bulk create
    await Career.bulkCreate(careers);
    console.log(`✅ Seeded ${careers.length} careers successfully!`);

    await sequelize.close();
    console.log('\n✅ Done! Database connection closed.');
  } catch (error) {
    console.error('❌ Seed error:', error);
    try { await sequelize.close(); } catch(e) {}
    process.exit(1);
  }
}

seed();
