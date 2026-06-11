import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Milestone = sequelize.define('milestones', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Emoji or icon identifier'
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('founding', 'partnership', 'achievement', 'expansion', 'product'),
    defaultValue: 'achievement',
    allowNull: false
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

export default Milestone;
