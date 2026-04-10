import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Hero = sequelize.define('heroes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  button_text: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  button_link: {
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

export default Hero;
