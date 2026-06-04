"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import BusinessIcon from '@mui/icons-material/Business';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

// Animated Counter component inside stats cards
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true
    });

    useEffect(() => {
        if (!inView) return;

        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
            setCount(Math.floor(end * easeOutQuart));

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [inView, end, duration]);

    return (
        <div ref={ref} className="text-4xl md:text-5xl font-bold filter dark:drop-shadow-[0_0_20px_rgba(255,45,45,0.3)]">
            <span 
                className="inline-block"
                style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: 'var(--color-primary)',
                }}
            >
                {prefix}{count.toLocaleString()}{suffix}
            </span>
        </div>
    );
};

const AboutSection = ({ companyInfo }) => {
    const [activeTab, setActiveTab] = useState(0);
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        if (videoRef.current) videoRef.current.play().catch(() => {});
                    } else {
                        if (videoRef.current) videoRef.current.pause();
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    if (!companyInfo) return null;

    const tabData = [
        {
            id: 'about',
            label: 'About Us',
            icon: <BusinessIcon />,
            content: companyInfo.about,
            accentColor: '#ff2d2d',
        },
        {
            id: 'history',
            label: 'History',
            icon: <HistoryIcon />,
            content: companyInfo.history,
            accentColor: '#f59e0b',
        },
        {
            id: 'vision',
            label: 'Vision',
            icon: <VisibilityIcon />,
            content: companyInfo.vision,
            accentColor: '#d1d5db',
        },
        {
            id: 'mission',
            label: 'Mission',
            icon: <TrackChangesIcon />,
            content: companyInfo.mission,
            accentColor: '#10b981',
        },
    ].filter(tab => tab.content);

    const currentYear = new Date().getFullYear();
    const yearsInBusiness = companyInfo.established_year
        ? currentYear - companyInfo.established_year
        : 0;

    const stats = [
        {
            id: 'years',
            value: yearsInBusiness,
            suffix: '+',
            label: 'Years of Excellence',
            icon: (
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <path d="M16 2L20 10L28 11L22 17L24 26L16 22L8 26L10 17L4 11L12 10L16 2Z"
                        stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
            ),
        },
        {
            id: 'clients',
            value: 500,
            suffix: '+',
            label: 'Happy Clients',
            icon: (
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M6 28C6 22 10 18 16 18C22 18 26 22 26 28" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
            ),
        },
        {
            id: 'projects',
            value: 300,
            suffix: '+',
            label: 'Projects Completed',
            icon: (
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <rect x="4" y="4" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <path d="M10 16L14 20L22 12" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
            ),
        },
        {
            id: 'team',
            value: 50,
            suffix: '+',
            label: 'Team Members',
            icon: (
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="22" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4 26C4 21 7 18 12 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <path d="M20 18C25 18 28 21 28 26" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
            ),
        }
    ];

    return (
        <section
            id="about"
            ref={sectionRef}
            className="py-20 md:py-28 relative overflow-hidden"
            style={{
                borderTop: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
            }}
        >
            {/* Video Background */}
            <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ zIndex: 0 }}
            >
                <source src="/videos/matrix.mp4" type="video/mp4" />
            </video>

            {/* Video overlays — separate dark / light */}
            <div className="absolute inset-0" style={{ zIndex: 1 }}>
                <div
                    className="absolute inset-0 hidden dark:block"
                    style={{
                        background: 'linear-gradient(135deg, rgba(15, 15, 18, 0.8) 0%, rgba(15, 15, 18, 0.7) 50%, rgba(15, 15, 18, 0.8) 100%)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                    }}
                />
                <div
                    className="absolute inset-0 block dark:hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(243, 244, 246, 0.35) 0%, rgba(255, 255, 255, 0.25) 50%, rgba(243, 244, 246, 0.35) 100%)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                    }}
                />
            </div>

            {/* Red Cyber Grid Pattern */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255, 45, 45, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 45, 45, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    zIndex: 2,
                }}
            />

            {/* Ambient Floating Glow Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
                <div
                    className="absolute w-96 h-96 rounded-full animate-float"
                    style={{
                        top: '-10%',
                        left: '10%',
                        background: 'radial-gradient(circle, rgba(255, 45, 45, 0.05) 0%, transparent 70%)',
                    }}
                />
                <div
                    className="absolute w-96 h-96 rounded-full animate-float"
                    style={{
                        bottom: '-10%',
                        right: '10%',
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
                        animationDelay: '1.5s',
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="mono-label mb-3">{'// Who We Are'}</p>
                    <h2 className="section-title m-0 mb-2">About {companyInfo.company_name}</h2>
                    {companyInfo.tagline && (
                        <p className="section-subtitle mb-0">{companyInfo.tagline}</p>
                    )}
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Bento Block 1: Interactive Tabbed Company Info (col-span-2, row-span-2) */}
                    {tabData.length > 0 && (
                        <div
                            className="lg:col-span-2 lg:row-span-2 flex flex-col group relative overflow-hidden rounded-2xl glass-card transition-all duration-500 hover:scale-[1.01] hover:-translate-y-0.5"
                            style={{
                                animation: isVisible ? 'fadeInUp 0.6s ease-out both' : 'none',
                            }}
                        >
                            {/* Hover top red accent line */}
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                                style={{ background: 'linear-gradient(90deg, #ff2d2d, #ffffff)', zIndex: 5 }}
                            />

                            {/* Tab Headers */}
                            <div className="flex flex-wrap" style={{ borderBottom: '1px solid var(--color-border)', zIndex: 4 }}>
                                {tabData.map((tab, index) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(index)}
                                        className="flex-1 min-w-[90px] px-3 py-4 flex items-center justify-center gap-1.5 transition-all duration-300 relative hover:bg-black/5 dark:hover:bg-white/5"
                                        style={{
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontSize: '0.75rem',
                                            fontWeight: activeTab === index ? 600 : 400,
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase',
                                            color: activeTab === index ? '#ff2d2d' : 'var(--color-text-secondary)',
                                        }}
                                    >
                                        <span style={{
                                            transition: 'transform 0.3s',
                                            transform: activeTab === index ? 'scale(1.1)' : 'scale(1)',
                                        }}>
                                            {tab.icon}
                                        </span>
                                        <span className="hidden sm:inline">{tab.label}</span>

                                        {activeTab === index && (
                                            <div
                                                className="absolute bottom-0 left-0 right-0 h-[2px]"
                                                style={{
                                                    background: '#ff2d2d',
                                                    boxShadow: '0 0 10px rgba(255, 45, 45, 0.4)',
                                                }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-6 md:p-8 flex-1 flex flex-col justify-center relative" style={{ zIndex: 4 }}>
                                {tabData.map((tab, index) => (
                                    <div
                                        key={tab.id}
                                        className={`transition-all duration-500 flex-1 flex flex-col justify-center ${
                                            activeTab === index
                                                ? 'opacity-100 translate-x-0'
                                                : 'opacity-0 absolute inset-0 -translate-x-8 pointer-events-none p-6 md:p-8'
                                        }`}
                                    >
                                        {activeTab === index && (
                                            <div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-500/10"
                                                        style={{ background: '#ff2d2d' }}
                                                    >
                                                        {tab.icon}
                                                    </div>
                                                    <h3
                                                        className="text-xl font-bold"
                                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                                    >
                                                        {tab.label}
                                                    </h3>
                                                </div>
                                                <div
                                                    className="prose prose-sm md:prose-base dark:prose-invert max-w-none leading-relaxed text-sm"
                                                    style={{ color: 'var(--color-text-secondary)' }}
                                                    dangerouslySetInnerHTML={{ __html: tab.content }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bento Blocks 2-5: The 4 Stats Cards (each col-span-1, row-span-1) */}
                    {stats.map((stat, index) => (
                        <div
                            key={stat.id}
                            className="group relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between glass-card transition-all duration-500 hover:scale-[1.01] hover:-translate-y-0.5"
                            style={{
                                animation: isVisible ? `fadeInUp 0.6s ease-out ${(index + 1) * 0.1}s both` : 'none',
                            }}
                        >
                            {/* Hover top red accent line */}
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                                style={{ background: 'linear-gradient(90deg, #ff2d2d, #ffffff)', zIndex: 5 }}
                            />

                            {/* Icon container */}
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                                style={{
                                    color: 'var(--color-primary)',
                                    background: 'rgba(255, 45, 45, 0.08)',
                                    border: '1px solid rgba(255, 45, 45, 0.15)',
                                    zIndex: 4,
                                }}
                            >
                                {stat.icon}
                            </div>

                            {/* Stats Info */}
                            <div className="mt-8" style={{ zIndex: 4 }}>
                                <AnimatedCounter
                                    end={stat.value}
                                    suffix={stat.suffix}
                                    duration={2000 + (index * 200)}
                                />
                                <div
                                    className="mt-1 text-xs font-semibold"
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {stat.label}
                                </div>
                            </div>

                            {/* Bottom glowing line indicator */}
                            <div
                                className="mt-4 w-6 h-[1px] transition-all duration-500 group-hover:w-10"
                                style={{
                                    background: 'linear-gradient(90deg, #ff2d2d, transparent)',
                                    zIndex: 4,
                                }}
                            />
                        </div>
                    ))}

                    {/* Bento Block 6: Location Card (col-span-2) */}
                    {companyInfo.address && (
                        <div
                            className="lg:col-span-2 group relative overflow-hidden rounded-2xl p-6 glass-card transition-all duration-500 hover:scale-[1.01] hover:-translate-y-0.5"
                            style={{
                                animation: isVisible ? 'fadeInUp 0.6s ease-out 0.4s both' : 'none',
                            }}
                        >
                            {/* Hover top red accent line */}
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                                style={{ background: 'linear-gradient(90deg, #ff2d2d, #ffffff)', zIndex: 5 }}
                            />

                            <div className="flex items-start gap-4" style={{ zIndex: 4, position: 'relative' }}>
                                <div
                                    className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #ff2d2d, #ed1515)' }}
                                >
                                    <LocationOnIcon sx={{ fontSize: 24 }} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        Our Location
                                    </h3>
                                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }} className="space-y-0.5">
                                        <p className="font-medium text-white/90 dark:text-white/90">{companyInfo.address}</p>
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
                            </div>
                        </div>
                    )}

                    {/* Bento Block 7: Get In Touch (col-span-2) */}
                    <div
                        className="lg:col-span-2 group relative overflow-hidden rounded-2xl p-6 flex flex-col justify-center glass-card transition-all duration-500 hover:scale-[1.01] hover:-translate-y-0.5"
                        style={{
                            animation: isVisible ? 'fadeInUp 0.6s ease-out 0.5s both' : 'none',
                        }}
                    >
                        {/* Hover top red accent line */}
                        <div
                            className="absolute top-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                            style={{ background: 'linear-gradient(90deg, #ff2d2d, #ffffff)', zIndex: 5 }}
                        />

                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-around" style={{ zIndex: 4, position: 'relative' }}>
                            {companyInfo.email && (
                                <a
                                    href={`mailto:${companyInfo.email}`}
                                    className="flex items-center gap-3 group/link"
                                >
                                    <div
                                        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md group-hover/link:scale-105 transition-transform duration-300"
                                        style={{ background: 'linear-gradient(135deg, #ed1515, #c80d0d)' }}
                                    >
                                        <EmailIcon sx={{ fontSize: 20 }} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Email Us</p>
                                        <p className="text-sm font-medium text-white/90 group-hover/link:text-[#ff2d2d] transition-colors">
                                            {companyInfo.email}
                                        </p>
                                    </div>
                                </a>
                            )}
                            {companyInfo.phone && (
                                <a
                                    href={`tel:${companyInfo.phone}`}
                                    className="flex items-center gap-3 group/link"
                                >
                                    <div
                                        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md group-hover/link:scale-105 transition-transform duration-300"
                                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                                    >
                                        <PhoneIcon sx={{ fontSize: 20 }} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Call Us</p>
                                        <p className="text-sm font-medium text-white/90 group-hover/link:text-[#10b981] transition-colors">
                                            {companyInfo.phone}
                                        </p>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Keyframe animation styling */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(24px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    );
};

export default AboutSection;
