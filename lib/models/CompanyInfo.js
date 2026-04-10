import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const CompanyInfo = sequelize.define('company_info', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  tagline: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  about: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  history: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  vision: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mission: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  established_year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  province: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  postal_code: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: 'Indonesia'
  },
  logo_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  favicon_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  facebook_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  twitter_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  instagram_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  linkedin_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  youtube_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  meta_title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  meta_keywords: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

export default CompanyInfo;
