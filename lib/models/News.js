import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const News = sequelize.define('news', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(300),
    allowNull: false,
    unique: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'e.g., Company News, Industry News, Product Launch'
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  featured_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  gallery: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON array of image URLs'
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  published_date: {
    type: DataTypes.DATE,
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
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  meta_title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Comma-separated tags'
  }
});

export default News;
