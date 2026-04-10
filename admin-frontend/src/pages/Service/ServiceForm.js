import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { serviceAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const ServiceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        short_description: '',
        description: '',
        icon: '',
        order_number: 0,
        is_active: true,
    });
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (isEdit) {
            fetchService();
        }
    }, [id]);

    const fetchService = async () => {
        try {
            setFetching(true);
            const response = await serviceAPI.getById(id);
            const service = response.data.data || response.data;
            setFormData({
                name: service.name || '',
                slug: service.slug || '',
                short_description: service.short_description || '',
                description: service.description || '',
                icon: service.icon || '',
                order_number: service.order_number || 0,
                is_active: service.is_active ?? true,
            });
            if (service.image_url) {
                setPreviewImage(getImageUrl(service.image_url));
            }
        } catch (error) {
            console.error('Error fetching service:', error);
            toast.error('Failed to load service');
            navigate('/dashboard/services');
        } finally {
            setFetching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'name' && !isEdit) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });
            if (image) {
                submitData.append('image', image);
            }

            if (isEdit) {
                await serviceAPI.update(id, submitData);
                toast.success('Service updated successfully');
            } else {
                await serviceAPI.create(submitData);
                toast.success('Service created successfully');
            }
            navigate('/dashboard/services');
        } catch (error) {
            console.error('Error saving service:', error);
            toast.error('Failed to save service');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
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
            <div className="form-page-header">
                <button type="button" className="btn btn-secondary btn-back" onClick={() => navigate('/dashboard/services')}>
                    ← Back
                </button>
                <h2>{isEdit ? 'Edit Service' : 'Add New Service'}</h2>
            </div>

            <div className="content-card form-page-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3 className="form-section-title">Basic Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control" required placeholder="Service name" />
                            </div>
                            <div className="form-group">
                                <label>Slug *</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} className="form-control" required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Short Description</label>
                            <textarea name="short_description" value={formData.short_description} onChange={handleInputChange} rows="2" className="form-control" placeholder="Brief summary"></textarea>
                        </div>
                        <div className="form-group">
                            <label>Full Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" className="form-control" placeholder="Detailed description"></textarea>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Appearance</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Icon (emoji or class)</label>
                                <input type="text" name="icon" value={formData.icon} onChange={handleInputChange} className="form-control" placeholder="e.g., 🚀 or fa-rocket" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Image</label>
                            <div className="image-upload-container">
                                <div className="image-preview">
                                    {previewImage ? <img src={previewImage} alt="Preview" /> : <span className="image-preview-placeholder">No image</span>}
                                </div>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Settings</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Order Number</label>
                                <input type="number" name="order_number" value={formData.order_number} onChange={handleInputChange} className="form-control" min="0" />
                            </div>
                            <div className="form-group">
                                <label>Active</label>
                                <div className="toggle-switch">
                                    <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} />
                                    <span>{formData.is_active ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/services')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : (isEdit ? 'Update Service' : 'Create Service')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceForm;
