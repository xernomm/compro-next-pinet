import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const ServiceList = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await serviceAPI.getAll();
            setServices(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await serviceAPI.delete(id);
                toast.success('Service deleted successfully');
                fetchServices();
            } catch (error) {
                console.error('Error deleting service:', error);
                toast.error('Failed to delete service');
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
                <h2>Services</h2>
                <button onClick={() => navigate('/dashboard/services/new')} className="btn btn-primary">
                    + Add New Service
                </button>
            </div>

            {services.length === 0 ? (
                <div className="content-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">⚙️</div>
                        <h3>No Services Yet</h3>
                        <p>Add your first service</p>
                        <button onClick={() => navigate('/dashboard/services/new')} className="btn btn-primary" style={{ marginTop: '15px' }}>
                            Add First Service
                        </button>
                    </div>
                </div>
            ) : (
                <div className="content-card table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Icon</th>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Order</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service.id}>
                                    <td>
                                        {service.image_url ? (
                                            <img src={getImageUrl(service.image_url)} alt={service.name} style={{ height: '32px', width: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                                        ) : service.icon ? (
                                            <span style={{ fontSize: '24px' }}>{service.icon}</span>
                                        ) : null}
                                    </td>
                                    <td><strong>{service.name}</strong></td>
                                    <td>{service.slug}</td>
                                    <td>{service.order_number}</td>
                                    <td>
                                        <span className={`status-badge ${service.is_active ? 'status-active' : 'status-inactive'}`}>
                                            {service.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <button onClick={() => navigate(`/dashboard/services/${service.id}/edit`)} className="btn btn-sm btn-secondary mr-2">Edit</button>
                                        <button onClick={() => handleDelete(service.id)} className="btn btn-sm btn-danger">Delete</button>
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

export default ServiceList;
