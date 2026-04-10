import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        category: '',
        short_description: '',
        description: '',
        features: '',
        benefits: '',
        target_segment: '',
        brochure_url: '',
        video_url: '',
        price_range: '',
        order_number: 0,
        is_featured: false,
        is_active: true,
        meta_title: '',
        meta_description: '',
    });
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [previewGallery, setPreviewGallery] = useState([]);
    const [specificationEntries, setSpecificationEntries] = useState([{ key: '', value: '' }]);

    useEffect(() => {
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setFetching(true);
            const response = await productAPI.getById(id);
            const product = response.data.data || response.data;
            setFormData({
                name: product.name || '',
                slug: product.slug || '',
                category: product.category || '',
                short_description: product.short_description || '',
                description: product.description || '',
                features: Array.isArray(product.features) ? product.features.join('\n') : product.features || '',
                benefits: Array.isArray(product.benefits) ? product.benefits.join('\n') : product.benefits || '',
                target_segment: product.target_segment || '',
                brochure_url: product.brochure_url || '',
                video_url: product.video_url || '',
                price_range: product.price_range || '',
                order_number: product.order_number || 0,
                is_featured: product.is_featured ?? false,
                is_active: product.is_active ?? true,
                meta_title: product.meta_title || '',
                meta_description: product.meta_description || '',
            });

            let specs = product.specifications;
            if (typeof specs === 'string') {
                try { specs = JSON.parse(specs); } catch (e) { specs = {}; }
            }
            if (specs && typeof specs === 'object' && !Array.isArray(specs)) {
                const entries = Object.entries(specs).map(([key, value]) => ({ key, value: String(value) }));
                setSpecificationEntries(entries.length > 0 ? entries : [{ key: '', value: '' }]);
            }

            if (product.image_url) {
                setPreviewImage(getImageUrl(product.image_url));
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product');
            navigate('/dashboard/products');
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

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setGalleryFiles(files);
            setPreviewGallery(files.map(file => URL.createObjectURL(file)));
        }
    };

    const addSpecificationEntry = () => {
        setSpecificationEntries([...specificationEntries, { key: '', value: '' }]);
    };

    const removeSpecificationEntry = (index) => {
        if (specificationEntries.length > 1) {
            setSpecificationEntries(specificationEntries.filter((_, i) => i !== index));
        }
    };

    const updateSpecificationEntry = (index, field, value) => {
        const updated = [...specificationEntries];
        updated[index][field] = value;
        setSpecificationEntries(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submitData = new FormData();

            Object.keys(formData).forEach(key => {
                if (key !== 'features' && key !== 'benefits') {
                    submitData.append(key, formData[key]);
                }
            });

            if (formData.features) {
                formData.features.split('\n').filter(f => f.trim()).forEach(f => submitData.append('features', f));
            }
            if (formData.benefits) {
                formData.benefits.split('\n').filter(b => b.trim()).forEach(b => submitData.append('benefits', b));
            }

            const specsObject = {};
            specificationEntries.forEach(entry => {
                if (entry.key.trim()) {
                    specsObject[entry.key.trim()] = entry.value.trim();
                }
            });
            if (Object.keys(specsObject).length > 0) {
                submitData.append('specifications', JSON.stringify(specsObject));
            }

            if (image) submitData.append('image', image);
            galleryFiles.forEach(file => submitData.append('gallery', file));

            if (isEdit) {
                await productAPI.update(id, submitData);
                toast.success('Product updated successfully');
            } else {
                await productAPI.create(submitData);
                toast.success('Product created successfully');
            }
            navigate('/dashboard/products');
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Failed to save product');
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
                <button type="button" className="btn btn-secondary btn-back" onClick={() => navigate('/dashboard/products')}>
                    ← Back
                </button>
                <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
            </div>

            <div className="content-card form-page-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3 className="form-section-title">Basic Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control" required />
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
                                <label>Target Segment</label>
                                <input type="text" name="target_segment" value={formData.target_segment} onChange={handleInputChange} className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Short Description</label>
                            <textarea name="short_description" value={formData.short_description} onChange={handleInputChange} rows="2" className="form-control"></textarea>
                        </div>
                        <div className="form-group">
                            <label>Full Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" className="form-control"></textarea>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Features & Benefits</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Features (one per line)</label>
                                <textarea name="features" value={formData.features} onChange={handleInputChange} rows="4" className="form-control" placeholder="Feature 1&#10;Feature 2"></textarea>
                            </div>
                            <div className="form-group">
                                <label>Benefits (one per line)</label>
                                <textarea name="benefits" value={formData.benefits} onChange={handleInputChange} rows="4" className="form-control" placeholder="Benefit 1&#10;Benefit 2"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Specifications</h3>
                        <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                            {specificationEntries.map((entry, index) => (
                                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                                    <input type="text" value={entry.key} onChange={(e) => updateSpecificationEntry(index, 'key', e.target.value)} placeholder="Key" className="form-control" style={{ flex: 1 }} />
                                    <input type="text" value={entry.value} onChange={(e) => updateSpecificationEntry(index, 'value', e.target.value)} placeholder="Value" className="form-control" style={{ flex: 1 }} />
                                    <button type="button" onClick={() => removeSpecificationEntry(index)} className="btn btn-sm btn-danger" disabled={specificationEntries.length === 1}>×</button>
                                </div>
                            ))}
                            <button type="button" onClick={addSpecificationEntry} className="btn btn-sm btn-secondary">+ Add Specification</button>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Media</h3>
                        <div className="form-group">
                            <label>Main Image</label>
                            <div className="image-upload-container">
                                <div className="image-preview">
                                    {previewImage ? <img src={previewImage} alt="Preview" /> : <span className="image-preview-placeholder">No image</span>}
                                </div>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Gallery Images</label>
                            {previewGallery.length > 0 && (
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                    {previewGallery.map((url, i) => (
                                        <img key={i} src={url} alt={`Gallery ${i}`} style={{ height: '60px', width: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                    ))}
                                </div>
                            )}
                            <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="form-control" />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Brochure URL</label>
                                <input type="text" name="brochure_url" value={formData.brochure_url} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Video URL</label>
                                <input type="text" name="video_url" value={formData.video_url} onChange={handleInputChange} className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Pricing & SEO</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Price Range</label>
                                <input type="text" name="price_range" value={formData.price_range} onChange={handleInputChange} className="form-control" placeholder="e.g., $100 - $500" />
                            </div>
                            <div className="form-group">
                                <label>Order Number</label>
                                <input type="number" name="order_number" value={formData.order_number} onChange={handleInputChange} className="form-control" min="0" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Meta Title</label>
                            <input type="text" name="meta_title" value={formData.meta_title} onChange={handleInputChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Meta Description</label>
                            <textarea name="meta_description" value={formData.meta_description} onChange={handleInputChange} rows="2" className="form-control"></textarea>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Settings</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Featured</label>
                                <div className="toggle-switch">
                                    <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange} />
                                    <span>{formData.is_featured ? 'Yes' : 'No'}</span>
                                </div>
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
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/products')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
