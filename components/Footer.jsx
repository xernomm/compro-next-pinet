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
        <footer className="bg-gray-100 dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 lg:col-span-2">
                        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                            {companyInfo?.company_name || 'Company Name'}
                        </h3>
                        {companyInfo?.tagline && (
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {companyInfo.tagline}
                            </p>
                        )}

                        {/* Contact Info */}
                        <div className="space-y-3 mb-6">
                            {companyInfo?.address && (
                                <div className="flex items-start space-x-3">
                                    <LocationOnIcon className="text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                                    <div className="text-gray-700 dark:text-gray-300">
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
                                    <EmailIcon className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
                                    <a
                                        href={`mailto:${companyInfo.email}`}
                                        className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        {companyInfo.email}
                                    </a>
                                </div>
                            )}

                            {companyInfo?.phone && (
                                <div className="flex items-center space-x-3">
                                    <PhoneIcon className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
                                    <a
                                        href={`tel:${companyInfo.phone}`}
                                        className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        {companyInfo.phone}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Social Media */}
                        {socialLinks.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
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
                                                className="w-10 h-10 rounded-full bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-300 hover:scale-110"
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
                        <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.id}>
                                    <button
                                        onClick={() => scrollToSection(link.id)}
                                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Additional Info */}
                    <div>
                        <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
                            Company
                        </h4>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                            {companyInfo?.established_year && (
                                <li>
                                    Established: <span className="font-semibold text-primary-600 dark:text-primary-400">
                                        {companyInfo.established_year}
                                    </span>
                                </li>
                            )}
                            <li>
                                <button
                                    onClick={() => scrollToSection('about')}
                                    className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    Our Story
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection('values')}
                                    className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    Our Values
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-300 dark:border-dark-700">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-600 dark:text-gray-400 text-sm text-center md:text-left">
                            © {currentYear} {companyInfo?.company_name || 'Company'}. All rights reserved.
                        </p>
                        <div className="flex space-x-6 text-sm">
                            <button
                                onClick={() => scrollToSection('contact')}
                                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                Privacy Policy
                            </button>
                            <button
                                onClick={() => scrollToSection('contact')}
                                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
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
