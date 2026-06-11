import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { milestoneAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const categoryLabels = {
    founding: 'Founding',
    partnership: 'Partnership',
    achievement: 'Achievement',
    expansion: 'Expansion',
    product: 'Product',
};

const categoryColors = {
    founding: '#f59e0b',
    partnership: '#3b82f6',
    achievement: '#10b981',
    expansion: '#8b5cf6',
    product: '#ef4444',
};

const MilestoneList = () => {
    const navigate = useNavigate();
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchMilestones(); }, []);

    const fetchMilestones = async () => {
        try {
            const response = await milestoneAPI.getAll();
            setMilestones(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching milestones:', error);
            toast.error('Failed to load milestones');
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this milestone?')) {
            try {
                await milestoneAPI.delete(id);
                toast.success('Milestone deleted successfully');
                fetchMilestones();
            } catch (error) {
                console.error('Error deleting milestone:', error);
                toast.error('Failed to delete milestone');
            }
        }
    };

    if (loading) return <div className="page-container"><div className="loading-container"><div className="loading-spinner"></div></div></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Milestones (Company History)</h2>
                <button onClick={() => navigate('/dashboard/milestones/new')} className="btn btn-primary">+ Add New Milestone</button>
            </div>

            {milestones.length === 0 ? (
                <div className="content-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">🏆</div>
                        <h3>No Milestones Yet</h3>
                        <p>Add your company history milestones to display on the timeline</p>
                        <button onClick={() => navigate('/dashboard/milestones/new')} className="btn btn-primary" style={{ marginTop: '15px' }}>Add First Milestone</button>
                    </div>
                </div>
            ) : (
                <div className="content-card table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Order</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {milestones.map((milestone) => (
                                <tr key={milestone.id}>
                                    <td><strong style={{ fontFamily: 'monospace', fontSize: '1.05em' }}>{milestone.year}</strong></td>
                                    <td>
                                        {milestone.image_url ? (
                                            <img src={getImageUrl(milestone.image_url)} alt={milestone.title} style={{ height: '32px', width: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                                        ) : milestone.icon ? (
                                            <span style={{ fontSize: '24px' }}>{milestone.icon}</span>
                                        ) : null}
                                    </td>
                                    <td><strong>{milestone.title}</strong></td>
                                    <td>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '2px 10px',
                                            borderRadius: '12px',
                                            fontSize: '0.75em',
                                            fontWeight: 600,
                                            color: '#fff',
                                            background: categoryColors[milestone.category] || '#666',
                                        }}>
                                            {categoryLabels[milestone.category] || milestone.category}
                                        </span>
                                    </td>
                                    <td>{milestone.order_number}</td>
                                    <td><span className={`status-badge ${milestone.is_active ? 'status-active' : 'status-inactive'}`}>{milestone.is_active ? 'Active' : 'Inactive'}</span></td>
                                    <td className="text-right">
                                        <button onClick={() => navigate(`/dashboard/milestones/${milestone.id}/edit`)} className="btn btn-sm btn-secondary mr-2">Edit</button>
                                        <button onClick={() => handleDelete(milestone.id)} className="btn btn-sm btn-danger">Delete</button>
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

export default MilestoneList;
