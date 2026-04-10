import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { valueAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const ValueList = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchValues(); }, []);

    const fetchValues = async () => {
        try {
            const response = await valueAPI.getAll();
            setValues(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching values:', error);
            toast.error('Failed to load values');
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this value?')) {
            try {
                await valueAPI.delete(id);
                toast.success('Value deleted successfully');
                fetchValues();
            } catch (error) {
                console.error('Error deleting value:', error);
                toast.error('Failed to delete value');
            }
        }
    };

    if (loading) return <div className="page-container"><div className="loading-container"><div className="loading-spinner"></div></div></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Values</h2>
                <button onClick={() => navigate('/dashboard/values/new')} className="btn btn-primary">+ Add New Value</button>
            </div>

            {values.length === 0 ? (
                <div className="content-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">✨</div>
                        <h3>No Values Yet</h3>
                        <p>Add your company values</p>
                        <button onClick={() => navigate('/dashboard/values/new')} className="btn btn-primary" style={{ marginTop: '15px' }}>Add First Value</button>
                    </div>
                </div>
            ) : (
                <div className="content-card table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Icon</th>
                                <th>Title</th>
                                <th>Order</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {values.map((value) => (
                                <tr key={value.id}>
                                    <td>
                                        {value.image_url ? (
                                            <img src={getImageUrl(value.image_url)} alt={value.title} style={{ height: '32px', width: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                                        ) : value.icon ? (
                                            <span style={{ fontSize: '24px' }}>{value.icon}</span>
                                        ) : null}
                                    </td>
                                    <td><strong>{value.title}</strong></td>
                                    <td>{value.order_number}</td>
                                    <td><span className={`status-badge ${value.is_active ? 'status-active' : 'status-inactive'}`}>{value.is_active ? 'Active' : 'Inactive'}</span></td>
                                    <td className="text-right">
                                        <button onClick={() => navigate(`/dashboard/values/${value.id}/edit`)} className="btn btn-sm btn-secondary mr-2">Edit</button>
                                        <button onClick={() => handleDelete(value.id)} className="btn btn-sm btn-danger">Delete</button>
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

export default ValueList;
