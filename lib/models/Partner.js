import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Partner = sequelize.define('partners', {
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
  partnership_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'User-defined partnership type category'
  },
  partnership_since: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Year of partnership start'
  },
  order_number: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

export default Partner;
