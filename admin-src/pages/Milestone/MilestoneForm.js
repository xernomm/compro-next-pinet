import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { milestoneAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const MilestoneForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [formData, setFormData] = useState({
        year: new Date().getFullYear(),
        title: '',
        description: '',
        icon: '',
        category: 'achievement',
        order_number: 0,
        is_active: true,
    });
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => { if (isEdit) fetchMilestone(); }, [id]);

    const fetchMilestone = async () => {
        try {
            setFetching(true);
            const response = await milestoneAPI.getById(id);
            const milestone = response.data.data || response.data;
            setFormData({
                year: milestone.year || new Date().getFullYear(),
                title: milestone.title || '',
                description: milestone.description || '',
                icon: milestone.icon || '',
                category: milestone.category || 'achievement',
                order_number: milestone.order_number || 0,
                is_active: milestone.is_active ?? true,
            });
            if (milestone.image_url) setPreviewImage(getImageUrl(milestone.image_url));
        } catch (error) {
            console.error('Error fetching milestone:', error);
            toast.error('Failed to load milestone');
            navigate('/dashboard/milestones');
        } finally { setFetching(false); }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImage(file); setPreviewImage(URL.createObjectURL(file)); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
            if (image) submitData.append('image', image);

            if (isEdit) { await milestoneAPI.update(id, submitData); toast.success('Milestone updated successfully'); }
            else { await milestoneAPI.create(submitData); toast.success('Milestone created successfully'); }
            navigate('/dashboard/milestones');
        } catch (error) {
            console.error('Error saving milestone:', error);
            toast.error('Failed to save milestone');
        } finally { setLoading(false); }
    };

    if (fetching) return <div className="page-container"><div className="loading-container"><div className="loading-spinner"></div></div></div>;

    return (
        <div className="page-container">
            <div className="form-page-header">
                <button type="button" className="btn btn-secondary btn-back" onClick={() => navigate('/dashboard/milestones')}>← Back</button>
                <h2>{isEdit ? 'Edit Milestone' : 'Add New Milestone'}</h2>
            </div>

            <div className="content-card form-page-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3 className="form-section-title">Content</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Year *</label>
                                <input type="number" name="year" value={formData.year} onChange={handleInputChange} className="form-control" required min="1900" max="2100" />
                            </div>
                            <div className="form-group">
                                <label>Category *</label>
                                <select name="category" value={formData.category} onChange={handleInputChange} className="form-control" required>
                                    <option value="founding">🏛️ Founding</option>
                                    <option value="partnership">🤝 Partnership</option>
                                    <option value="achievement">🏆 Achievement</option>
                                    <option value="expansion">🚀 Expansion</option>
                                    <option value="product">📦 Product</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group"><label>Title *</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-control" required placeholder="e.g., Oracle Partnership Established" /></div>
                        <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="form-control" placeholder="Detailed description of this milestone..."></textarea></div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Appearance</h3>
                        <div className="form-group"><label>Icon (emoji)</label><input type="text" name="icon" value={formData.icon} onChange={handleInputChange} className="form-control" placeholder="e.g., 🏆" /></div>
                        <div className="form-group">
                            <label>Image</label>
                            <div className="image-upload-container">
                                <div className="image-preview">{previewImage ? <img src={previewImage} alt="Preview" /> : <span className="image-preview-placeholder">No image</span>}</div>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Settings</h3>
                        <div className="form-row">
                            <div className="form-group"><label>Order Number</label><input type="number" name="order_number" value={formData.order_number} onChange={handleInputChange} className="form-control" min="0" /></div>
                            <div className="form-group"><label>Active</label><div className="toggle-switch"><input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} /><span>{formData.is_active ? 'Active' : 'Inactive'}</span></div></div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/milestones')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update Milestone' : 'Create Milestone')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MilestoneForm;
