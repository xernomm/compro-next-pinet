"use client";

import React, { useState } from 'react';
import { TextField, MenuItem, Snackbar, Alert, CircularProgress } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { contactAPI } from '@/api/apiService';

const inputSx = {
    '& .MuiOutlinedInput-root': {
        fontFamily: "'Inter', sans-serif",
        color: 'var(--color-text)',
        borderRadius: '8px',
        '& fieldset': {
            borderColor: 'var(--color-border)',
            transition: 'all 0.3s',
        },
        '&:hover fieldset': {
            borderColor: 'var(--color-primary)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--color-primary)',
            boxShadow: '0 0 0 3px rgba(255, 45, 45, 0.1)',
        },
    },
    '& .MuiInputLabel-root': {
        fontFamily: "'Inter', sans-serif",
        color: 'var(--color-text-secondary)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: 'var(--color-primary)',
    },
};

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

    const contactCards = [
        {
            icon: <EmailIcon sx={{ fontSize: 24 }} />,
            title: 'Email Us',
            value: companyInfo?.email,
            href: companyInfo?.email ? `mailto:${companyInfo.email}` : null,
            color: '#ff2d2d',
        },
        {
            icon: <PhoneIcon sx={{ fontSize: 24 }} />,
            title: 'Call Us',
            value: companyInfo?.phone,
            href: companyInfo?.phone ? `tel:${companyInfo.phone}` : null,
            color: '#10b981',
        },
        {
            icon: <LocationOnIcon sx={{ fontSize: 24 }} />,
            title: 'Visit Us',
            value: companyInfo?.address,
            extraLines: [
                [companyInfo?.city, companyInfo?.province, companyInfo?.postal_code].filter(Boolean).join(', '),
                companyInfo?.country,
            ].filter(Boolean),
            color: '#ff2d2d',
        },
    ].filter(c => c.value);

    return (
        <section id="contact" className="section-container grid-bg">
            <p className="mono-label text-center mb-3">{'// Get In Touch'}</p>
            <h2 className="section-title">Contact Us</h2>
            <p className="section-subtitle">
                Have a question or want to work together? We&apos;d love to hear from you.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Info Cards */}
                <div className="space-y-4">
                    {contactCards.map((card, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 glass-card glass-highlight"
                        >
                            {/* Accent line */}
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                                style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }}
                            />
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                                style={{
                                    background: `${card.color}15`,
                                    color: card.color,
                                    border: `1px solid ${card.color}25`,
                                }}
                            >
                                {card.icon}
                            </div>
                            <h3
                                className="font-semibold text-base mb-2"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                {card.title}
                            </h3>
                            {card.href ? (
                                <a
                                    href={card.href}
                                    className="hover:underline break-all text-sm"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    {card.value}
                                </a>
                            ) : (
                                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                    <p>{card.value}</p>
                                    {card.extraLines?.map((line, i) => <p key={i}>{line}</p>)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <div
                        className="rounded-xl p-8 relative overflow-hidden glass-card"
                    >
                        <h3
                            className="text-2xl font-bold mb-6"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            Send us a Message
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} required variant="outlined" sx={inputSx} />
                                <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required variant="outlined" sx={inputSx} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} variant="outlined" sx={inputSx} />
                                <TextField fullWidth label="Company" name="company" value={formData.company} onChange={handleChange} variant="outlined" sx={inputSx} />
                            </div>

                            <TextField
                                fullWidth select label="Category" name="category"
                                value={formData.category} onChange={handleChange} required variant="outlined"
                                sx={{
                                    ...inputSx,
                                    '& .MuiSelect-icon': { color: 'var(--color-text-secondary)' },
                                }}
                            >
                                {categories.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </TextField>

                            <TextField fullWidth label="Subject" name="subject" value={formData.subject} onChange={handleChange} required variant="outlined" sx={inputSx} />

                            <TextField fullWidth label="Message" name="message" value={formData.message} onChange={handleChange} required multiline rows={5} variant="outlined" sx={inputSx} />

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress size={18} sx={{ color: 'white', mr: 2 }} />
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
                <div
                    className="rounded-xl p-3 h-96 overflow-hidden relative group glass-card"
                >
                    <iframe
                        title="Google Maps Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6507182963956!2d106.78610947475013!3d-6.177489093809894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6aa7706f5af%3A0x2c11a8e7bb2c1e53!2sPT%20Prima%20Integrasi%20Network!5e0!3m2!1sid!2sid!4v1767774503301!5m2!1sid!2sid"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        className="rounded-lg w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                    ></iframe>

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
