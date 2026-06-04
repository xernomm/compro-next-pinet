import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const EventList = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchEvents(); }, []);

    const fetchEvents = async () => {
        try {
            const response = await eventAPI.getAll();
            setEvents(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await eventAPI.delete(id);
                toast.success('Event deleted successfully');
                fetchEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
                toast.error('Failed to delete event');
            }
        }
    };

    if (loading) {
        return <div className="page-container"><div className="loading-container"><div className="loading-spinner"></div></div></div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Events</h2>
                <button onClick={() => navigate('/dashboard/events/new')} className="btn btn-primary">+ Add New Event</button>
            </div>

            {events.length === 0 ? (
                <div className="content-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">📅</div>
                        <h3>No Events Yet</h3>
                        <p>Create your first event</p>
                        <button onClick={() => navigate('/dashboard/events/new')} className="btn btn-primary" style={{ marginTop: '15px' }}>Add First Event</button>
                    </div>
                </div>
            ) : (
                <div className="content-card table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id}>
                                    <td>{event.image_url && <img src={getImageUrl(event.image_url)} alt={event.title} style={{ height: '40px', width: '64px', objectFit: 'cover', borderRadius: '4px' }} />}</td>
                                    <td><strong>{event.title}</strong></td>
                                    <td>{event.location}</td>
                                    <td>{event.event_date ? new Date(event.event_date).toLocaleDateString() : '-'}</td>
                                    <td><span className={`status-badge ${event.status === 'published' ? 'status-active' : 'status-inactive'}`}>{event.status || 'Draft'}</span></td>
                                    <td className="text-right">
                                        <button onClick={() => navigate(`/dashboard/events/${event.id}/edit`)} className="btn btn-sm btn-secondary mr-2">Edit</button>
                                        <button onClick={() => handleDelete(event.id)} className="btn btn-sm btn-danger">Delete</button>
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

export default EventList;
