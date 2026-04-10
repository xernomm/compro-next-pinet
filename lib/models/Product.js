import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Product = sequelize.define('products', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'e.g., Hardware, Software, Solutions'
  },
  short_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  features: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    comment: 'JSON array of features'
  },
  benefits: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON array of benefits'
  },
  specifications: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    comment: 'JSON object of specifications'
  },
  target_segment: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Target customer segment'
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  gallery: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON array of image URLs'
  },
  brochure_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  video_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  price_range: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  order_number: {
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
  meta_title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

export default Product;
