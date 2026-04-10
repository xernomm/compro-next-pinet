import React, { useState, useRef } from 'react';
import { Tooltip, Chip } from '@mui/material';
import { getImageUrl } from '../../utils/imageUtils';
import { GridPlaceholder } from '../PlaceholderCard';
import HandshakeIcon from '@mui/icons-material/Handshake';

const PartnersSection = ({ partners }) => {
    const [isPaused, setIsPaused] = useState(false);
    const marqueeRef = useRef(null);

    const activePartners = partners.filter(partner => partner.is_active);

    if (activePartners.length === 0) {
        return (
            <section id="partners" className="section-container bg-gray-50 dark:bg-dark-900">
                <h2 className="section-title">Our Partners</h2>
                <p className="section-subtitle">
                    Collaborating with industry leaders to deliver excellence
                </p>
                <GridPlaceholder count={4} type="partner" />
            </section>
        );
    }

    const partnershipTypeConfig = {
        technology: {
            gradient: 'from-blue-500 to-indigo-600',
            bgLight: 'rgba(59, 130, 246, 0.1)',
            text: '#3b82f6'
        },
        strategic: {
            gradient: 'from-emerald-500 to-teal-600',
            bgLight: 'rgba(16, 185, 129, 0.1)',
            text: '#10b981'
        },
        vendor: {
            gradient: 'from-purple-500 to-violet-600',
            bgLight: 'rgba(139, 92, 246, 0.1)',
            text: '#8b5cf6'
        },
        solution: {
            gradient: 'from-amber-500 to-orange-600',
            bgLight: 'rgba(245, 158, 11, 0.1)',
            text: '#f59e0b'
        },
        integration: {
            gradient: 'from-cyan-500 to-sky-600',
            bgLight: 'rgba(6, 182, 212, 0.1)',
            text: '#06b6d4'
        },
        reseller: {
            gradient: 'from-rose-500 to-pink-600',
            bgLight: 'rgba(244, 63, 94, 0.1)',
            text: '#f43f5e'
        },
        distributor: {
            gradient: 'from-lime-500 to-green-600',
            bgLight: 'rgba(132, 204, 22, 0.1)',
            text: '#84cc16'
        },
        consulting: {
            gradient: 'from-fuchsia-500 to-purple-600',
            bgLight: 'rgba(217, 70, 239, 0.1)',
            text: '#d946ef'
        },
        training: {
            gradient: 'from-yellow-500 to-amber-600',
            bgLight: 'rgba(234, 179, 8, 0.1)',
            text: '#eab308'
        },
        certification: {
            gradient: 'from-red-500 to-rose-600',
            bgLight: 'rgba(239, 68, 68, 0.1)',
            text: '#ef4444'
        },
        development: {
            gradient: 'from-indigo-500 to-blue-600',
            bgLight: 'rgba(99, 102, 241, 0.1)',
            text: '#6366f1'
        },
        cloud: {
            gradient: 'from-sky-500 to-blue-600',
            bgLight: 'rgba(14, 165, 233, 0.1)',
            text: '#0ea5e9'
        },
        security: {
            gradient: 'from-slate-600 to-gray-700',
            bgLight: 'rgba(71, 85, 105, 0.1)',
            text: '#475569'
        },
        infrastructure: {
            gradient: 'from-stone-500 to-neutral-600',
            bgLight: 'rgba(120, 113, 108, 0.1)',
            text: '#78716c'
        },
        support: {
            gradient: 'from-teal-500 to-emerald-600',
            bgLight: 'rgba(20, 184, 166, 0.1)',
            text: '#14b8a6'
        },
    };

    // Helper function to generate consistent color from string hash for unknown categories
    const generateColorFromString = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        return {
            gradient: `from-[hsl(${hue},70%,50%)] to-[hsl(${(hue + 30) % 360},70%,40%)]`,
            bgLight: `hsla(${hue}, 70%, 50%, 0.1)`,
            text: `hsl(${hue}, 70%, 45%)`
        };
    };

    // Get config for a type, with fallback to dynamic color generation
    const getTypeConfig = (type) => {
        if (!type) return partnershipTypeConfig.technology;
        const lowerType = type.toLowerCase();
        if (partnershipTypeConfig[lowerType]) {
            return partnershipTypeConfig[lowerType];
        }
        // Generate dynamic color for unknown categories
        return generateColorFromString(lowerType);
    };

    // Group partners by type for visual organization
    const partnersByType = activePartners.reduce((acc, partner) => {
        const type = partner.partnership_type || 'Uncategorized';
        if (!acc[type]) acc[type] = [];
        acc[type].push(partner);
        return acc;
    }, {});

    return (
        <section id="partners" className="section-container bg-gray-50 dark:bg-dark-900 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white mb-6 shadow-lg">
                        <HandshakeIcon sx={{ fontSize: 32 }} />
                    </div>
                    <h2 className="section-title">Our Partners</h2>
                    <p className="section-subtitle">
                        Collaborating with industry leaders to deliver excellence
                    </p>
                </div>

                {/* Partnership Type Stats */}
                {Object.keys(partnersByType).length > 1 && (
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {Object.entries(partnersByType).map(([type, typePartners]) => {
                            const config = getTypeConfig(type);
                            return (
                                <div
                                    key={type}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 shadow-sm"
                                >
                                    <div
                                        className={`w-3 h-3 rounded-full bg-gradient-to-br ${config.gradient}`}
                                    ></div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                        {type}
                                    </span>
                                    <span
                                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                                        style={{
                                            backgroundColor: config.bgLight,
                                            color: config.text
                                        }}
                                    >
                                        {typePartners.length}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Partners Marquee - Scrolling Left */}
                <div className="relative mb-6">
                    {/* Gradient Fade Edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 dark:from-dark-900 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 dark:from-dark-900 to-transparent z-10 pointer-events-none"></div>

                    <div
                        ref={marqueeRef}
                        className="overflow-hidden"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div
                            className={`flex gap-6 ${isPaused ? '' : 'animate-marquee-left'}`}
                            style={{
                                width: 'fit-content',
                                animationPlayState: isPaused ? 'paused' : 'running',
                            }}
                        >
                            {activePartners.map((partner, index) => {
                                const config = getTypeConfig(partner.partnership_type);
                                return (
                                    <Tooltip
                                        key={`${partner.id}-${index}`}
                                        title={
                                            <div className="p-2">
                                                <div className="font-semibold mb-1">{partner.name}</div>
                                                {partner.description && (
                                                    <div className="text-sm mb-2">{partner.description}</div>
                                                )}
                                                {partner.partnership_since && (
                                                    <div className="text-xs">Partner since {partner.partnership_since}</div>
                                                )}
                                            </div>
                                        }
                                        arrow
                                    >
                                        <div
                                            className="flex-shrink-0 group cursor-pointer"
                                            onClick={() => partner.website_url && window.open(partner.website_url, '_blank')}
                                        >
                                            <div className="relative bg-white dark:bg-dark-800 rounded-2xl p-6 w-44 h-36 flex flex-col items-center justify-center border border-gray-200 dark:border-dark-700 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 overflow-hidden">
                                                {/* Top gradient bar based on partnership type */}
                                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>

                                                {partner.logo_url ? (
                                                    <img
                                                        src={getImageUrl(partner.logo_url)}
                                                        alt={partner.name}
                                                        className="max-w-full max-h-14 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                                    />
                                                ) : (
                                                    <div className="text-center">
                                                        <div className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                            {partner.name}
                                                        </div>
                                                    </div>
                                                )}

                                                {partner.partnership_type && (
                                                    <Chip
                                                        label={partner.partnership_type}
                                                        size="small"
                                                        sx={{
                                                            mt: 2,
                                                            fontSize: '0.65rem',
                                                            height: '20px',
                                                            textTransform: 'capitalize',
                                                            backgroundColor: config.bgLight,
                                                            color: config.text,
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                )}

                                                {/* Shine effect on hover */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                            </div>
                                        </div>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Second Row - Scrolling Right (only if many partners) */}
                {activePartners.length > 4 && (
                    <div className="relative">
                        {/* Gradient Fade Edges */}
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 dark:from-dark-900 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 dark:from-dark-900 to-transparent z-10 pointer-events-none"></div>

                        <div
                            className="overflow-hidden"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            <div
                                className={`flex gap-6 ${isPaused ? '' : 'animate-marquee-right'}`}
                                style={{
                                    width: 'fit-content',
                                    animationPlayState: isPaused ? 'paused' : 'running',
                                }}
                            >
                                {[...activePartners].reverse().map((partner, index) => {
                                    const config = getTypeConfig(partner.partnership_type);
                                    return (
                                        <Tooltip
                                            key={`rev-${partner.id}-${index}`}
                                            title={
                                                <div className="p-2">
                                                    <div className="font-semibold mb-1">{partner.name}</div>
                                                    {partner.description && (
                                                        <div className="text-sm mb-2">{partner.description}</div>
                                                    )}
                                                    {partner.partnership_since && (
                                                        <div className="text-xs">Partner since {partner.partnership_since}</div>
                                                    )}
                                                </div>
                                            }
                                            arrow
                                        >
                                            <div
                                                className="flex-shrink-0 group cursor-pointer"
                                                onClick={() => partner.website_url && window.open(partner.website_url, '_blank')}
                                            >
                                                <div className="relative bg-white dark:bg-dark-800 rounded-2xl p-6 w-44 h-36 flex flex-col items-center justify-center border border-gray-200 dark:border-dark-700 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 overflow-hidden">
                                                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>

                                                    {partner.logo_url ? (
                                                        <img
                                                            src={getImageUrl(partner.logo_url)}
                                                            alt={partner.name}
                                                            className="max-w-full max-h-14 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                                        />
                                                    ) : (
                                                        <div className="text-center">
                                                            <div className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                                {partner.name}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {partner.partnership_type && (
                                                        <Chip
                                                            label={partner.partnership_type}
                                                            size="small"
                                                            sx={{
                                                                mt: 2,
                                                                fontSize: '0.65rem',
                                                                height: '20px',
                                                                textTransform: 'capitalize',
                                                                backgroundColor: config.bgLight,
                                                                color: config.text,
                                                                fontWeight: 600,
                                                            }}
                                                        />
                                                    )}

                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                                </div>
                                            </div>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CSS for marquee animations */}
            <style>{`
                @keyframes marquee-left {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                @keyframes marquee-right {
                    0% {
                        transform: translateX(-50%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
                .animate-marquee-left {
                    animation: marquee-left ${activePartners.length * 4}s linear infinite;
                }
                .animate-marquee-right {
                    animation: marquee-right ${activePartners.length * 4}s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default PartnersSection;
