import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { partnerAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const PartnerList = () => {
    const navigate = useNavigate();
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const response = await partnerAPI.getAll();
            setPartners(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching partners:', error);
            toast.error('Failed to load partners');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this partner?')) {
            try {
                await partnerAPI.delete(id);
                toast.success('Partner deleted successfully');
                fetchPartners();
            } catch (error) {
                console.error('Error deleting partner:', error);
                toast.error('Failed to delete partner');
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
                <h2>Partners</h2>
                <div className="btn-group">
                    <button
                        onClick={() => navigate('/dashboard/partners/bulk')}
                        className="btn btn-outline"
                    >
                        📋 Bulk Add
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/partners/new')}
                        className="btn btn-primary"
                    >
                        + Add New Partner
                    </button>
                </div>
            </div>

            {partners.length === 0 ? (
                <div className="content-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">🤝</div>
                        <h3>No Partners Yet</h3>
                        <p>Start by adding your first partner</p>
                        <button
                            onClick={() => navigate('/dashboard/partners/new')}
                            className="btn btn-primary"
                            style={{ marginTop: '15px' }}
                        >
                            Add First Partner
                        </button>
                    </div>
                </div>
            ) : (
                <div className="content-card table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Logo</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Since</th>
                                <th>Order</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partners.map((partner) => (
                                <tr key={partner.id}>
                                    <td>
                                        {partner.logo_url && (
                                            <img
                                                src={getImageUrl(partner.logo_url)}
                                                alt={partner.name}
                                                style={{ height: '32px', maxWidth: '80px', objectFit: 'contain' }}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <strong>{partner.name}</strong>
                                        {partner.website_url && (
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                {partner.website_url}
                                            </div>
                                        )}
                                    </td>
                                    <td>{partner.partnership_type}</td>
                                    <td>{partner.partnership_since}</td>
                                    <td>{partner.order_number}</td>
                                    <td>
                                        <span className={`status-badge ${partner.is_active ? 'status-active' : 'status-inactive'}`}>
                                            {partner.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <button
                                            onClick={() => navigate(`/dashboard/partners/${partner.id}/edit`)}
                                            className="btn btn-sm btn-secondary mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(partner.id)}
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

export default PartnerList;
