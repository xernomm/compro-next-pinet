import { sequelize } from '../db';
import User from './User.js';
import CompanyInfo from './CompanyInfo.js';
import Product from './Product.js';
import Partner from './Partner.js';
import Client from './Client.js';
import News from './News.js';
import Event from './Event.js';
import Career from './Career.js';
import Contact from './Contact.js';
import Hero from './Hero.js';
import Service from './Service.js';
import Value from './Value.js';


// Define associations
const setupAssociations = () => {
  // Products can have multiple categories (if needed in future)
  // Partners and Clients are independent
  // News and Events are independent
  // Career postings are independent
  // Contact messages are independent
  // Hero slides for home page
  // Services offered by company
  // Company values
};

setupAssociations();

export {
  sequelize,
  User,
  CompanyInfo,
  Product,
  Partner,
  Client,
  News,
  Event,
  Career,
  Contact,
  Hero,
  Service,
  Value,
};
