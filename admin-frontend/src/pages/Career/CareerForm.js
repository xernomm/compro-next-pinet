import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { careerAPI } from '../../api/apiService';
import { toast } from 'react-toastify';

const CareerForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        department: '',
        location: '',
        employment_type: 'Full-time',
        experience_level: '',
        salary_range: '',
        description: '',
        requirements: '',
        responsibilities: '',
        benefits: '',
        application_deadline: '',
        status: 'draft',
    });

    useEffect(() => { if (isEdit) fetchCareer(); }, [id]);

    const fetchCareer = async () => {
        try {
            setFetching(true);
            const response = await careerAPI.getById(id);
            const career = response.data.data || response.data;
            setFormData({
                title: career.title || '',
                slug: career.slug || '',
                department: career.department || '',
                location: career.location || '',
                employment_type: career.employment_type || 'Full-time',
                experience_level: career.experience_level || '',
                salary_range: career.salary_range || '',
                description: career.description || '',
                requirements: Array.isArray(career.requirements) ? career.requirements.join('\n') : career.requirements || '',
                responsibilities: Array.isArray(career.responsibilities) ? career.responsibilities.join('\n') : career.responsibilities || '',
                benefits: Array.isArray(career.benefits) ? career.benefits.join('\n') : career.benefits || '',
                application_deadline: career.application_deadline ? career.application_deadline.split('T')[0] : '',
                status: career.status || 'draft',
            });
        } catch (error) {
            console.error('Error fetching career:', error);
            toast.error('Failed to load career');
            navigate('/dashboard/careers');
        } finally { setFetching(false); }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'title' && !isEdit) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submitData = { ...formData };
            if (typeof submitData.requirements === 'string') {
                submitData.requirements = submitData.requirements.split('\n').filter(r => r.trim());
            }
            if (typeof submitData.responsibilities === 'string') {
                submitData.responsibilities = submitData.responsibilities.split('\n').filter(r => r.trim());
            }
            if (typeof submitData.benefits === 'string') {
                submitData.benefits = submitData.benefits.split('\n').filter(b => b.trim());
            }

            if (isEdit) { await careerAPI.update(id, submitData); toast.success('Career updated successfully'); }
            else { await careerAPI.create(submitData); toast.success('Career created successfully'); }
            navigate('/dashboard/careers');
        } catch (error) {
            console.error('Error saving career:', error);
            toast.error('Failed to save career');
        } finally { setLoading(false); }
    };

    if (fetching) return <div className="page-container"><div className="loading-container"><div className="loading-spinner"></div></div></div>;

    return (
        <div className="page-container">
            <div className="form-page-header">
                <button type="button" className="btn btn-secondary btn-back" onClick={() => navigate('/dashboard/careers')}>← Back</button>
                <h2>{isEdit ? 'Edit Career' : 'Add New Career'}</h2>
            </div>

            <div className="content-card form-page-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3 className="form-section-title">Basic Information</h3>
                        <div className="form-row">
                            <div className="form-group"><label>Title *</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-control" required /></div>
                            <div className="form-group"><label>Slug *</label><input type="text" name="slug" value={formData.slug} onChange={handleInputChange} className="form-control" required /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Department</label><input type="text" name="department" value={formData.department} onChange={handleInputChange} className="form-control" /></div>
                            <div className="form-group"><label>Location</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} className="form-control" /></div>
                        </div>
                        <div className="form-row three-cols">
                            <div className="form-group">
                                <label>Employment Type</label>
                                <select name="employment_type" value={formData.employment_type} onChange={handleInputChange} className="form-control">
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                            <div className="form-group"><label>Experience Level</label><input type="text" name="experience_level" value={formData.experience_level} onChange={handleInputChange} className="form-control" placeholder="e.g., 3-5 years" /></div>
                            <div className="form-group"><label>Salary Range</label><input type="text" name="salary_range" value={formData.salary_range} onChange={handleInputChange} className="form-control" placeholder="e.g., $50k - $70k" /></div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Job Details</h3>
                        <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="form-control"></textarea></div>
                        <div className="form-row">
                            <div className="form-group"><label>Requirements (one per line)</label><textarea name="requirements" value={formData.requirements} onChange={handleInputChange} rows="5" className="form-control" placeholder="Bachelor's degree&#10;3+ years experience"></textarea></div>
                            <div className="form-group"><label>Responsibilities (one per line)</label><textarea name="responsibilities" value={formData.responsibilities} onChange={handleInputChange} rows="5" className="form-control" placeholder="Lead development team&#10;Code review"></textarea></div>
                        </div>
                        <div className="form-group"><label>Benefits (one per line)</label><textarea name="benefits" value={formData.benefits} onChange={handleInputChange} rows="3" className="form-control" placeholder="Health insurance&#10;Remote work"></textarea></div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Settings</h3>
                        <div className="form-row">
                            <div className="form-group"><label>Application Deadline</label><input type="date" name="application_deadline" value={formData.application_deadline} onChange={handleInputChange} className="form-control" /></div>
                            <div className="form-group">
                                <label>Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="form-control">
                                    <option value="draft">Draft</option>
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/careers')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update Career' : 'Create Career')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CareerForm;
