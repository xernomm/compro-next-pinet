import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Contact = sequelize.define('contacts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  company: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('general', 'sales', 'support', 'partnership', 'career', 'other'),
    defaultValue: 'general'
  },
  status: {
    type: DataTypes.ENUM('new', 'read', 'replied', 'closed'),
    defaultValue: 'new'
  },
  ip_address: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Admin notes'
  },
  replied_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  replied_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'User ID who replied'
  }
});

export default Contact;
