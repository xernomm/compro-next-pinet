"use client";

import React from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = ({ companyInfo }) => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { id: 'about', label: 'About Us' },
        { id: 'services', label: 'Services' },
        { id: 'products', label: 'Products' },
        { id: 'news', label: 'News' },
        { id: 'careers', label: 'Careers' },
        { id: 'contact', label: 'Contact' },
    ];

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const socialLinks = [
        { icon: FacebookIcon, url: companyInfo?.facebook_url, label: 'Facebook' },
        { icon: TwitterIcon, url: companyInfo?.twitter_url, label: 'Twitter' },
        { icon: InstagramIcon, url: companyInfo?.instagram_url, label: 'Instagram' },
        { icon: LinkedInIcon, url: companyInfo?.linkedin_url, label: 'LinkedIn' },
        { icon: YouTubeIcon, url: companyInfo?.youtube_url, label: 'YouTube' },
    ].filter(link => link.url);

    return (
        <footer
            className="relative overflow-hidden"
            style={{
                borderTop: '1px solid var(--color-border)',
            }}
        >
            {/* Video Background */}
            <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ zIndex: 0 }}
            >
                <source src="/videos/robot.mp4" type="video/mp4" />
            </video>

            {/* Video overlay — dark/light */}
            <div className="absolute inset-0" style={{ zIndex: 1 }}>
                <div
                    className="absolute inset-0 hidden dark:block"
                    style={{
                        background: 'linear-gradient(180deg, rgba(15, 15, 18, 0.8) 0%, rgba(15, 15, 18, 0.7) 50%, rgba(15, 15, 18, 0.85) 100%)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                    }}
                />
                <div
                    className="absolute inset-0 block dark:hidden"
                    style={{
                        background: 'linear-gradient(180deg, rgba(243, 244, 246, 0.35) 0%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.3) 100%)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                    }}
                />
            </div>

            {/* Grid background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255, 45, 45, 0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 45, 45, 0.02) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    zIndex: 2,
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative text-white" style={{ zIndex: 10 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Company Info */}
                    <div className="col-span-1 lg:col-span-2">
                        <h3
                            className="text-2xl font-bold mb-4 text-white"
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                letterSpacing: '0.02em',
                            }}
                        >
                            {companyInfo?.company_name || 'Company Name'}
                        </h3>
                        {companyInfo?.tagline && (
                            <p className="mb-6 text-sm text-white/70" style={{ lineHeight: 1.7 }}>
                                {companyInfo.tagline}
                            </p>
                        )}

                        {/* Contact Info */}
                        <div className="space-y-3 mb-8">
                            {companyInfo?.address && (
                                <div className="flex items-start space-x-3">
                                    <LocationOnIcon sx={{ fontSize: 18, color: '#ff2d2d', mt: 0.3 }} />
                                    <div className="text-sm text-white/70">
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

                            {companyInfo?.email && (
                                <div className="flex items-center space-x-3">
                                    <EmailIcon sx={{ fontSize: 18, color: '#ff2d2d' }} />
                                    <a
                                        href={`mailto:${companyInfo.email}`}
                                        className="text-sm text-white/70 hover:text-primary-500 transition-all duration-300"
                                        onMouseEnter={(e) => { e.currentTarget.style.textShadow = '0 0 8px rgba(255, 45, 45, 0.6)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.textShadow = 'none'; }}
                                    >
                                        {companyInfo.email}
                                    </a>
                                </div>
                            )}

                            {companyInfo?.phone && (
                                <div className="flex items-center space-x-3">
                                    <PhoneIcon sx={{ fontSize: 18, color: '#10b981' }} />
                                    <a
                                        href={`tel:${companyInfo.phone}`}
                                        className="text-sm text-white/70 hover:text-primary-500 transition-all duration-300"
                                        onMouseEnter={(e) => { e.currentTarget.style.textShadow = '0 0 8px rgba(255, 45, 45, 0.6)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.textShadow = 'none'; }}
                                    >
                                        {companyInfo.phone}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Social Media */}
                        {socialLinks.length > 0 && (
                            <div>
                                <h4
                                    className="font-semibold mb-3 text-xs text-white/50"
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Follow Us
                                </h4>
                                <div className="flex space-x-3">
                                    {socialLinks.map((social, index) => {
                                        const Icon = social.icon;
                                        return (
                                            <a
                                                key={index}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={social.label}
                                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.08)',
                                                    color: 'white',
                                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'var(--color-primary)';
                                                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 45, 45, 0.4)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <Icon fontSize="small" />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4
                            className="font-semibold mb-5 text-xs text-white/50"
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.id}>
                                    <button
                                        onClick={() => scrollToSection(link.id)}
                                        className="text-sm transition-all duration-300 hover:translate-x-1 inline-flex items-center group text-white/70 hover:text-primary-500"
                                        onMouseEnter={(e) => { e.currentTarget.style.textShadow = '0 0 8px rgba(255, 45, 45, 0.6)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.textShadow = 'none'; }}
                                    >
                                        <span
                                            className="w-0 group-hover:w-3 h-[1px] mr-0 group-hover:mr-2 transition-all duration-300"
                                            style={{ background: 'var(--color-primary)' }}
                                        />
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Additional Info */}
                    <div>
                        <h4
                            className="font-semibold mb-5 text-xs text-white/50"
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Company
                        </h4>
                        <ul className="space-y-3 text-sm text-white/70">
                            {companyInfo?.established_year && (
                                <li>
                                    Established: <span className="font-semibold text-white">
                                        {companyInfo.established_year}
                                    </span>
                                </li>
                            )}
                            <li>
                                <button
                                    onClick={() => scrollToSection('about')}
                                    className="transition-colors hover:text-primary-500"
                                    onMouseEnter={(e) => { e.currentTarget.style.textShadow = '0 0 8px rgba(255, 45, 45, 0.6)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.textShadow = 'none'; }}
                                >
                                    Our Story
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection('values')}
                                    className="transition-colors hover:text-primary-500"
                                    onMouseEnter={(e) => { e.currentTarget.style.textShadow = '0 0 8px rgba(255, 45, 45, 0.6)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.textShadow = 'none'; }}
                                >
                                    Our Values
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-14 pt-8" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-xs text-center md:text-left text-white/50">
                            © {currentYear} {companyInfo?.company_name || 'Company'}. All rights reserved.
                        </p>
                        <div className="flex space-x-6 text-xs">
                            <button
                                onClick={() => scrollToSection('contact')}
                                className="transition-colors text-white/50 hover:text-primary-500"
                                onMouseEnter={(e) => { e.currentTarget.style.textShadow = '0 0 8px rgba(255, 45, 45, 0.6)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.textShadow = 'none'; }}
                            >
                                Privacy Policy
                            </button>
                            <button
                                onClick={() => scrollToSection('contact')}
                                className="transition-colors text-white/50 hover:text-primary-500"
                                onMouseEnter={(e) => { e.currentTarget.style.textShadow = '0 0 8px rgba(255, 45, 45, 0.6)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.textShadow = 'none'; }}
                            >
                                Terms of Service
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
