import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { valueAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const ValueForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: '',
        order_number: 0,
        is_active: true,
    });
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => { if (isEdit) fetchValue(); }, [id]);

    const fetchValue = async () => {
        try {
            setFetching(true);
            const response = await valueAPI.getById(id);
            const value = response.data.data || response.data;
            setFormData({
                title: value.title || '',
                description: value.description || '',
                icon: value.icon || '',
                order_number: value.order_number || 0,
                is_active: value.is_active ?? true,
            });
            if (value.image_url) setPreviewImage(getImageUrl(value.image_url));
        } catch (error) {
            console.error('Error fetching value:', error);
            toast.error('Failed to load value');
            navigate('/dashboard/values');
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

            if (isEdit) { await valueAPI.update(id, submitData); toast.success('Value updated successfully'); }
            else { await valueAPI.create(submitData); toast.success('Value created successfully'); }
            navigate('/dashboard/values');
        } catch (error) {
            console.error('Error saving value:', error);
            toast.error('Failed to save value');
        } finally { setLoading(false); }
    };

    if (fetching) return <div className="page-container"><div className="loading-container"><div className="loading-spinner"></div></div></div>;

    return (
        <div className="page-container">
            <div className="form-page-header">
                <button type="button" className="btn btn-secondary btn-back" onClick={() => navigate('/dashboard/values')}>← Back</button>
                <h2>{isEdit ? 'Edit Value' : 'Add New Value'}</h2>
            </div>

            <div className="content-card form-page-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3 className="form-section-title">Content</h3>
                        <div className="form-group"><label>Title *</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-control" required /></div>
                        <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="form-control"></textarea></div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Appearance</h3>
                        <div className="form-row">
                            <div className="form-group"><label>Icon (emoji)</label><input type="text" name="icon" value={formData.icon} onChange={handleInputChange} className="form-control" placeholder="e.g., ⭐" /></div>
                        </div>
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
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/values')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update Value' : 'Create Value')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ValueForm;
