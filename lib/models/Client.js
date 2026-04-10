import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Client = sequelize.define('clients', {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  logo_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  website_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  industry: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'e.g., Banking, Healthcare, Manufacturing'
  },
  project_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  testimonial: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  testimonial_author: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  testimonial_position: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  collaboration_since: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Year of collaboration start'
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
  }
});

export default Client;
