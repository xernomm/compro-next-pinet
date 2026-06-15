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

const Product = sequelize.define('products', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  category: { type: DataTypes.STRING(100), allowNull: true },
  short_description: { type: DataTypes.TEXT, allowNull: true },
  description: { type: DataTypes.TEXT('long'), allowNull: true },
  features: { type: DataTypes.TEXT('long'), allowNull: true },
  benefits: { type: DataTypes.TEXT, allowNull: true },
  specifications: { type: DataTypes.TEXT('long'), allowNull: true },
  target_segment: { type: DataTypes.STRING(255), allowNull: true },
  image_url: { type: DataTypes.STRING(255), allowNull: true },
  gallery: { type: DataTypes.TEXT, allowNull: true },
  brochure_url: { type: DataTypes.STRING(255), allowNull: true },
  video_url: { type: DataTypes.STRING(255), allowNull: true },
  price_range: { type: DataTypes.STRING(100), allowNull: true },
  order_number: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  meta_title: { type: DataTypes.STRING(255), allowNull: true },
  meta_description: { type: DataTypes.TEXT, allowNull: true }
});

const products = [
  {
    id: 1,
    name: 'Data',
    slug: 'data',
    category: 'Data & Analytics',
    short_description: 'Enterprise data solutions including database management, governance, warehousing, integration, and AI-ready architectures.',
    description: 'Our Data Solutions help enterprises securely store, organize, govern, and analyze their mission-critical information. We specialize in high-performance Oracle Database administration, secure database consolidation, real-time data replication, data warehousing, and modern analytics platforms. We enable organizations to maintain 24/7 availability and turn raw operational data into actionable, compliance-ready business intelligence.',
    features: JSON.stringify([
      "Oracle Database Administration & Tuning",
      "Real-Time Data Integration & ETL",
      "Enterprise Data Warehousing & Big Data",
      "Data Governance, Security & Auditing"
    ]),
    benefits: JSON.stringify([
      "Ensures 99.999% database uptime and reliability",
      "Reduces database licensing and hardware footprints",
      "Unlocks fast, analytics-driven decision-making",
      "Ensures compliance with national data privacy regulations"
    ]),
    specifications: JSON.stringify({
      "Database Supported": ["Oracle 19c/23c", "MySQL Enterprise", "PostgreSQL"],
      "Data Integration": ["Oracle GoldenGate", "Microsoft SSIS"],
      "Platform Readiness": ["Cloud-native", "On-Premise", "Hybrid Hybrid-Cloud"]
    }),
    target_segment: 'Financial Institutions, Government Agencies, Telcos, Large Enterprises',
    image_url: null,
    gallery: '[]',
    brochure_url: null,
    video_url: null,
    price_range: 'Enterprise Grade',
    order_number: 1,
    is_featured: true,
    is_active: true,
    meta_title: 'Enterprise Data & Database Solutions | PINET',
    meta_description: 'Maximize database performance, governance, and analytics with PINET enterprise data solutions. Certified Oracle database services.'
  },
  {
    id: 2,
    name: 'Infrastructure',
    slug: 'infrastructure',
    category: 'IT Infrastructure',
    short_description: 'High-performance computing, virtualization, hyperconverged infrastructure, storage, and hybrid cloud orchestration.',
    description: 'We design, deploy, and manage robust, resilient IT infrastructure optimized for mission-critical enterprise workloads. Leveraging partnership architectures like Oracle Engineered Systems (Exadata, ODA), hyperconverged infrastructure (HCI), enterprise storage arrays, and secure virtualization, we build the foundation of your digital transformation. Our solutions guarantee sub-second transaction performance, robust data protection, and seamless migration pathways to public, private, or hybrid clouds.',
    features: JSON.stringify([
      "Oracle Engineered Systems (Exadata, ODA)",
      "Hyperconverged Infrastructure (HCI)",
      "Enterprise SAN & NAS Storage Arrays",
      "Hybrid Cloud Integration & Orchestration"
    ]),
    benefits: JSON.stringify([
      "Sub-second database performance and response times",
      "Simplified infrastructure operations and lower overhead",
      "Highly scalable compute and storage capacity",
      "Fast, non-disruptive cloud migration pathways"
    ]),
    specifications: JSON.stringify({
      "Engineered Systems": ["Oracle Exadata", "Oracle Database Appliance"],
      "HCI Solutions": ["VMware vSAN", "Nutanix"],
      "Storage Platforms": ["Oracle ZFS", "Dell EMC", "HPE"]
    }),
    target_segment: 'Banks, Government, Healthcare, Enterprise Data Centers',
    image_url: null,
    gallery: '[]',
    brochure_url: null,
    video_url: null,
    price_range: 'Enterprise Grade',
    order_number: 2,
    is_featured: true,
    is_active: true,
    meta_title: 'Mission-Critical IT Infrastructure Solutions | PINET',
    meta_description: 'Build a reliable, scalable foundation with PINET IT Infrastructure solutions, featuring Oracle Exadata, ODA, HCI, and hybrid cloud.'
  },
  {
    id: 3,
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    category: 'Security & Compliance',
    short_description: 'Comprehensive security architectures covering network defenses, identity access management, endpoints, threat hunting, and compliance.',
    description: 'Protect your digital enterprise assets and user identities with our comprehensive security systems. PINET delivers end-to-end security architectures covering Next-Generation Firewalls, Identity & Access Management (IAM), Endpoint Detection & Response (EDR), and Cloud Security controls. We help you establish proactive security policies, secure remote working environments, and implement Security Operations Center (SOC) practices to identify, block, and mitigate emerging cyber threats in real-time.',
    features: JSON.stringify([
      "Next-Generation Firewalls & Intrusion Prevention",
      "Identity & Access Management (IAM / MFA)",
      "Endpoint Detection & Incident Response (EDR)",
      "Security Information & Event Management (SIEM)"
    ]),
    benefits: JSON.stringify([
      "Prevents data breaches and malware incidents",
      "Secures remote access for hybrid workforces",
      "Achieves strict industry compliance standards",
      "Provides real-time visibility and threat monitoring"
    ]),
    specifications: JSON.stringify({
      "Firewall Partners": ["Fortinet", "Palo Alto", "Cisco"],
      "IAM Technologies": ["MFA", "Single Sign-On (SSO)", "Privileged Access"],
      "EDR Solutions": ["CrowdStrike", "SentinelOne"]
    }),
    target_segment: 'E-Commerce, Banking, Logistics, Multi-Branch Corporates',
    image_url: null,
    gallery: '[]',
    brochure_url: null,
    video_url: null,
    price_range: 'Enterprise Grade',
    order_number: 3,
    is_featured: true,
    is_active: true,
    meta_title: 'Enterprise Cybersecurity & Threat Mitigation | PINET',
    meta_description: 'Safeguard your corporate network, endpoints, and user access with PINET end-to-end cybersecurity systems and compliance services.'
  },
  {
    id: 4,
    name: 'Network & Connectivity',
    slug: 'network-connectivity',
    category: 'Networking & SD-WAN',
    short_description: 'Enterprise-grade networking, Software-Defined WAN (SD-WAN), campus wireless, core routing, and switching infrastructure.',
    description: 'Achieve seamless, high-speed, and secure connectivity across your branches, head office, data centers, and cloud applications. We provide comprehensive network design, high-performance routing and switching, Software-Defined WAN (SD-WAN) integration, secure campus-wide wireless networks, and intelligent network management. Our connectivity architectures ensure maximum bandwidth efficiency, automatic link failover, and end-to-end payload encryption.',
    features: JSON.stringify([
      "Software-Defined WAN (SD-WAN) Deployments",
      "Core Routing & High-Capacity Switching",
      "Secure Enterprise Wireless Networks",
      "Real-Time Network Performance Monitoring"
    ]),
    benefits: JSON.stringify([
      "Improves application speed and connection stability",
      "Reduces WAN operational costs up to 50%",
      "Ensures zero-downtime with automatic failovers",
      "Simplifies multi-branch network management"
    ]),
    specifications: JSON.stringify({
      "SD-WAN Partners": ["Fortinet SD-WAN", "Cisco SD-WAN"],
      "Routing & Switching": ["Cisco Catalyst", "HPE Aruba"],
      "Wireless APs": ["Aruba AP", "Ruckus"]
    }),
    target_segment: 'Retail Chains, Manufacturing, Education, Branch-Heavy Businesses',
    image_url: null,
    gallery: '[]',
    brochure_url: null,
    video_url: null,
    price_range: 'Enterprise Grade',
    order_number: 4,
    is_featured: true,
    is_active: true,
    meta_title: 'Enterprise Networking & SD-WAN Solutions | PINET',
    meta_description: 'Optimize branch connectivity, speed up applications, and reduce costs with PINET SD-WAN, core networking, and wireless solutions.'
  },
  {
    id: 5,
    name: 'Collaboration & Smart School, Campus, Office',
    slug: 'collaboration-smart-school-campus-office',
    category: 'Smart Solutions & Collaboration',
    short_description: 'Integrated smart spaces, digital classrooms, hybrid collaboration systems, smart office automation, and unified communications.',
    description: 'Transform traditional workspaces and educational institutions into modern, intelligent, and highly collaborative spaces. Our Smart Solutions integrate interactive digital displays, smart hybrid classroom technology, automated school/campus attendance systems, unified IP telephony, smart video conferencing rooms, and building automation sensors. We empower teams and students to collaborate effortlessly in physical, remote, or hybrid setups while optimizing facility usage.',
    features: JSON.stringify([
      "Smart Classroom & Interactive Whiteboards",
      "Hybrid Meeting Rooms & AV Systems",
      "Unified IP Telephony & Video Conferencing",
      "Smart Space Automation & Access Control"
    ]),
    benefits: JSON.stringify([
      "Fosters active engagement in classrooms and offices",
      "Enables seamless remote and hybrid collaborations",
      "Reduces energy costs via automated space utility controls",
      "Streamlines communication channels into a single app"
    ]),
    specifications: JSON.stringify({
      "Interactive Displays": ["Maxhub", "Clevertouch"],
      "Meeting AV": ["Poly", "Logitech", "Yealink"],
      "IP PBX & Telephony": ["Yeastar", "Cisco CallManager"]
    }),
    target_segment: 'Schools, Universities, Government Offices, Modern Workspaces',
    image_url: null,
    gallery: '[]',
    brochure_url: null,
    video_url: null,
    price_range: 'Enterprise Grade',
    order_number: 5,
    is_featured: true,
    is_active: true,
    meta_title: 'Smart Solutions for School, Campus & Office | PINET',
    meta_description: 'Transform spaces with PINET smart systems, interactive digital classrooms, hybrid meeting rooms, and unified communications.'
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync table
    await Product.sync({ alter: true });
    console.log('✅ Products table synced');

    // Clear existing products
    await Product.destroy({ where: {}, truncate: true });
    console.log('✅ Cleared existing products');

    // Bulk create
    await Product.bulkCreate(products);
    console.log(`✅ Seeded ${products.length} products successfully!`);

    // List them
    const all = await Product.findAll({ order: [['order_number', 'ASC']] });
    console.log('\n📋 Seeded products:');
    all.forEach(p => {
      console.log(`   [ID: ${p.id}] ${p.name} | Category: ${p.category} | Slug: ${p.slug}`);
    });

    await sequelize.close();
    console.log('\n✅ Done! Database connection closed.');
  } catch (error) {
    console.error('❌ Seed error:', error);
    try { await sequelize.close(); } catch(e) {}
    process.exit(1);
  }
}

seed();
