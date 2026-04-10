import React, { useState } from 'react';
import { TextField, MenuItem, Snackbar, Alert, CircularProgress } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { contactAPI } from '../../api/apiService';

const ContactSection = ({ companyInfo }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        category: 'general',
    });

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const categories = [
        { value: 'general', label: 'General Inquiry' },
        { value: 'sales', label: 'Sales' },
        { value: 'support', label: 'Support' },
        { value: 'partnership', label: 'Partnership' },
        { value: 'career', label: 'Career' },
        { value: 'other', label: 'Other' },
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await contactAPI.create(formData);
            setSnackbar({
                open: true,
                message: 'Thank you for contacting us! We will get back to you soon.',
                severity: 'success',
            });
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                subject: '',
                message: '',
                category: 'general',
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to send message. Please try again.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <section id="contact" className="section-container">
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-subtitle">
                Have a question or want to work together? We'd love to hear from you.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Info Cards */}
                <div className="space-y-6">
                    {companyInfo?.email && (
                        <div className="card p-6 card-hover-red">
                            <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                                <EmailIcon className="text-primary-600 dark:text-primary-400" fontSize="large" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">Email Us</h3>
                            <a
                                href={`mailto:${companyInfo.email}`}
                                className="text-primary-600 dark:text-primary-400 hover:underline break-all"
                            >
                                {companyInfo.email}
                            </a>
                        </div>
                    )}

                    {companyInfo?.phone && (
                        <div className="card p-6 card-hover-red">
                            <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                                <PhoneIcon className="text-primary-600 dark:text-primary-400" fontSize="large" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">Call Us</h3>
                            <a
                                href={`tel:${companyInfo.phone}`}
                                className="text-primary-600 dark:text-primary-400 hover:underline"
                            >
                                {companyInfo.phone}
                            </a>
                        </div>
                    )}

                    {companyInfo?.address && (
                        <div className="card p-6 card-hover-red">
                            <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                                <LocationOnIcon className="text-primary-600 dark:text-primary-400" fontSize="large" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">Visit Us</h3>
                            <div className="text-gray-600 dark:text-gray-400">
                                <p>{companyInfo.address}</p>
                                {(companyInfo.city || companyInfo.province || companyInfo.postal_code) && (
                                    <p>
                                        {[companyInfo.city, companyInfo.province, companyInfo.postal_code]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </p>
                                )}
                                {companyInfo.country && <p>{companyInfo.country}</p>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <div className="card p-8">
                        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                            Send us a Message
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'var(--color-text)',
                                            '& fieldset': {
                                                borderColor: 'var(--color-text-secondary)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#dc2626',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#dc2626',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'var(--color-text-secondary)',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#dc2626',
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'var(--color-text)',
                                            '& fieldset': {
                                                borderColor: 'var(--color-text-secondary)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#dc2626',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#dc2626',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'var(--color-text-secondary)',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#dc2626',
                                        },
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'var(--color-text)',
                                            '& fieldset': {
                                                borderColor: 'var(--color-text-secondary)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#dc2626',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#dc2626',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'var(--color-text-secondary)',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#dc2626',
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'var(--color-text)',
                                            '& fieldset': {
                                                borderColor: 'var(--color-text-secondary)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#dc2626',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#dc2626',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'var(--color-text-secondary)',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#dc2626',
                                        },
                                    }}
                                />
                            </div>

                            <TextField
                                fullWidth
                                select
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: 'var(--color-text)',
                                        '& fieldset': {
                                            borderColor: 'var(--color-text-secondary)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#dc2626',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#dc2626',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--color-text-secondary)',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#dc2626',
                                    },
                                    '& .MuiSelect-icon': {
                                        color: 'var(--color-text-secondary)',
                                    },
                                }}
                            >
                                {categories.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                label="Subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: 'var(--color-text)',
                                        '& fieldset': {
                                            borderColor: 'var(--color-text-secondary)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#dc2626',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#dc2626',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--color-text-secondary)',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#dc2626',
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                multiline
                                rows={6}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: 'var(--color-text)',
                                        '& fieldset': {
                                            borderColor: 'var(--color-text-secondary)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#dc2626',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#dc2626',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--color-text-secondary)',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#dc2626',
                                    },
                                }}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress size={20} sx={{ color: 'white', mr: 2 }} />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="mt-12">
                <div className="card p-4 h-96 overflow-hidden relative group">
                    <iframe
                        title="Google Maps Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6507182963956!2d106.78610947475013!3d-6.177489093809894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6aa7706f5af%3A0x2c11a8e7bb2c1e53!2sPT%20Prima%20Integrasi%20Network!5e0!3m2!1sid!2sid!4v1767774503301!5m2!1sid!2sid"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        className="rounded-2xl w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                    ></iframe>

                    {/* Overlay Button */}
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a
                            href="https://maps.app.goo.gl/2CctpbXDG9i7vbmWA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary shadow-lg flex items-center gap-2"
                        >
                            <LocationOnIcon fontSize="small" />
                            Open in Google Maps
                        </a>
                    </div>
                </div>
            </div>


            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </section>
    );
};

export default ContactSection;
