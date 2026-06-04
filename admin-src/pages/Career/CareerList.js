import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { careerAPI } from '../../api/apiService';
import { toast } from 'react-toastify';

const CareerList = () => {
    const navigate = useNavigate();
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchCareers(); }, []);

    const fetchCareers = async () => {
        try {
            const response = await careerAPI.getAll();
            setCareers(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching careers:', error);
            toast.error('Failed to load careers');
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this career?')) {
            try {
                await careerAPI.delete(id);
                toast.success('Career deleted successfully');
                fetchCareers();
            } catch (error) {
                console.error('Error deleting career:', error);
                toast.error('Failed to delete career');
            }
        }
    };

    if (loading) return <div className="page-container"><div className="loading-container"><div className="loading-spinner"></div></div></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Careers</h2>
                <button onClick={() => navigate('/dashboard/careers/new')} className="btn btn-primary">+ Add New Career</button>
            </div>

            {careers.length === 0 ? (
                <div className="content-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">💼</div>
                        <h3>No Careers Yet</h3>
                        <p>Post your first job opening</p>
                        <button onClick={() => navigate('/dashboard/careers/new')} className="btn btn-primary" style={{ marginTop: '15px' }}>Add First Career</button>
                    </div>
                </div>
            ) : (
                <div className="content-card table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Department</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {careers.map((career) => (
                                <tr key={career.id}>
                                    <td><strong>{career.title}</strong></td>
                                    <td>{career.department}</td>
                                    <td>{career.location}</td>
                                    <td>{career.employment_type}</td>
                                    <td><span className={`status-badge ${career.status === 'open' ? 'status-active' : 'status-inactive'}`}>{career.status || 'Draft'}</span></td>
                                    <td className="text-right">
                                        <button onClick={() => navigate(`/dashboard/careers/${career.id}/edit`)} className="btn btn-sm btn-secondary mr-2">Edit</button>
                                        <button onClick={() => handleDelete(career.id)} className="btn btn-sm btn-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CareerList;
