import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { heroAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const HeroList = () => {
    const navigate = useNavigate();
    const [heroes, setHeroes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHeroes();
    }, []);

    const fetchHeroes = async () => {
        try {
            const response = await heroAPI.getAll();
            setHeroes(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching heroes:', error);
            toast.error('Failed to load heroes');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hero?')) {
            try {
                await heroAPI.delete(id);
                toast.success('Hero deleted successfully');
                fetchHeroes();
            } catch (error) {
                console.error('Error deleting hero:', error);
                toast.error('Failed to delete hero');
            }
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
                <h2>Heroes</h2>
                <button
                    onClick={() => navigate('/dashboard/heroes/new')}
                    className="btn btn-primary"
                >
                    + Add New Hero
                </button>
            </div>

            {heroes.length === 0 ? (
                <div className="content-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">🖼️</div>
                        <h3>No Heroes Yet</h3>
                        <p>Create your first hero banner</p>
                        <button
                            onClick={() => navigate('/dashboard/heroes/new')}
                            className="btn btn-primary"
                            style={{ marginTop: '15px' }}
                        >
                            Add First Hero
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
                                <th>Subtitle</th>
                                <th>Order</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {heroes.map((hero) => (
                                <tr key={hero.id}>
                                    <td>
                                        {hero.image_url && (
                                            <img
                                                src={getImageUrl(hero.image_url)}
                                                alt={hero.title}
                                                style={{ height: '40px', width: '64px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                        )}
                                    </td>
                                    <td><strong>{hero.title}</strong></td>
                                    <td>{hero.subtitle}</td>
                                    <td>{hero.order_number}</td>
                                    <td>
                                        <span className={`status-badge ${hero.is_active ? 'status-active' : 'status-inactive'}`}>
                                            {hero.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <button
                                            onClick={() => navigate(`/dashboard/heroes/${hero.id}/edit`)}
                                            className="btn btn-sm btn-secondary mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(hero.id)}
                                            className="btn btn-sm btn-danger"
                                        >
                                            Delete
                                        </button>
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

export default HeroList;
