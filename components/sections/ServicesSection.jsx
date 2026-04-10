import React from 'react';
import Link from 'next/link';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getImageUrl } from '../../utils/imageUtils';
import { GridPlaceholder } from '../PlaceholderCard';

const ServicesSection = ({ services }) => {
    const activeServices = services.filter(service => service.is_active);

    if (activeServices.length === 0) {
        return (
            <section id="services" className="section-container">
                <h2 className="section-title">Our Services</h2>
                <p className="section-subtitle">
                    Comprehensive solutions tailored to meet your business needs
                </p>
                <GridPlaceholder count={3} type="default" />
            </section>
        );
    }

    return (
        <section id="services" className="section-container">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
                Comprehensive solutions tailored to meet your business needs
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeServices.map((service, index) => (
                    <Link
                        key={service.id}
                        href={`/services/${service.slug}`}
                        className="card card-hover-red p-0 cursor-pointer group overflow-hidden block"
                        style={{
                            animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                        }}
                    >
                        {/* Image or Icon Area */}
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
                            {service.image_url ? (
                                <img
                                    src={getImageUrl(service.image_url)}
                                    alt={service.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : service.icon ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <i className={`${service.icon} text-6xl text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300`} />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        {service.name.charAt(0)}
                                    </div>
                                </div>
                            )}

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Hover CTA */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm px-4 py-2 rounded-full text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    Learn More <ArrowForwardIcon fontSize="small" />
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {service.name}
                            </h3>
                            {service.short_description && (
                                <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                                    {service.short_description}
                                </p>
                            )}
                            <div className="text-primary-600 dark:text-primary-400 font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                                Read More
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default ServicesSection;
