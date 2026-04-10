import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const ClientList = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await clientAPI.getAll();
            setClients(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('Failed to load clients');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await clientAPI.delete(id);
                toast.success('Client deleted successfully');
                fetchClients();
            } catch (error) {
                console.error('Error deleting client:', error);
                toast.error('Failed to delete client');
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
                <h2>Clients</h2>
                <div className="btn-group">
                    <button
                        onClick={() => navigate('/dashboard/clients/bulk')}
                        className="btn btn-outline"
                    >
                        📋 Bulk Add
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/clients/new')}
                        className="btn btn-primary"
                    >
                        + Add New Client
                    </button>
                </div>
            </div>

            {clients.length === 0 ? (
                <div className="content-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">🏢</div>
                        <h3>No Clients Yet</h3>
                        <p>Start by adding your first client</p>
                        <button
                            onClick={() => navigate('/dashboard/clients/new')}
                            className="btn btn-primary"
                            style={{ marginTop: '15px' }}
                        >
                            Add First Client
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
                                <th>Industry</th>
                                <th>Since</th>
                                <th>Order</th>
                                <th>Featured</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr key={client.id}>
                                    <td>
                                        {client.logo_url && (
                                            <img
                                                src={getImageUrl(client.logo_url)}
                                                alt={client.name}
                                                style={{ height: '32px', maxWidth: '80px', objectFit: 'contain' }}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <strong>{client.name}</strong>
                                        {client.website_url && (
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                {client.website_url}
                                            </div>
                                        )}
                                    </td>
                                    <td>{client.industry}</td>
                                    <td>{client.collaboration_since}</td>
                                    <td>{client.order_number}</td>
                                    <td>
                                        {client.is_featured && (
                                            <span className="status-badge status-active">Featured</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${client.is_active ? 'status-active' : 'status-inactive'}`}>
                                            {client.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <button
                                            onClick={() => navigate(`/dashboard/clients/${client.id}/edit`)}
                                            className="btn btn-sm btn-secondary mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(client.id)}
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

export default ClientList;
