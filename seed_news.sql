-- SQL Script to seed News for PT. Prima Integrasi Network
-- You can run this in your terminal:
-- mysql -u root -prich0505 company_profile < seed_news.sql

-- 1. Create table news if not exists
CREATE TABLE IF NOT EXISTS `news` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(300) NOT NULL UNIQUE,
  `category` VARCHAR(100) NULL COMMENT 'e.g., Company News, Industry News, Product Launch',
  `excerpt` TEXT NULL,
  `content` LONGTEXT NOT NULL,
  `featured_image` VARCHAR(255) NULL,
  `gallery` TEXT NULL COMMENT 'JSON array of image URLs',
  `author` VARCHAR(100) NULL,
  `published_date` DATETIME NULL,
  `views` INT NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 0,
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `tags` VARCHAR(255) NULL COMMENT 'Comma-separated tags',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Clear existing news
DELETE FROM `news`;

-- 3. Insert news data
INSERT INTO `news` (
  `title`,
  `slug`,
  `category`,
  `excerpt`,
  `content`,
  `featured_image`,
  `gallery`,
  `author`,
  `published_date`,
  `views`,
  `is_featured`,
  `is_published`,
  `meta_title`,
  `meta_description`,
  `tags`,
  `created_at`,
  `updated_at`
) VALUES
(
  'WWDC 2026: Apple Partners with Google to Supercharge Siri with Gemini AI',
  'wwdc-2026-apple-partners-google-siri-gemini-ai',
  'Industry News',
  'In a groundbreaking announcement at WWDC 2026, Apple officially unveiled a completely rebuilt Siri assistant powered by Google\'s frontier Gemini model, marking a historic collaboration.',
  'At its annual Worldwide Developers Conference (WWDC 2026), Apple shocked the tech industry by announcing a deep integration with Google\'s Gemini. The partnership will bring next-generation multimodal capabilities, advanced reasoning, and real-time contextual awareness to Siri across iOS, iPadOS, and macOS. Rather than relying solely on its in-house models, Apple decided to leverage Google\'s frontier LLM to deliver immediate, human-like responses and seamless tool usage for billions of active devices. This strategic alliance represents a major shift in the competitive AI landscape, showing that even the largest tech giants are willing to collaborate to deliver state-of-the-art AI features.',
  '/assets/images/news/siri-gemini-partnership.jpg',
  '["/assets/images/news/wwdc-keynote.jpg", "/assets/images/news/siri-demo.jpg"]',
  'Ayu Rejeki',
  '2026-06-12 10:00:00',
  154,
  1,
  1,
  'Apple Partners with Google for Gemini-Powered Siri at WWDC 2026',
  'Apple announced a major partnership with Google at WWDC 2026 to integrate Gemini AI into Siri, bringing advanced multimodal capabilities to iOS.',
  'AI, Apple, Google, Siri, Gemini, WWDC2026',
  NOW(),
  NOW()
),
(
  'OpenAI Launches $150 Million Partner Network to Accelerate Enterprise AI Adoption',
  'openai-launches-150-million-partner-network-enterprise-ai',
  'Company News',
  'OpenAI has announced a $150 million initiative to build a global partner network, aiming to train over 300,000 certified consultants to deploy enterprise AI solutions.',
  'To bridge the gap between frontier AI capabilities and corporate deployment, OpenAI has unveiled its $150 Million Partner Network. The program aims to establish robust training frameworks, technical certifications, and direct engineering support for IT consulting firms and systems integrators. OpenAI hopes to certify 300,000 consultants by the end of 2026 to help enterprise customers design and implement custom LLM applications, agentic workflows, and secure database integrations. This move highlights the growing commercial focus of AI labs on enterprise readiness, data privacy compliance, and deep vertical market solutions.',
  '/assets/images/news/openai-partner-network.jpg',
  '["/assets/images/news/openai-office.jpg", "/assets/images/news/enterprise-ai-workshop.jpg"]',
  'Ayu Rejeki',
  '2026-06-14 09:30:00',
  98,
  0,
  1,
  'OpenAI Launches $150M Partner Network for Enterprise AI Solutions',
  'OpenAI has announced a $150M initiative to train and certify 300,000 consultants globally for enterprise AI integration.',
  'AI, OpenAI, Enterprise, Systems Integration, Partner Network',
  NOW(),
  NOW()
),
(
  'Indonesia GovTech: Prabowo Administration Accelerates AI Integration Across 8 Ministries',
  'indonesia-govtech-prabowo-administration-accelerates-ai-integration',
  'Industry News',
  'Indonesia is accelerating its GovTech initiatives by integrating data from eight key ministries into an AI-supported database to boost public service efficiency and tax administration.',
  'The Indonesian government, under President Prabowo\'s administration, has announced a significant acceleration of its GovTech digitalization agenda. Effective early June 2026, data from eight ministries—including finance, home affairs, and social affairs—has been successfully unified into an AI-powered data platform. The initiative leverages advanced machine learning models to identify tax evasion, streamline the distribution of social assistance, and automate administrative workflows. The government expects this AI-driven integration to improve public service delivery efficiency by over 40% and substantially enhance state revenue collection.',
  '/assets/images/news/indonesia-govtech.jpg',
  '["/assets/images/news/prabowo-cabinet.jpg", "/assets/images/news/govtech-dashboard.jpg"]',
  'Ayu Rejeki',
  '2026-06-08 14:00:00',
  215,
  1,
  1,
  'Indonesia GovTech: AI Integration Across 8 Ministries',
  'President Prabowo\'s administration accelerates GovTech by integrating eight Indonesian ministries into an AI-supported database platform.',
  'GovTech, Indonesia, AI, Digital Transformation, Public Sector',
  NOW(),
  NOW()
),
(
  'PwC 2026 AI Jobs Barometer: AI-Specialized Roles Experience 62% Wage Premium',
  'pwc-2026-ai-jobs-barometer-62-percent-wage-premium',
  'Industry News',
  'A new global report by PwC highlights a growing labor divide, with jobs requiring specialized AI skills growing eight times faster than average and demanding a 62% wage premium.',
  'PwC has released its 2026 Global AI Jobs Barometer, outlining the profound impact of artificial intelligence on the global workforce. According to the report, the job market has split into a two-track system. \'Professionalized\' roles—where AI serves as a powerful productivity booster for skilled experts (such as engineers, data scientists, and analysts)—are seeing unprecedented wage and headcount growth. Jobs that require specific AI skills are growing eight times faster than the general job market, with candidates commanding an average 62% wage premium. Conversely, \'democratized\' roles where AI automates simple tasks are seeing stagnation, signaling the urgent need for upskilling and corporate training programs.',
  '/assets/images/news/pwc-ai-jobs-report.jpg',
  '["/assets/images/news/ai-skills-chart.jpg"]',
  'Ayu Rejeki',
  '2026-06-15 11:00:00',
  84,
  0,
  1,
  'PwC 2026 AI Jobs Barometer: 62% Wage Premium for AI Skills',
  'PwC\'s latest AI Jobs Barometer shows that roles requiring AI skills grow 8x faster and offer a 62% average wage premium.',
  'AI, Jobs, PwC, Labor Market, Upskilling, Career',
  NOW(),
  NOW()
);
