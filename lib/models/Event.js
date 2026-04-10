import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Event = sequelize.define('events', {
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
  description: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  event_type: {
    type: DataTypes.ENUM('seminar', 'workshop', 'conference', 'webinar', 'training', 'exhibition', 'other'),
    defaultValue: 'seminar'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  venue: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_online: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  meeting_link: {
    type: DataTypes.STRING(255),
    allowNull: true
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
  organizer: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  contact_person: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  contact_email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  contact_phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  registration_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  max_participants: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
    defaultValue: 'upcoming'
  }
});

export default Event;
