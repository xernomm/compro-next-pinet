import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { partnerAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const PartnerForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        website_url: '',
        partnership_type: '',
        partnership_since: '',
        order_number: 0,
        is_active: true,
    });
    const [logo, setLogo] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);

    useEffect(() => {
        if (isEdit) {
            fetchPartner();
        }
    }, [id]);

    const fetchPartner = async () => {
        try {
            setFetching(true);
            const response = await partnerAPI.getById(id);
            const partner = response.data.data || response.data;
            setFormData({
                name: partner.name || '',
                slug: partner.slug || '',
                description: partner.description || '',
                website_url: partner.website_url || '',
                partnership_type: partner.partnership_type || '',
                partnership_since: partner.partnership_since || '',
                order_number: partner.order_number || 0,
                is_active: partner.is_active ?? true,
            });
            if (partner.logo_url) {
                setPreviewLogo(getImageUrl(partner.logo_url));
            }
        } catch (error) {
            console.error('Error fetching partner:', error);
            toast.error('Failed to load partner');
            navigate('/dashboard/partners');
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

        // Auto-generate slug from name
        if (name === 'name' && !isEdit) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            setPreviewLogo(URL.createObjectURL(file));
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
            if (logo) {
                submitData.append('logo', logo);
            }

            if (isEdit) {
                await partnerAPI.update(id, submitData);
                toast.success('Partner updated successfully');
            } else {
                await partnerAPI.create(submitData);
                toast.success('Partner created successfully');
            }
            navigate('/dashboard/partners');
        } catch (error) {
            console.error('Error saving partner:', error);
            toast.error('Failed to save partner');
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
                <button
                    type="button"
                    className="btn btn-secondary btn-back"
                    onClick={() => navigate('/dashboard/partners')}
                >
                    ← Back
                </button>
                <h2>{isEdit ? 'Edit Partner' : 'Add New Partner'}</h2>
            </div>

            <div className="content-card form-page-content">
                <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <div className="form-section">
                        <h3 className="form-section-title">Basic Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    required
                                    placeholder="Enter partner name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Slug *</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    required
                                    placeholder="auto-generated-from-name"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="form-control"
                                placeholder="Brief description of the partnership"
                            ></textarea>
                        </div>
                    </div>

                    {/* Logo & Links */}
                    <div className="form-section">
                        <h3 className="form-section-title">Logo & Links</h3>
                        <div className="form-group">
                            <label>Logo</label>
                            <div className="image-upload-container">
                                <div className="image-preview">
                                    {previewLogo ? (
                                        <img src={previewLogo} alt="Logo Preview" />
                                    ) : (
                                        <span className="image-preview-placeholder">No logo</span>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="form-control"
                                    />
                                    <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                                        Recommended: PNG or SVG with transparent background
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Website URL</label>
                            <input
                                type="url"
                                name="website_url"
                                value={formData.website_url}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="https://www.example.com"
                            />
                        </div>
                    </div>

                    {/* Partnership Details */}
                    <div className="form-section">
                        <h3 className="form-section-title">Partnership Details</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Partnership Type</label>
                                <input
                                    type="text"
                                    name="partnership_type"
                                    value={formData.partnership_type}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    list="partnership-types"
                                    placeholder="Type or select partnership type"
                                />
                                <datalist id="partnership-types">
                                    <option value="Technology" />
                                    <option value="Strategic" />
                                    <option value="Vendor" />
                                    <option value="Solution" />
                                    <option value="Integration" />
                                    <option value="Reseller" />
                                    <option value="Distributor" />
                                    <option value="Consulting" />
                                    <option value="Training" />
                                    <option value="Certification" />
                                    <option value="Development" />
                                    <option value="Cloud" />
                                    <option value="Security" />
                                    <option value="Infrastructure" />
                                    <option value="Support" />
                                </datalist>
                                <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                                    You can type a custom category or select from suggestions
                                </small>
                            </div>
                            <div className="form-group">
                                <label>Partnership Since (Year)</label>
                                <input
                                    type="number"
                                    name="partnership_since"
                                    value={formData.partnership_since}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="e.g., 2020"
                                    min="1900"
                                    max="2100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="form-section">
                        <h3 className="form-section-title">Settings</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Order Number</label>
                                <input
                                    type="number"
                                    name="order_number"
                                    value={formData.order_number}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Active</label>
                                <div className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                    />
                                    <span>{formData.is_active ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/dashboard/partners')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (isEdit ? 'Update Partner' : 'Create Partner')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PartnerForm;
