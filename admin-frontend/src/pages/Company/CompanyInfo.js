import React, { useState, useEffect } from 'react';
import { companyAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const CompanyInfo = () => {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        company_name: '',
        tagline: '',
        about: '',
        history: '',
        vision: '',
        mission: '',
        established_year: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postal_code: '',
        country: 'Indonesia',
        facebook_url: '',
        twitter_url: '',
        instagram_url: '',
        linkedin_url: '',
        youtube_url: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
    });
    const [logo, setLogo] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);

    useEffect(() => {
        fetchCompanyInfo();
    }, []);

    const fetchCompanyInfo = async () => {
        try {
            const response = await companyAPI.getInfo();
            const data = response.data.data || response.data;
            setFormData({
                company_name: data.company_name || '',
                tagline: data.tagline || '',
                about: data.about || '',
                history: data.history || '',
                vision: data.vision || '',
                mission: data.mission || '',
                established_year: data.established_year || '',
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || '',
                city: data.city || '',
                province: data.province || '',
                postal_code: data.postal_code || '',
                country: data.country || 'Indonesia',
                facebook_url: data.facebook_url || '',
                twitter_url: data.twitter_url || '',
                instagram_url: data.instagram_url || '',
                linkedin_url: data.linkedin_url || '',
                youtube_url: data.youtube_url || '',
                meta_title: data.meta_title || '',
                meta_description: data.meta_description || '',
                meta_keywords: data.meta_keywords || '',
            });
            if (data.logo_url) {
                const fullLogoUrl = getImageUrl(data.logo_url);
                setPreviewLogo(fullLogoUrl);
                console.log('Logo URL:', data.logo_url);
                console.log('Full Logo URL:', fullLogoUrl);
            }
        } catch (error) {
            console.error('Error fetching company info:', error);
            toast.error('Failed to load company information');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
            await companyAPI.updateInfo(formData);

            if (logo) {
                const logoData = new FormData();
                logoData.append('logo', logo);
                await companyAPI.uploadLogo(logoData);
            }

            toast.success('Company information updated successfully');
            fetchCompanyInfo();
        } catch (error) {
            console.error('Error updating company info:', error);
            toast.error('Failed to update company information');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.company_name) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Company Information</h2>
            </div>

            <div className="content-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        {/* Logo Section */}
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Logo</label>
                            <div className="flex items-center gap-4">
                                {previewLogo && (
                                    <img
                                        src={previewLogo}
                                        alt="Company Logo"
                                        style={{ height: '80px', width: '80px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="form-control"
                                    style={{ width: 'auto' }}
                                />
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="form-group">
                            <label>Company Name *</label>
                            <input
                                type="text"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Tagline</label>
                            <input
                                type="text"
                                name="tagline"
                                value={formData.tagline}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>Established Year</label>
                            <input
                                type="number"
                                name="established_year"
                                value={formData.established_year}
                                onChange={handleChange}
                                className="form-control"
                                min="1900"
                                max={new Date().getFullYear()}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>About</label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                rows="4"
                                className="form-control"
                            ></textarea>
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>History</label>
                            <textarea
                                name="history"
                                value={formData.history}
                                onChange={handleChange}
                                rows="4"
                                className="form-control"
                            ></textarea>
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Vision</label>
                            <textarea
                                name="vision"
                                value={formData.vision}
                                onChange={handleChange}
                                rows="3"
                                className="form-control"
                            ></textarea>
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Mission</label>
                            <textarea
                                name="mission"
                                value={formData.mission}
                                onChange={handleChange}
                                rows="3"
                                className="form-control"
                            ></textarea>
                        </div>

                        {/* Address Section */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <h3 style={{ fontSize: '18px', margin: '20px 0 10px', color: '#2c3e50' }}>Address Information</h3>
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Street Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                className="form-control"
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>Province</label>
                            <input
                                type="text"
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>Postal Code</label>
                            <input
                                type="text"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        {/* Social Media */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <h3 style={{ fontSize: '18px', margin: '20px 0 10px', color: '#2c3e50' }}>Social Media</h3>
                        </div>

                        <div className="form-group">
                            <label>Facebook URL</label>
                            <input
                                type="url"
                                name="facebook_url"
                                value={formData.facebook_url}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="https://facebook.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Twitter URL</label>
                            <input
                                type="url"
                                name="twitter_url"
                                value={formData.twitter_url}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="https://twitter.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Instagram URL</label>
                            <input
                                type="url"
                                name="instagram_url"
                                value={formData.instagram_url}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="https://instagram.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label>LinkedIn URL</label>
                            <input
                                type="url"
                                name="linkedin_url"
                                value={formData.linkedin_url}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="https://linkedin.com/company/..."
                            />
                        </div>

                        <div className="form-group">
                            <label>YouTube URL</label>
                            <input
                                type="url"
                                name="youtube_url"
                                value={formData.youtube_url}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="https://youtube.com/..."
                            />
                        </div>

                        {/* SEO Meta */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <h3 style={{ fontSize: '18px', margin: '20px 0 10px', color: '#2c3e50' }}>SEO Meta Information</h3>
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Meta Title</label>
                            <input
                                type="text"
                                name="meta_title"
                                value={formData.meta_title}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Meta Description</label>
                            <textarea
                                name="meta_description"
                                value={formData.meta_description}
                                onChange={handleChange}
                                rows="3"
                                className="form-control"
                            ></textarea>
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Meta Keywords</label>
                            <textarea
                                name="meta_keywords"
                                value={formData.meta_keywords}
                                onChange={handleChange}
                                rows="2"
                                className="form-control"
                                placeholder="keyword1, keyword2, keyword3"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanyInfo;
