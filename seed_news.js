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

const News = sequelize.define('news', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  slug: { type: DataTypes.STRING(300), allowNull: false, unique: true },
  category: { type: DataTypes.STRING(100), allowNull: true },
  excerpt: { type: DataTypes.TEXT, allowNull: true },
  content: { type: DataTypes.TEXT('long'), allowNull: false },
  featured_image: { type: DataTypes.STRING(255), allowNull: true },
  gallery: { type: DataTypes.TEXT, allowNull: true },
  author: { type: DataTypes.STRING(100), allowNull: true },
  published_date: { type: DataTypes.DATE, allowNull: true },
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
  meta_title: { type: DataTypes.STRING(255), allowNull: true },
  meta_description: { type: DataTypes.TEXT, allowNull: true },
  tags: { type: DataTypes.STRING(255), allowNull: true }
});

const newsItems = [
  {
    title: 'WWDC 2026: Apple Partners with Google to Supercharge Siri with Gemini AI',
    slug: 'wwdc-2026-apple-partners-google-siri-gemini-ai',
    category: 'Industry News',
    excerpt: 'In a groundbreaking announcement at WWDC 2026, Apple officially unveiled a completely rebuilt Siri assistant powered by Google\'s frontier Gemini model, marking a historic collaboration.',
    content: 'At its annual Worldwide Developers Conference (WWDC 2026), Apple shocked the tech industry by announcing a deep integration with Google\'s Gemini. The partnership will bring next-generation multimodal capabilities, advanced reasoning, and real-time contextual awareness to Siri across iOS, iPadOS, and macOS. Rather than relying solely on its in-house models, Apple decided to leverage Google\'s frontier LLM to deliver immediate, human-like responses and seamless tool usage for billions of active devices. This strategic alliance represents a major shift in the competitive AI landscape, showing that even the largest tech giants are willing to collaborate to deliver state-of-the-art AI features.',
    featured_image: '/assets/images/news/siri-gemini-partnership.jpg',
    gallery: JSON.stringify(['/assets/images/news/wwdc-keynote.jpg', '/assets/images/news/siri-demo.jpg']),
    author: 'Ayu Rejeki',
    published_date: new Date('2026-06-12T10:00:00Z'),
    views: 154,
    is_featured: true,
    is_published: true,
    meta_title: 'Apple Partners with Google for Gemini-Powered Siri at WWDC 2026',
    meta_description: 'Apple announced a major partnership with Google at WWDC 2026 to integrate Gemini AI into Siri, bringing advanced multimodal capabilities to iOS.',
    tags: 'AI, Apple, Google, Siri, Gemini, WWDC2026'
  },
  {
    title: 'OpenAI Launches $150 Million Partner Network to Accelerate Enterprise AI Adoption',
    slug: 'openai-launches-150-million-partner-network-enterprise-ai',
    category: 'Company News',
    excerpt: 'OpenAI has announced a $150 million initiative to build a global partner network, aiming to train over 300,000 certified consultants to deploy enterprise AI solutions.',
    content: 'To bridge the gap between frontier AI capabilities and corporate deployment, OpenAI has unveiled its $150 Million Partner Network. The program aims to establish robust training frameworks, technical certifications, and direct engineering support for IT consulting firms and systems integrators. OpenAI hopes to certify 300,000 consultants by the end of 2026 to help enterprise customers design and implement custom LLM applications, agentic workflows, and secure database integrations. This move highlights the growing commercial focus of AI labs on enterprise readiness, data privacy compliance, and deep vertical market solutions.',
    featured_image: '/assets/images/news/openai-partner-network.jpg',
    gallery: JSON.stringify(['/assets/images/news/openai-office.jpg', '/assets/images/news/enterprise-ai-workshop.jpg']),
    author: 'Ayu Rejeki',
    published_date: new Date('2026-06-14T09:30:00Z'),
    views: 98,
    is_featured: false,
    is_published: true,
    meta_title: 'OpenAI Launches $150M Partner Network for Enterprise AI Solutions',
    meta_description: 'OpenAI has announced a $150M initiative to train and certify 300,000 consultants globally for enterprise AI integration.',
    tags: 'AI, OpenAI, Enterprise, Systems Integration, Partner Network'
  },
  {
    title: 'Indonesia GovTech: Prabowo Administration Accelerates AI Integration Across 8 Ministries',
    slug: 'indonesia-govtech-prabowo-administration-accelerates-ai-integration',
    category: 'Industry News',
    excerpt: 'Indonesia is accelerating its GovTech initiatives by integrating data from eight key ministries into an AI-supported database to boost public service efficiency and tax administration.',
    content: 'The Indonesian government, under President Prabowo\'s administration, has announced a significant acceleration of its GovTech digitalization agenda. Effective early June 2026, data from eight ministries—including finance, home affairs, and social affairs—has been successfully unified into an AI-powered data platform. The initiative leverages advanced machine learning models to identify tax evasion, streamline the distribution of social assistance, and automate administrative workflows. The government expects this AI-driven integration to improve public service delivery efficiency by over 40% and substantially enhance state revenue collection.',
    featured_image: '/assets/images/news/indonesia-govtech.jpg',
    gallery: JSON.stringify(['/assets/images/news/prabowo-cabinet.jpg', '/assets/images/news/govtech-dashboard.jpg']),
    author: 'Ayu Rejeki',
    published_date: new Date('2026-06-08T14:00:00Z'),
    views: 215,
    is_featured: true,
    is_published: true,
    meta_title: 'Indonesia GovTech: AI Integration Across 8 Ministries',
    meta_description: 'President Prabowo\'s administration accelerates GovTech by integrating eight Indonesian ministries into an AI-supported database platform.',
    tags: 'GovTech, Indonesia, AI, Digital Transformation, Public Sector'
  },
  {
    title: 'PwC 2026 AI Jobs Barometer: AI-Specialized Roles Experience 62% Wage Premium',
    slug: 'pwc-2026-ai-jobs-barometer-62-percent-wage-premium',
    category: 'Industry News',
    excerpt: 'A new global report by PwC highlights a growing labor divide, with jobs requiring specialized AI skills growing eight times faster than average and demanding a 62% wage premium.',
    content: 'PwC has released its 2026 Global AI Jobs Barometer, outlining the profound impact of artificial intelligence on the global workforce. According to the report, the job market has split into a two-track system. \'Professionalized\' roles—where AI serves as a powerful productivity booster for skilled experts (such as engineers, data scientists, and analysts)—are seeing unprecedented wage and headcount growth. Jobs that require specific AI skills are growing eight times faster than the general job market, with candidates commanding an average 62% wage premium. Conversely, \'democratized\' roles where AI automates simple tasks are seeing stagnation, signaling the urgent need for upskilling and corporate training programs.',
    featured_image: '/assets/images/news/pwc-ai-jobs-report.jpg',
    gallery: JSON.stringify(['/assets/images/news/ai-skills-chart.jpg']),
    author: 'Ayu Rejeki',
    published_date: new Date('2026-06-15T11:00:00Z'),
    views: 84,
    is_featured: false,
    is_published: true,
    meta_title: 'PwC 2026 AI Jobs Barometer: 62% Wage Premium for AI Skills',
    meta_description: 'PwC\'s latest AI Jobs Barometer shows that roles requiring AI skills grow 8x faster and offer a 62% average wage premium.',
    tags: 'AI, Jobs, PwC, Labor Market, Upskilling, Career'
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync table
    await News.sync({ alter: true });
    console.log('✅ News table synced');

    // Clear existing news
    await News.destroy({ where: {}, truncate: true });
    console.log('✅ Cleared existing news');

    // Bulk create
    await News.bulkCreate(newsItems);
    console.log(`✅ Seeded ${newsItems.length} news items successfully!`);

    await sequelize.close();
    console.log('\n✅ Done! Database connection closed.');
  } catch (error) {
    console.error('❌ Seed error:', error);
    try { await sequelize.close(); } catch(e) {}
    process.exit(1);
  }
}

seed();
