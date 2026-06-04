"use client";

import React from 'react';
import { getImageUrl } from '@/utils/imageUtils';

const ValuesSection = ({ values }) => {
    const activeValues = values.filter(value => value.is_active);

    if (activeValues.length === 0) return null;

    return (
        <section id="values" className="py-20 md:py-28 relative overflow-hidden grid-bg"
            style={{ background: 'var(--color-bg-secondary)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <p className="mono-label text-center mb-3">{'// Our Principles'}</p>
                <h2 className="section-title mb-2">Our Values</h2>
                <p className="section-subtitle mb-12">
                    The principles that guide everything we do
                </p>

                {/* Bento-style grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {activeValues.map((value, index) => (
                        <div
                            key={value.id}
                            className="group relative overflow-hidden rounded-xl p-5 md:p-6 transition-all duration-500 hover:-translate-y-1"
                            style={{
                                animation: `scaleIn 0.5s ease-out ${index * 0.1}s both`,
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            {/* Top accent on hover */}
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                                style={{ background: 'linear-gradient(90deg, #ff2d2d, #ffffff)' }}
                            />

                            {/* Icon or Image */}
                            <div className="mb-4 flex justify-center">
                                {value.image_url ? (
                                    <div
                                        className="w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300"
                                        style={{ border: '2px solid var(--color-border)' }}
                                    >
                                        <img
                                            src={getImageUrl(value.image_url)}
                                            alt={value.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : value.icon ? (
                                    <div
                                        className="w-14 h-14 md:w-20 md:h-20 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-300"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(255, 45, 45, 0.1), rgba(255, 255, 255, 0.05))',
                                            border: '1px solid rgba(255, 45, 45, 0.15)',
                                        }}
                                    >
                                        <i className={`${value.icon} text-xl md:text-3xl`} style={{ color: 'var(--color-primary)' }} />
                                    </div>
                                ) : (
                                    <div
                                        className="w-14 h-14 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-white text-lg md:text-2xl font-bold transform group-hover:scale-105 transition-all duration-300"
                                        style={{
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            background: 'linear-gradient(135deg, #ff2d2d, #c80d0d)',
                                        }}
                                    >
                                        {value.title.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <h3
                                className="text-sm md:text-lg font-bold mb-2 text-center group-hover:text-primary-500 transition-colors line-clamp-2"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                {value.title}
                            </h3>
                            {value.description && (
                                <p
                                    className="text-center leading-relaxed text-xs md:text-sm line-clamp-3 md:line-clamp-4"
                                    style={{ color: 'var(--color-text-secondary)' }}
                                >
                                    {value.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValuesSection;
