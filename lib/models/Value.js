import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Value = sequelize.define('values', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Icon class or image URL'
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
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

export default Value;
