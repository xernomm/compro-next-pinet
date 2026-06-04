import React, { useState, useEffect } from 'react';
import { contactAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import Modal from '../../components/Common/Modal';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentContact, setCurrentContact] = useState(null);
    const [status, setStatus] = useState('');
    const [modalMode, setModalMode] = useState('view'); // 'view' or 'create'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await contactAPI.getAll();
            setContacts(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            toast.error('Failed to load contacts');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const openCreateModal = () => {
        setModalMode('create');
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
        setIsModalOpen(true);
    };

    const openViewModal = (contact) => {
        setModalMode('view');
        setCurrentContact(contact);
        setStatus(contact.status || 'unread');
        setIsModalOpen(true);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await contactAPI.create(formData);
            toast.success('Contact created successfully');
            setIsModalOpen(false);
            fetchContacts();
        } catch (error) {
            console.error('Error creating contact:', error);
            toast.error('Failed to create contact');
        }
    };

    const handleStatusChange = async () => {
        try {
            await contactAPI.updateStatus(currentContact.id, { status });
            toast.success('Contact status updated successfully');
            setIsModalOpen(false);
            fetchContacts();
        } catch (error) {
            console.error('Error updating contact status:', error);
            toast.error('Failed to update contact status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                await contactAPI.delete(id);
                toast.success('Contact deleted successfully');
                fetchContacts();
            } catch (error) {
                console.error('Error deleting contact:', error);
                toast.error('Failed to delete contact');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Contacts</h2>
                <button
                    onClick={openCreateModal}
                    className="btn btn-primary"
                >
                    Add New Contact
                </button>
            </div>

            <div className="content-card table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact) => (
                            <tr key={contact.id}>
                                <td>
                                    {new Date(contact.created_at || Date.now()).toLocaleDateString()}
                                </td>
                                <td>{contact.name}</td>
                                <td>{contact.email}</td>
                                <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contact.subject}</td>
                                <td>
                                    <span className="status-badge" style={{
                                        backgroundColor: contact.status === 'unread' ? '#ffebee' : contact.status === 'read' ? '#e3f2fd' : '#e8f5e9',
                                        color: contact.status === 'unread' ? '#c62828' : contact.status === 'read' ? '#1565c0' : '#2e7d32'
                                    }}>
                                        {contact.status || 'unread'}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button
                                        onClick={() => openViewModal(contact)}
                                        className="btn btn-sm btn-secondary mr-2"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleDelete(contact.id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'create' ? 'Add New Contact' : 'Contact Details'}
            >
                {modalMode === 'create' ? (
                    <form onSubmit={handleCreateSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows="4"
                                className="form-control"
                                required
                            ></textarea>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                ) : (
                    currentContact && (
                        <div>
                            <div className="form-group">
                                <label>Name</label>
                                <p style={{ margin: 0, color: '#2c3e50' }}>{currentContact.name}</p>
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <p style={{ margin: 0, color: '#2c3e50' }}>{currentContact.email}</p>
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <p style={{ margin: 0, color: '#2c3e50' }}>{currentContact.subject}</p>
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <p style={{ margin: 0, color: '#2c3e50', whiteSpace: 'pre-wrap' }}>{currentContact.message}</p>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="unread">Unread</option>
                                    <option value="read">Read</option>
                                    <option value="replied">Replied</option>
                                </select>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleStatusChange}
                                    className="btn btn-primary"
                                >
                                    Update Status
                                </button>
                            </div>
                        </div>
                    )
                )}
            </Modal>
        </div>
    );
};

export default ContactList;
