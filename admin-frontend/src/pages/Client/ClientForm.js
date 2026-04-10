import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const ClientForm = () => {
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
        industry: '',
        project_description: '',
        testimonial: '',
        testimonial_author: '',
        testimonial_position: '',
        collaboration_since: '',
        order_number: 0,
        is_featured: false,
        is_active: true,
    });
    const [logo, setLogo] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);

    useEffect(() => {
        if (isEdit) {
            fetchClient();
        }
    }, [id]);

    const fetchClient = async () => {
        try {
            setFetching(true);
            const response = await clientAPI.getById(id);
            const client = response.data.data || response.data;
            setFormData({
                name: client.name || '',
                slug: client.slug || '',
                description: client.description || '',
                website_url: client.website_url || '',
                industry: client.industry || '',
                project_description: client.project_description || '',
                testimonial: client.testimonial || '',
                testimonial_author: client.testimonial_author || '',
                testimonial_position: client.testimonial_position || '',
                collaboration_since: client.collaboration_since || '',
                order_number: client.order_number || 0,
                is_featured: client.is_featured ?? false,
                is_active: client.is_active ?? true,
            });
            if (client.logo_url) {
                setPreviewLogo(getImageUrl(client.logo_url));
            }
        } catch (error) {
            console.error('Error fetching client:', error);
            toast.error('Failed to load client');
            navigate('/dashboard/clients');
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
                await clientAPI.update(id, submitData);
                toast.success('Client updated successfully');
            } else {
                await clientAPI.create(submitData);
                toast.success('Client created successfully');
            }
            navigate('/dashboard/clients');
        } catch (error) {
            console.error('Error saving client:', error);
            toast.error('Failed to save client');
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
                    onClick={() => navigate('/dashboard/clients')}
                >
                    ← Back
                </button>
                <h2>{isEdit ? 'Edit Client' : 'Add New Client'}</h2>
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
                                    placeholder="Enter client name"
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
                                placeholder="Brief description of the client"
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
                        <div className="form-row">
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
                            <div className="form-group">
                                <label>Industry</label>
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    list="industry-types"
                                    placeholder="Type or select industry"
                                />
                                <datalist id="industry-types">
                                    <option value="Technology" />
                                    <option value="Finance" />
                                    <option value="Banking" />
                                    <option value="Healthcare" />
                                    <option value="Manufacturing" />
                                    <option value="Retail" />
                                    <option value="Education" />
                                    <option value="Government" />
                                    <option value="Telecommunications" />
                                    <option value="Energy" />
                                    <option value="Logistics" />
                                    <option value="Transportation" />
                                    <option value="Hospitality" />
                                    <option value="Media" />
                                    <option value="Insurance" />
                                    <option value="Construction" />
                                    <option value="Agriculture" />
                                    <option value="Real Estate" />
                                    <option value="Automotive" />
                                    <option value="Pharmaceutical" />
                                </datalist>
                                <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                                    You can type a custom industry or select from suggestions
                                </small>
                            </div>
                        </div>
                    </div>

                    {/* Project Details */}
                    <div className="form-section">
                        <h3 className="form-section-title">Project Details</h3>
                        <div className="form-group">
                            <label>Project Description</label>
                            <textarea
                                name="project_description"
                                value={formData.project_description}
                                onChange={handleInputChange}
                                rows="4"
                                className="form-control"
                                placeholder="Describe the project or collaboration with this client"
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Collaboration Since</label>
                            <input
                                type="text"
                                name="collaboration_since"
                                value={formData.collaboration_since}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="e.g., 2020 or January 2020"
                            />
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="form-section">
                        <h3 className="form-section-title">Testimonial (Optional)</h3>
                        <div className="form-group">
                            <label>Testimonial</label>
                            <textarea
                                name="testimonial"
                                value={formData.testimonial}
                                onChange={handleInputChange}
                                rows="4"
                                className="form-control"
                                placeholder="Client testimonial or quote"
                            ></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Author Name</label>
                                <input
                                    type="text"
                                    name="testimonial_author"
                                    value={formData.testimonial_author}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label>Author Position</label>
                                <input
                                    type="text"
                                    name="testimonial_position"
                                    value={formData.testimonial_position}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="CEO, Company Name"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="form-section">
                        <h3 className="form-section-title">Settings</h3>
                        <div className="form-row three-cols">
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
                                <label>Featured</label>
                                <div className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleInputChange}
                                    />
                                    <span>{formData.is_featured ? 'Yes' : 'No'}</span>
                                </div>
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
                            onClick={() => navigate('/dashboard/clients')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (isEdit ? 'Update Client' : 'Create Client')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientForm;
