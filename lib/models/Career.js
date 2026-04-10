import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Career = sequelize.define('careers', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  job_title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'e.g., IT, Sales, Marketing, HR'
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  employment_type: {
    type: DataTypes.ENUM('full_time', 'part_time', 'contract', 'internship', 'freelance'),
    defaultValue: 'full_time'
  },
  experience_level: {
    type: DataTypes.ENUM('entry', 'junior', 'mid', 'senior', 'lead', 'manager'),
    allowNull: true
  },
  salary_range: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  responsibilities: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    comment: 'JSON array of responsibilities'
  },
  requirements: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    comment: 'JSON array of requirements'
  },
  qualifications: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON array of qualifications'
  },
  benefits: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON array of benefits'
  },
  application_deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  posted_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  contact_email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  application_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  status: {
    type: DataTypes.ENUM('open', 'closed', 'on_hold'),
    defaultValue: 'open'
  }
});

export default Career;
