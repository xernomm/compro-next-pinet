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

const Partner = sequelize.define('partners', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  logo_url: { type: DataTypes.STRING(255), allowNull: true },
  website_url: { type: DataTypes.STRING(255), allowNull: true },
  partnership_type: { type: DataTypes.STRING(100), allowNull: true },
  partnership_since: { type: DataTypes.INTEGER, allowNull: true },
  order_number: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

const partners = [
  { id: 1, name: 'VMware', slug: 'vmware', description: 'Enterprise virtualization and multi-cloud solutions.', logo_url: 'https://logo.clearbit.com/vmware.com', website_url: 'https://www.vmware.com', partnership_type: 'Technology Partner', partnership_since: 2015, order_number: 1, is_active: true },
  { id: 2, name: 'Lenovo', slug: 'lenovo', description: 'Reliable enterprise servers, storage, and computing systems.', logo_url: 'https://logo.clearbit.com/lenovo.com', website_url: 'https://www.lenovo.com', partnership_type: 'Hardware Partner', partnership_since: 2016, order_number: 2, is_active: true },
  { id: 3, name: 'MapR Data Technologies', slug: 'mapr-data-technologies', description: 'Converged data platform for big data and real-time analytics.', logo_url: 'https://logo.clearbit.com/mapr.com', website_url: 'https://www.mapr.com', partnership_type: 'Data & AI Partner', partnership_since: 2017, order_number: 3, is_active: true },
  { id: 4, name: 'Huawei', slug: 'huawei', description: 'Global information and communications technology infrastructure.', logo_url: 'https://logo.clearbit.com/huawei.com', website_url: 'https://e.huawei.com', partnership_type: 'Hardware & Network Partner', partnership_since: 2018, order_number: 4, is_active: true },
  { id: 5, name: 'Hewlett Packard Enterprise', slug: 'hewlett-packard-enterprise', description: 'Edge-to-cloud platform as-a-service and enterprise IT systems.', logo_url: 'https://logo.clearbit.com/hpe.com', website_url: 'https://www.hpe.com', partnership_type: 'Hardware Partner', partnership_since: 2014, order_number: 5, is_active: true },
  { id: 6, name: 'watsonx', slug: 'watsonx', description: 'IBM next-generation AI and data platform for enterprise.', logo_url: 'https://logo.clearbit.com/ibm.com', website_url: 'https://www.ibm.com/watsonx', partnership_type: 'Data & AI Partner', partnership_since: 2023, order_number: 6, is_active: true },
  { id: 7, name: 'IBM Spectrum Storage', slug: 'ibm-spectrum-storage', description: 'Software-defined storage and data protection architecture.', logo_url: 'https://logo.clearbit.com/ibm.com', website_url: 'https://www.ibm.com', partnership_type: 'Storage Partner', partnership_since: 2015, order_number: 7, is_active: true },
  { id: 8, name: 'Citrix', slug: 'citrix', description: 'Digital workspace and secure application delivery solution.', logo_url: 'https://logo.clearbit.com/citrix.com', website_url: 'https://www.citrix.com', partnership_type: 'Virtualization Partner', partnership_since: 2016, order_number: 8, is_active: true },
  { id: 9, name: 'METIS', slug: 'metis', description: 'Advanced defense technology, mapping, and security solutions.', logo_url: 'https://logo.clearbit.com/metis.io', website_url: 'https://metis.io', partnership_type: 'Strategic IP Partner', partnership_since: 2021, order_number: 9, is_active: true },
  { id: 10, name: 'Office 365', slug: 'office-365', description: 'Microsoft productivity and cloud-based collaboration suite.', logo_url: 'https://logo.clearbit.com/office.com', website_url: 'https://www.office.com', partnership_type: 'Collaboration Partner', partnership_since: 2014, order_number: 10, is_active: true },
  { id: 11, name: 'SAS', slug: 'sas', description: 'Enterprise analytics, business intelligence, and data management software.', logo_url: 'https://logo.clearbit.com/sas.com', website_url: 'https://www.sas.com', partnership_type: 'Analytics Partner', partnership_since: 2018, order_number: 11, is_active: true },
  { id: 12, name: 'Couchbase', slug: 'couchbase', description: 'High-performance distributed NoSQL document database.', logo_url: 'https://logo.clearbit.com/couchbase.com', website_url: 'https://www.couchbase.com', partnership_type: 'Database Partner', partnership_since: 2019, order_number: 12, is_active: true },
  { id: 13, name: 'Microsoft Power BI', slug: 'microsoft-power-bi', description: 'Interactive data visualization and business intelligence tool.', logo_url: 'https://logo.clearbit.com/microsoft.com', website_url: 'https://powerbi.microsoft.com', partnership_type: 'Analytics Partner', partnership_since: 2017, order_number: 13, is_active: true },
  { id: 14, name: 'Tableau', slug: 'tableau', description: 'Leading analytics platform for visual business intelligence.', logo_url: 'https://logo.clearbit.com/tableau.com', website_url: 'https://www.tableau.com', partnership_type: 'Analytics Partner', partnership_since: 2016, order_number: 14, is_active: true },
  { id: 15, name: 'Splunk', slug: 'splunk', description: 'Data-to-everything platform for security, observability, and log analysis.', logo_url: 'https://logo.clearbit.com/splunk.com', website_url: 'https://www.splunk.com', partnership_type: 'Security & Observability Partner', partnership_since: 2018, order_number: 15, is_active: true },
  { id: 16, name: 'Oracle', slug: 'oracle', description: 'Comprehensive cloud applications, database, and platform services.', logo_url: 'https://logo.clearbit.com/oracle.com', website_url: 'https://www.oracle.com', partnership_type: 'Principal Database & Cloud Partner', partnership_since: 2012, order_number: 16, is_active: true },
  { id: 17, name: 'Apache Spark', slug: 'apache-spark', description: 'Unified engine for large-scale data processing and machine learning.', logo_url: 'https://logo.clearbit.com/spark.apache.org', website_url: 'https://spark.apache.org', partnership_type: 'Open Source Partner', partnership_since: 2018, order_number: 17, is_active: true },
  { id: 18, name: 'TOAD', slug: 'toad', description: 'Database management toolset for database developers and DBAs.', logo_url: 'https://logo.clearbit.com/quest.com', website_url: 'https://www.quest.com/toad', partnership_type: 'Database Tooling Partner', partnership_since: 2013, order_number: 18, is_active: true },
  { id: 19, name: 'IBM DB2', slug: 'ibm-db2', description: 'Enterprise relational database management system from IBM.', logo_url: 'https://logo.clearbit.com/ibm.com', website_url: 'https://www.ibm.com/db2', partnership_type: 'Database Partner', partnership_since: 2015, order_number: 19, is_active: true },
  { id: 20, name: 'TigerGraph', slug: 'tigergraph', description: 'Scalable enterprise graph database platform for deep analytics.', logo_url: 'https://logo.clearbit.com/tigergraph.com', website_url: 'https://www.tigergraph.com', partnership_type: 'Database Partner', partnership_since: 2020, order_number: 20, is_active: true },
  { id: 21, name: 'Apache Drill', slug: 'apache-drill', description: 'Schema-free SQL query engine for Big Data and NoSQL sources.', logo_url: 'https://logo.clearbit.com/drill.apache.org', website_url: 'https://drill.apache.org', partnership_type: 'Open Source Partner', partnership_since: 2019, order_number: 21, is_active: true },
  { id: 22, name: 'Cisco', slug: 'cisco', description: 'Global leader in networking, secure connectivity, and routing infrastructure.', logo_url: 'https://logo.clearbit.com/cisco.com', website_url: 'https://www.cisco.com', partnership_type: 'Networking & Security Partner', partnership_since: 2013, order_number: 22, is_active: true },
  { id: 23, name: 'Trend Micro', slug: 'trend-micro', description: 'Global leader in cybersecurity and cloud threat defense.', logo_url: 'https://logo.clearbit.com/trendmicro.com', website_url: 'https://www.trendmicro.com', partnership_type: 'Security Partner', partnership_since: 2016, order_number: 23, is_active: true },
  { id: 24, name: 'Oracle GoldenGate', slug: 'oracle-golden-gate', description: 'Real-time data integration and replication platform.', logo_url: 'https://logo.clearbit.com/oracle.com', website_url: 'https://www.oracle.com/integration/goldengate', partnership_type: 'Principal Integration Partner', partnership_since: 2012, order_number: 24, is_active: true },
  { id: 25, name: 'Juniper Networks', slug: 'juniper-networks', description: 'AI-driven network security and high-performance routing.', logo_url: 'https://logo.clearbit.com/juniper.net', website_url: 'https://www.juniper.net', partnership_type: 'Networking Partner', partnership_since: 2015, order_number: 25, is_active: true },
  { id: 26, name: 'Oracle Autonomous Database', slug: 'oracle-autonomous-database', description: 'Self-driving, self-securing, self-repairing cloud database.', logo_url: 'https://logo.clearbit.com/oracle.com', website_url: 'https://www.oracle.com/autonomous-database', partnership_type: 'Principal Database & Cloud Partner', partnership_since: 2019, order_number: 26, is_active: true },
  { id: 27, name: 'Apache Kafka', slug: 'apache-kafka', description: 'Distributed event streaming platform for high-performance data pipelines.', logo_url: 'https://logo.clearbit.com/kafka.apache.org', website_url: 'https://kafka.apache.org', partnership_type: 'Open Source Partner', partnership_since: 2018, order_number: 27, is_active: true },
  { id: 28, name: 'Red Hat', slug: 'red-hat', description: 'World\'s leading provider of enterprise open source solutions.', logo_url: 'https://logo.clearbit.com/redhat.com', website_url: 'https://www.redhat.com', partnership_type: 'Open Source Enterprise Partner', partnership_since: 2015, order_number: 28, is_active: true },
  { id: 29, name: 'Oracle SOA', slug: 'oracle-soa', description: 'Service-Oriented Architecture suite for application integration.', logo_url: 'https://logo.clearbit.com/oracle.com', website_url: 'https://www.oracle.com/middleware/technologies/soasuite', partnership_type: 'Principal Integration Partner', partnership_since: 2012, order_number: 29, is_active: true },
  { id: 30, name: '3scale', slug: '3scale', description: 'Red Hat API management platform for infrastructure scaling.', logo_url: 'https://logo.clearbit.com/3scale.net', website_url: 'https://www.3scale.net', partnership_type: 'API Management Partner', partnership_since: 2017, order_number: 30, is_active: true },
  { id: 31, name: 'Microsoft Hyper-V', slug: 'microsoft-hyper-v', description: 'Enterprise hardware virtualization hypervisor.', logo_url: 'https://logo.clearbit.com/microsoft.com', website_url: 'https://www.microsoft.com', partnership_type: 'Virtualization Partner', partnership_since: 2014, order_number: 31, is_active: true },
  { id: 32, name: 'Dell EMC', slug: 'dell-emc', description: 'Enterprise storage, converged infrastructure, and servers.', logo_url: 'https://logo.clearbit.com/dell.com', website_url: 'https://www.dell.com', partnership_type: 'Hardware & Storage Partner', partnership_since: 2015, order_number: 32, is_active: true },
  { id: 33, name: 'Canonical', slug: 'canonical', description: 'Publisher of Ubuntu, delivering enterprise open-source security.', logo_url: 'https://logo.clearbit.com/canonical.com', website_url: 'https://canonical.com', partnership_type: 'Open Source Partner', partnership_since: 2017, order_number: 33, is_active: true },
  { id: 34, name: 'Informatica', slug: 'informatica', description: 'Enterprise cloud data management and data integration.', logo_url: 'https://logo.clearbit.com/informatica.com', website_url: 'https://www.informatica.com', partnership_type: 'Data Integration Partner', partnership_since: 2018, order_number: 34, is_active: true }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync table
    await Partner.sync({ alter: true });
    console.log('✅ Partners table synced');

    // Clear existing partners
    await Partner.destroy({ where: {}, truncate: true });
    console.log('✅ Cleared existing partners');

    // Bulk create
    await Partner.bulkCreate(partners);
    console.log(`✅ Seeded ${partners.length} partners successfully!`);

    await sequelize.close();
    console.log('\n✅ Done! Database connection closed.');
  } catch (error) {
    console.error('❌ Seed error:', error);
    try { await sequelize.close(); } catch(e) {}
    process.exit(1);
  }
}

seed();
