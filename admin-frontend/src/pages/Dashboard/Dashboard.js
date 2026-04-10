import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { heroAPI, productAPI, newsAPI, contactAPI } from '../../api/apiService';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    heroes: 0,
    products: 0,
    news: 0,
    contacts: 0,
  });

  useEffect(() => {
    // Fetch dashboard statistics
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [heroesRes, productsRes, newsRes, contactsRes] = await Promise.all([
        heroAPI.getAll(),
        productAPI.getAll(),
        newsAPI.getAll(),
        contactAPI.getAll()
      ]);

      const getCount = (res) => {
        const data = res.data.data || res.data;
        return Array.isArray(data) ? data.length : 0;
      };

      setStats({
        heroes: getCount(heroesRes),
        products: getCount(productsRes),
        news: getCount(newsRes),
        contacts: getCount(contactsRes),
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const statCards = [
    { title: 'Hero Slides', count: stats.heroes, icon: '🎬', color: '#3498db' },
    { title: 'Products', count: stats.products, icon: '📦', color: '#2ecc71' },
    { title: 'News Articles', count: stats.news, icon: '📰', color: '#e74c3c' },
    { title: 'Contact Messages', count: stats.contacts, icon: '📧', color: '#f39c12' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.full_name}!</h1>
        <p>Here's what's happening with your company profile today.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{ borderLeftColor: stat.color }}
          >
            <div className="stat-icon" style={{ background: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.count}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <a href="/dashboard/heroes" className="action-card">
            <span className="action-icon">🎬</span>
            <span className="action-label">Manage Hero Slides</span>
          </a>
          <a href="/dashboard/products" className="action-card">
            <span className="action-icon">📦</span>
            <span className="action-label">Add New Product</span>
          </a>
          <a href="/dashboard/news" className="action-card">
            <span className="action-icon">📰</span>
            <span className="action-label">Publish News</span>
          </a>
          <a href="/dashboard/contacts" className="action-card">
            <span className="action-icon">📧</span>
            <span className="action-label">View Messages</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;