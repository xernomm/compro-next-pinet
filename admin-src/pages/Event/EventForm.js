import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const EventForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        location: '',
        event_date: '',
        event_time: '',
        end_date: '',
        registration_link: '',
        is_featured: false,
        status: 'draft',
        meta_title: '',
        meta_description: '',
    });
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => { if (isEdit) fetchEvent(); }, [id]);

    const fetchEvent = async () => {
        try {
            setFetching(true);
            const response = await eventAPI.getById(id);
            const event = response.data.data || response.data;
            setFormData({
                title: event.title || '',
                slug: event.slug || '',
                description: event.description || '',
                location: event.location || '',
                event_date: event.event_date ? event.event_date.split('T')[0] : '',
                event_time: event.event_time || '',
                end_date: event.end_date ? event.end_date.split('T')[0] : '',
                registration_link: event.registration_link || '',
                is_featured: event.is_featured ?? false,
                status: event.status || 'draft',
                meta_title: event.meta_title || '',
                meta_description: event.meta_description || '',
            });
            if (event.image_url) setPreviewImage(getImageUrl(event.image_url));
        } catch (error) {
            console.error('Error fetching event:', error);
            toast.error('Failed to load event');
            navigate('/dashboard/events');
        } finally {
            setFetching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (name === 'title' && !isEdit) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
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

            if (isEdit) { await eventAPI.update(id, submitData); toast.success('Event updated successfully'); }
            else { await eventAPI.create(submitData); toast.success('Event created successfully'); }
            navigate('/dashboard/events');
        } catch (error) {
            console.error('Error saving event:', error);
            toast.error('Failed to save event');
        } finally { setLoading(false); }
    };

    if (fetching) return <div className="page-container"><div className="loading-container"><div className="loading-spinner"></div></div></div>;

    return (
        <div className="page-container">
            <div className="form-page-header">
                <button type="button" className="btn btn-secondary btn-back" onClick={() => navigate('/dashboard/events')}>← Back</button>
                <h2>{isEdit ? 'Edit Event' : 'Add New Event'}</h2>
            </div>

            <div className="content-card form-page-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3 className="form-section-title">Basic Information</h3>
                        <div className="form-row">
                            <div className="form-group"><label>Title *</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-control" required /></div>
                            <div className="form-group"><label>Slug *</label><input type="text" name="slug" value={formData.slug} onChange={handleInputChange} className="form-control" required /></div>
                        </div>
                        <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" className="form-control"></textarea></div>
                        <div className="form-group"><label>Location</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} className="form-control" /></div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Date & Time</h3>
                        <div className="form-row three-cols">
                            <div className="form-group"><label>Event Date</label><input type="date" name="event_date" value={formData.event_date} onChange={handleInputChange} className="form-control" /></div>
                            <div className="form-group"><label>Event Time</label><input type="text" name="event_time" value={formData.event_time} onChange={handleInputChange} className="form-control" placeholder="e.g., 09:00 AM" /></div>
                            <div className="form-group"><label>End Date</label><input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} className="form-control" /></div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Media & Registration</h3>
                        <div className="form-group">
                            <label>Event Image</label>
                            <div className="image-upload-container">
                                <div className="image-preview" style={{ width: '200px', height: '120px' }}>{previewImage ? <img src={previewImage} alt="Preview" /> : <span className="image-preview-placeholder">No image</span>}</div>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" />
                            </div>
                        </div>
                        <div className="form-group"><label>Registration Link</label><input type="url" name="registration_link" value={formData.registration_link} onChange={handleInputChange} className="form-control" /></div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Settings</h3>
                        <div className="form-row three-cols">
                            <div className="form-group">
                                <label>Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="form-control">
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="form-group"><label>Featured</label><div className="toggle-switch"><input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange} /><span>{formData.is_featured ? 'Yes' : 'No'}</span></div></div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/events')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update Event' : 'Create Event')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventForm;
