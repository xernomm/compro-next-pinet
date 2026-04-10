import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { newsAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const NewsForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: '',
        excerpt: '',
        content: '',
        author: '',
        published_date: '',
        is_featured: false,
        is_published: false,
        meta_title: '',
        meta_description: '',
        tags: '',
    });
    const [featuredImage, setFeaturedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [previewGallery, setPreviewGallery] = useState([]);

    useEffect(() => {
        if (isEdit) fetchNews();
    }, [id]);

    const fetchNews = async () => {
        try {
            setFetching(true);
            const response = await newsAPI.getById(id);
            const newsItem = response.data.data || response.data;
            setFormData({
                title: newsItem.title || '',
                slug: newsItem.slug || '',
                category: newsItem.category || '',
                excerpt: newsItem.excerpt || '',
                content: newsItem.content || '',
                author: newsItem.author || '',
                published_date: newsItem.published_date ? newsItem.published_date.split('T')[0] : '',
                is_featured: newsItem.is_featured ?? false,
                is_published: newsItem.is_published ?? false,
                meta_title: newsItem.meta_title || '',
                meta_description: newsItem.meta_description || '',
                tags: Array.isArray(newsItem.tags) ? newsItem.tags.join(', ') : newsItem.tags || '',
            });
            if (newsItem.featured_image) setPreviewImage(getImageUrl(newsItem.featured_image));
        } catch (error) {
            console.error('Error fetching news:', error);
            toast.error('Failed to load news');
            navigate('/dashboard/news');
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

        if (name === 'title' && !isEdit) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFeaturedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setGalleryFiles(files);
            setPreviewGallery(files.map(file => URL.createObjectURL(file)));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (key !== 'tags') submitData.append(key, formData[key]);
            });
            if (formData.tags) {
                formData.tags.split(',').map(t => t.trim()).filter(t => t).forEach(t => submitData.append('tags', t));
            }
            if (featuredImage) submitData.append('featured_image', featuredImage);
            galleryFiles.forEach(file => submitData.append('gallery', file));

            if (isEdit) {
                await newsAPI.update(id, submitData);
                toast.success('News updated successfully');
            } else {
                await newsAPI.create(submitData);
                toast.success('News created successfully');
            }
            navigate('/dashboard/news');
        } catch (error) {
            console.error('Error saving news:', error);
            toast.error('Failed to save news');
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
                <button type="button" className="btn btn-secondary btn-back" onClick={() => navigate('/dashboard/news')}>
                    ← Back
                </button>
                <h2>{isEdit ? 'Edit News' : 'Add New News'}</h2>
            </div>

            <div className="content-card form-page-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3 className="form-section-title">Basic Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Title *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label>Slug *</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} className="form-control" required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Author</label>
                                <input type="text" name="author" value={formData.author} onChange={handleInputChange} className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Excerpt</label>
                            <textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows="2" className="form-control"></textarea>
                        </div>
                        <div className="form-group">
                            <label>Content *</label>
                            <textarea name="content" value={formData.content} onChange={handleInputChange} rows="8" className="form-control" required></textarea>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Media</h3>
                        <div className="form-group">
                            <label>Featured Image</label>
                            <div className="image-upload-container">
                                <div className="image-preview" style={{ width: '200px', height: '120px' }}>
                                    {previewImage ? <img src={previewImage} alt="Preview" /> : <span className="image-preview-placeholder">No image</span>}
                                </div>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Gallery Images</label>
                            {previewGallery.length > 0 && (
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                    {previewGallery.map((url, i) => <img key={i} src={url} alt={`Gallery ${i}`} style={{ height: '60px', width: '60px', objectFit: 'cover', borderRadius: '4px' }} />)}
                                </div>
                            )}
                            <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="form-control" />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Publishing</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Published Date</label>
                                <input type="date" name="published_date" value={formData.published_date} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Tags (comma-separated)</label>
                                <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} className="form-control" placeholder="technology, innovation" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Featured</label>
                                <div className="toggle-switch">
                                    <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange} />
                                    <span>{formData.is_featured ? 'Yes' : 'No'}</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Published</label>
                                <div className="toggle-switch">
                                    <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleInputChange} />
                                    <span>{formData.is_published ? 'Yes' : 'Draft'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">SEO</h3>
                        <div className="form-group">
                            <label>Meta Title</label>
                            <input type="text" name="meta_title" value={formData.meta_title} onChange={handleInputChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Meta Description</label>
                            <textarea name="meta_description" value={formData.meta_description} onChange={handleInputChange} rows="2" className="form-control"></textarea>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/news')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : (isEdit ? 'Update News' : 'Create News')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewsForm;
