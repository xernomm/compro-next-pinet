import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const NewsList = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await newsAPI.getAll();
            setNews(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching news:', error);
            toast.error('Failed to load news');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this news?')) {
            try {
                await newsAPI.delete(id);
                toast.success('News deleted successfully');
                fetchNews();
            } catch (error) {
                console.error('Error deleting news:', error);
                toast.error('Failed to delete news');
            }
        }
    };

    const handlePublish = async (id) => {
        try {
            await newsAPI.publish(id);
            toast.success('News published successfully');
            fetchNews();
        } catch (error) {
            console.error('Error publishing news:', error);
            toast.error('Failed to publish news');
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>News</h2>
                <button onClick={() => navigate('/dashboard/news/new')} className="btn btn-primary">
                    + Add New News
                </button>
            </div>

            {news.length === 0 ? (
                <div className="content-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">📰</div>
                        <h3>No News Yet</h3>
                        <p>Publish your first news article</p>
                        <button onClick={() => navigate('/dashboard/news/new')} className="btn btn-primary" style={{ marginTop: '15px' }}>
                            Add First News
                        </button>
                    </div>
                </div>
            ) : (
                <div className="content-card table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Author</th>
                                <th>Date</th>
                                <th>Featured</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {news.map((newsItem) => (
                                <tr key={newsItem.id}>
                                    <td>
                                        {newsItem.featured_image && (
                                            <img src={getImageUrl(newsItem.featured_image)} alt={newsItem.title} style={{ height: '40px', width: '64px', objectFit: 'cover', borderRadius: '4px' }} />
                                        )}
                                    </td>
                                    <td><strong>{newsItem.title}</strong></td>
                                    <td>{newsItem.category}</td>
                                    <td>{newsItem.author}</td>
                                    <td>{newsItem.published_date ? new Date(newsItem.published_date).toLocaleDateString() : '-'}</td>
                                    <td>{newsItem.is_featured && <span className="status-badge status-active">Featured</span>}</td>
                                    <td>
                                        <span className={`status-badge ${newsItem.is_published ? 'status-active' : 'status-inactive'}`}>
                                            {newsItem.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        {!newsItem.is_published && (
                                            <button onClick={() => handlePublish(newsItem.id)} className="btn btn-sm btn-success mr-2">Publish</button>
                                        )}
                                        <button onClick={() => navigate(`/dashboard/news/${newsItem.id}/edit`)} className="btn btn-sm btn-secondary mr-2">Edit</button>
                                        <button onClick={() => handleDelete(newsItem.id)} className="btn btn-sm btn-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default NewsList;
