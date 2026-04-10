import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { heroAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const HeroForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        button_text: '',
        button_link: '',
        order_number: 0,
        is_active: true,
    });
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (isEdit) {
            fetchHero();
        }
    }, [id]);

    const fetchHero = async () => {
        try {
            setFetching(true);
            const response = await heroAPI.getById(id);
            const hero = response.data.data || response.data;
            setFormData({
                title: hero.title || '',
                subtitle: hero.subtitle || '',
                description: hero.description || '',
                button_text: hero.button_text || '',
                button_link: hero.button_link || '',
                order_number: hero.order_number || 0,
                is_active: hero.is_active ?? true,
            });
            if (hero.image_url) {
                setPreviewImage(getImageUrl(hero.image_url));
            }
        } catch (error) {
            console.error('Error fetching hero:', error);
            toast.error('Failed to load hero');
            navigate('/dashboard/heroes');
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
                await heroAPI.update(id, submitData);
                toast.success('Hero updated successfully');
            } else {
                await heroAPI.create(submitData);
                toast.success('Hero created successfully');
            }
            navigate('/dashboard/heroes');
        } catch (error) {
            console.error('Error saving hero:', error);
            toast.error('Failed to save hero');
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
                    onClick={() => navigate('/dashboard/heroes')}
                >
                    ← Back
                </button>
                <h2>{isEdit ? 'Edit Hero' : 'Add New Hero'}</h2>
            </div>

            <div className="content-card form-page-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3 className="form-section-title">Content</h3>
                        <div className="form-group">
                            <label>Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                                placeholder="Main headline"
                            />
                        </div>
                        <div className="form-group">
                            <label>Subtitle</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Secondary headline"
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="form-control"
                                placeholder="Detailed description"
                            ></textarea>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Image</h3>
                        <div className="form-group">
                            <label>Hero Image</label>
                            <div className="image-upload-container">
                                <div className="image-preview" style={{ width: '200px', height: '120px' }}>
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" />
                                    ) : (
                                        <span className="image-preview-placeholder">No image</span>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="form-control"
                                    />
                                    <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                                        Recommended: 1920x1080px or larger
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Call to Action</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Button Text</label>
                                <input
                                    type="text"
                                    name="button_text"
                                    value={formData.button_text}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="e.g., Learn More"
                                />
                            </div>
                            <div className="form-group">
                                <label>Button Link</label>
                                <input
                                    type="text"
                                    name="button_link"
                                    value={formData.button_link}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="e.g., /about or #services"
                                />
                            </div>
                        </div>
                    </div>

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

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/dashboard/heroes')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (isEdit ? 'Update Hero' : 'Create Hero')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HeroForm;
