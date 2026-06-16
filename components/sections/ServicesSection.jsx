"use client";

import React from 'react';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getImageUrl } from '@/utils/imageUtils';
import { GridPlaceholder } from '../PlaceholderCard';

const ServicesSection = ({ services }) => {
    const activeServices = services.filter(service => service.is_active);

    if (activeServices.length === 0) {
        return (
            <section id="services" className="w-full bg-white dark:bg-cyber-dark">
                <div className="section-container">
                    <p className="mono-label text-center mb-3">{'// What We Do'}</p>
                    <h2 className="section-title">Our Services</h2>
                    <p className="section-subtitle">
                        Comprehensive solutions tailored to meet your business needs
                    </p>
                    <GridPlaceholder count={3} type="default" />
                </div>
            </section>
        );
    }

    return (
        <section id="services" className="w-full bg-white dark:bg-cyber-dark">
            <div className="section-container">
                <p className="mono-label text-center mb-3">{'// What We Do'}</p>
                <h2 className="section-title">Our Services</h2>
                <p className="section-subtitle">
                    Comprehensive solutions tailored to meet your business needs
                </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeServices.map((service, index) => (
                    <Link key={service.id}
                        href={`/services/${service.slug}`}
                        className="group block relative overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-2 glass-card glass-highlight"
                        style={{
                            animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                        }}
                    >
                        {/* Top accent line */}
                        <div
                            className="absolute top-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-600 origin-left z-10"
                            style={{ background: 'linear-gradient(90deg, #ff2d2d, #ffffff)' }}
                        />

                        {/* Index number */}
                        <div
                            className="absolute top-4 right-4 z-10 opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: '3rem',
                                fontWeight: 700,
                                lineHeight: 1,
                                color: 'var(--color-primary)',
                            }}
                        >
                            {String(index + 1).padStart(2, '0')}
                        </div>

                        {/* Image or Icon Area */}
                        <div className="relative h-48 overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 45, 45, 0.05), rgba(255, 255, 255, 0.02))',
                            }}
                        >
                            {service.image_url ? (
                                <img
                                    src={getImageUrl(service.image_url)}
                                    alt={service.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : service.icon ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <i className={`${service.icon} text-6xl group-hover:scale-110 transition-transform duration-300`}
                                        style={{ color: 'var(--color-primary)' }}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div
                                        className="w-20 h-20 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300"
                                        style={{
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            background: 'linear-gradient(135deg, #ff2d2d, #c80d0d)',
                                        }}
                                    >
                                        {service.name.charAt(0)}
                                    </div>
                                </div>
                            )}

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Hover CTA */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span
                                    className="backdrop-blur-sm px-5 py-2 font-semibold flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontSize: '0.8rem',
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        background: 'rgba(22, 22, 26, 0.8)',
                                        color: 'var(--color-primary)',
                                        border: '1px solid rgba(255, 45, 45, 0.3)',
                                        borderRadius: '6px',
                                    }}
                                >
                                    Learn More <ArrowForwardIcon fontSize="small" />
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h3
                                className="text-xl font-bold mb-3 group-hover:text-primary-500 transition-colors"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                {service.name}
                            </h3>
                            {service.short_description && (
                                <p className="line-clamp-3 mb-4" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                    {service.short_description}
                                </p>
                            )}
                            <div
                                className="font-semibold flex items-center group-hover:translate-x-2 transition-transform text-sm"
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    color: 'var(--color-primary)',
                                }}
                            >
                                Read More
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            </div>
        </section>
    );
};

export default ServicesSection;
