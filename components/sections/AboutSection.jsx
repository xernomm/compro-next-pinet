"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import BusinessIcon from '@mui/icons-material/Business';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CanvasGridBackground from '@/components/CanvasGridBackground';

// ─── Animated Counter ────────────────────────────────────────────────
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

    useEffect(() => {
        if (!inView) return;
        let startTime;
        let animationFrame;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
            setCount(Math.floor(end * easeOutQuart));
            if (percentage < 1) animationFrame = requestAnimationFrame(animate);
            else setCount(end);
        };
        animationFrame = requestAnimationFrame(animate);
        return () => { if (animationFrame) cancelAnimationFrame(animationFrame); };
    }, [inView, end, duration]);

    return (
        <div ref={ref} className="text-4xl md:text-5xl font-bold filter dark:drop-shadow-[0_0_20px_rgba(255,45,45,0.3)]">
            <span className="inline-block" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--color-primary)' }}>
                {prefix}{count.toLocaleString()}{suffix}
            </span>
        </div>
    );
};

// ─── Timeline Milestone Card ─────────────────────────────────────────
const categoryConfig = {
    founding: { color: '#f59e0b', label: 'Founding', icon: '🏛️' },
    partnership: { color: '#3b82f6', label: 'Partnership', icon: '🤝' },
    achievement: { color: '#10b981', label: 'Achievement', icon: '🏆' },
    expansion: { color: '#8b5cf6', label: 'Expansion', icon: '🚀' },
    product: { color: '#ef4444', label: 'Product', icon: '📦' },
};

const MilestoneCard = ({ milestone, index }) => {
    const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
    const catConf = categoryConfig[milestone.category] || categoryConfig.achievement;
    const [expanded, setExpanded] = useState(false);
    const needsTruncate = milestone.description && milestone.description.length > 180;

    return (
        <div
            ref={ref}
            className="timeline-milestone"
            style={{
                opacity: inView ? 1 : 0,
                transform: inView
                    ? 'translateX(0) translateY(0)'
                    : 'translateX(40px) translateY(10px)',
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`,
            }}
        >
            {/* Timeline node dot */}
            <div
                className="timeline-node"
                style={{
                    '--node-color': catConf.color,
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'scale(1)' : 'scale(0)',
                    transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08 + 0.2}s`,
                }}
            />

            {/* Card */}
            <div className="timeline-card group w-full">
                {/* Top accent */}
                <div
                    className="absolute top-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ background: `linear-gradient(90deg, ${catConf.color}, transparent)` }}
                />

                {/* Category badge + year */}
                <div className="flex items-center justify-between mb-3">
                    <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{
                            background: `${catConf.color}18`,
                            color: catConf.color,
                            border: `1px solid ${catConf.color}30`,
                        }}
                    >
                        <span>{milestone.icon || catConf.icon}</span>
                        {catConf.label}
                    </span>
                    <span
                        className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--color-text-secondary)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        {milestone.year}
                    </span>
                </div>

                {/* Title */}
                <h4
                    className="text-base md:text-lg font-bold mb-2 leading-snug"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--color-text)' }}
                >
                    {milestone.title}
                </h4>

                {/* Description */}
                {milestone.description && (
                    <div>
                        <p
                            className="text-sm leading-relaxed"
                            style={{ color: 'var(--color-text-secondary)' }}
                        >
                            {needsTruncate && !expanded
                                ? milestone.description.slice(0, 180) + '...'
                                : milestone.description
                            }
                        </p>
                        {needsTruncate && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="mt-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-300"
                                style={{ color: catConf.color }}
                            >
                                {expanded ? '← Show Less' : 'Read More →'}
                            </button>
                        )}
                    </div>
                )}

                {/* Image */}
                {milestone.image_url && (
                    <div className="mt-3 rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                        <img
                            src={milestone.image_url.startsWith('/') ? milestone.image_url : `/uploads/images/${milestone.image_url}`}
                            alt={milestone.title}
                            className="w-full h-32 md:h-40 object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Year Marker on Timeline ─────────────────────────────────────────
const YearMarker = ({ year, index }) => {
    const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
    return (
        <div
            ref={ref}
            className="timeline-year-marker"
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'scale(1)' : 'scale(0.5)',
                transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.05}s`,
            }}
        >
            <span className="timeline-year-badge">{year}</span>
        </div>
    );
};

// ─── Main AboutSection ───────────────────────────────────────────────
const AboutSection = ({ companyInfo, milestones = [] }) => {
    const [activeTab, setActiveTab] = useState(0);
    const sectionRef = useRef(null);
    const timelineRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeCategory, setActiveCategory] = useState('all');

    // Intersection observer for the About section
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Scroll progress for timeline spine
    const handleTimelineScroll = useCallback(() => {
        if (!timelineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const windowH = window.innerHeight;
        const totalH = rect.height;
        const scrolled = windowH - rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / (totalH + windowH * 0.3)));
        setScrollProgress(progress);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleTimelineScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleTimelineScroll);
    }, [handleTimelineScroll]);

    if (!companyInfo) return null;

    // Tabs — without History (history gets its own timeline section)
    const tabData = [
        { id: 'about', label: 'About Us', icon: <BusinessIcon />, content: companyInfo.about, accentColor: '#ff2d2d' },
        { id: 'vision', label: 'Vision', icon: <VisibilityIcon />, content: companyInfo.vision, accentColor: '#d1d5db' },
        { id: 'mission', label: 'Mission', icon: <TrackChangesIcon />, content: companyInfo.mission, accentColor: '#10b981' },
    ].filter(tab => tab.content);

    const currentYear = new Date().getFullYear();
    const yearsInBusiness = companyInfo.established_year ? currentYear - companyInfo.established_year : 0;

    const stats = [
        { id: 'years', value: yearsInBusiness, suffix: '+', label: 'Years of Excellence', icon: (<svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M16 2L20 10L28 11L22 17L24 26L16 22L8 26L10 17L4 11L12 10L16 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>) },
        { id: 'clients', value: 500, suffix: '+', label: 'Happy Clients', icon: (<svg width="28" height="28" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" /><path d="M6 28C6 22 10 18 16 18C22 18 26 22 26 28" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>) },
        { id: 'projects', value: 300, suffix: '+', label: 'Projects Completed', icon: (<svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M10 16L14 20L22 12" stroke="currentColor" strokeWidth="2" fill="none" /></svg>) },
        { id: 'team', value: 50, suffix: '+', label: 'Team Members', icon: (<svg width="28" height="28" viewBox="0 0 32 32" fill="none"><circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" /><circle cx="22" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" /><path d="M4 26C4 21 7 18 12 18" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M20 18C25 18 28 21 28 26" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>) },
    ];

    // Filter & group milestones
    const filteredMilestones = activeCategory === 'all'
        ? milestones
        : milestones.filter(m => m.category === activeCategory);

    // Get unique categories from milestones
    const availableCategories = [...new Set(milestones.map(m => m.category))];

    // Group milestones by year for year markers
    const milestonesByYear = {};
    filteredMilestones.forEach(m => {
        if (!milestonesByYear[m.year]) milestonesByYear[m.year] = [];
        milestonesByYear[m.year].push(m);
    });
    const sortedYears = Object.keys(milestonesByYear).sort((a, b) => a - b);

    // Flatten for rendering: interleave year markers with milestone cards
    const timelineItems = [];
    let globalIdx = 0;
    sortedYears.forEach((year) => {
        timelineItems.push({ type: 'year', year: parseInt(year), index: globalIdx++ });
        milestonesByYear[year].forEach((m) => {
            timelineItems.push({ type: 'milestone', data: m, index: globalIdx++ });
        });
    });

    return (
        <>
            {/* ═══════════════════════════════════════════════════════════
                SECTION A: "At a Glance" — Company Info Bento
               ═══════════════════════════════════════════════════════════ */}
            <section
                id="about"
                ref={sectionRef}
                className="py-10 md:py-14 relative overflow-hidden"
                style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}
            >
                {/* Video Background */}
                <CanvasGridBackground src="/ambient.jpg" type="image" solidColor="transparent" dotColor="#ff2d2d" boxSize={180} blur={3} darken={0.4} />

                {/* Grid Pattern */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(255, 45, 45, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 45, 45, 0.03) 1px, transparent 1px)`, backgroundSize: '60px 60px', zIndex: 2 }} />

                {/* Ambient Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
                    <div className="absolute w-96 h-96 rounded-full animate-float" style={{ top: '-10%', left: '10%', background: 'radial-gradient(circle, rgba(255, 45, 45, 0.05) 0%, transparent 70%)' }} />
                    <div className="absolute w-96 h-96 rounded-full animate-float" style={{ bottom: '-10%', right: '10%', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)', animationDelay: '1.5s' }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <p className="mono-label mb-3">{'// Who We Are'}</p>
                        <h2 className="section-title m-0 mb-2">About {companyInfo.company_name}</h2>
                        {companyInfo.tagline && <p className="section-subtitle mb-0">{companyInfo.tagline}</p>}
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Bento Block 1: Tabbed Company Info */}
                        {tabData.length > 0 && (
                            <div
                                className="lg:col-span-2 lg:row-span-2 ux-parent ux-parent--large"
                                style={{ animation: isVisible ? 'fadeInUp 0.6s ease-out both' : 'none' }}
                            >
                                <div className="ux-card flex flex-col justify-between">
                                    <div className="ux-logo" aria-hidden="true">
                                        <span className="ux-circle"></span>
                                        <span className="ux-circle"></span>
                                        <span className="ux-circle"></span>
                                        <span className="ux-circle"></span>
                                        <span className="ux-circle">
                                            {tabData[activeTab]?.icon || <BusinessIcon />}
                                        </span>
                                    </div>
                                    <div className="ux-glass"></div>
                                    <div className="ux-content flex flex-col h-full relative z-10 p-6 md:p-8">
                                        <div className="flex flex-wrap mb-4" style={{ borderBottom: '1px solid var(--color-border)', zIndex: 4 }}>
                                            {tabData.map((tab, index) => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(index)}
                                                    className="flex-1 min-w-[90px] px-3 py-4 flex items-center justify-center gap-1.5 transition-all duration-300 relative hover:bg-black/5 dark:hover:bg-white/5"
                                                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', fontWeight: activeTab === index ? 600 : 400, letterSpacing: '0.05em', textTransform: 'uppercase', color: activeTab === index ? 'var(--ux-cta)' : 'var(--ux-body)' }}
                                                >
                                                    <span style={{ transition: 'transform 0.3s', transform: activeTab === index ? 'scale(1.1)' : 'scale(1)' }}>{tab.icon}</span>
                                                    <span className="hidden sm:inline">{tab.label}</span>
                                                    {activeTab === index && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: 'var(--ux-cta)', boxShadow: '0 0 10px rgba(255, 45, 45, 0.4)' }} />}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center relative">
                                            {tabData.map((tab, index) => (
                                                <div key={tab.id} className={`transition-all duration-500 flex-1 flex flex-col justify-center ${activeTab === index ? 'opacity-100 translate-x-0' : 'opacity-0 absolute inset-0 -translate-x-8 pointer-events-none'}`}>
                                                    {activeTab === index && (
                                                        <div className="pr-[90px] sm:pr-[120px] md:pr-[150px]">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-500/10" style={{ background: 'var(--ux-cta)' }}>{tab.icon}</div>
                                                                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--ux-title)' }}>{tab.label}</h3>
                                                            </div>
                                                            <div className="prose prose-base md:prose-lg dark:prose-invert max-w-none leading-relaxed text-base md:text-lg font-medium" style={{ color: 'var(--ux-tab-text)' }} dangerouslySetInnerHTML={{ __html: tab.content }} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats Cards */}
                        {stats.map((stat, index) => {
                            let themeClass = "";
                            if (index === 0) themeClass = "ux-parent--cut";
                            else if (index === 1) themeClass = "ux-parent--solar";
                            else if (index === 2) themeClass = "ux-parent--prism";
                            else if (index === 3) themeClass = "ux-parent--void";

                            return (
                                <div
                                    key={stat.id}
                                    className={`ux-parent ${themeClass}`}
                                    style={{ animation: isVisible ? `fadeInUp 0.6s ease-out ${(index + 1) * 0.1}s both` : 'none' }}
                                >
                                    <div className="ux-card flex flex-col justify-between">
                                        <div className="ux-logo" aria-hidden="true">
                                            <span className="ux-circle"></span>
                                            <span className="ux-circle"></span>
                                            <span className="ux-circle"></span>
                                            <span className="ux-circle"></span>
                                            <span className="ux-circle">
                                                {stat.icon}
                                            </span>
                                        </div>
                                        <div className="ux-glass"></div>
                                        <div className="ux-content flex flex-col justify-between h-full p-6">
                                            <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300"
                                                style={{ color: 'var(--ux-cta)', background: 'rgba(255, 45, 45, 0.08)', border: '1px solid rgba(255, 45, 45, 0.15)', zIndex: 4 }}>
                                                {stat.icon}
                                            </div>
                                            <div className="mt-8" style={{ zIndex: 4 }}>
                                                <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2000 + (index * 200)} />
                                                <div className="mt-1 text-xs font-semibold" style={{ color: 'var(--ux-body)', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.05em', textTransform: 'uppercase' }}>{stat.label}</div>
                                            </div>
                                            <div className="mt-4 w-6 h-[1px] transition-all duration-500" style={{ background: 'linear-gradient(90deg, var(--ux-cta), transparent)', zIndex: 4 }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Location Card */}
                        {companyInfo.address && (
                            <div
                                className="lg:col-span-2 ux-parent ux-parent--wide ux-parent--ocean"
                                style={{ animation: isVisible ? 'fadeInUp 0.6s ease-out 0.4s both' : 'none' }}
                            >
                                <div className="ux-card flex items-center">
                                    <div className="ux-logo" aria-hidden="true">
                                        <span className="ux-circle"></span>
                                        <span className="ux-circle"></span>
                                        <span className="ux-circle"></span>
                                        <span className="ux-circle"></span>
                                        <span className="ux-circle">
                                            <LocationOnIcon sx={{ fontSize: 24 }} />
                                        </span>
                                    </div>
                                    <div className="ux-glass"></div>
                                    <div className="ux-content w-full flex items-start gap-4 p-6 md:p-8">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg" style={{ background: 'linear-gradient(135deg, var(--ux-cta), #ed1515)' }}>
                                            <LocationOnIcon sx={{ fontSize: 24 }} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--ux-title)' }}>Our Location</h3>
                                            <div style={{ color: 'var(--ux-body)', fontSize: '0.85rem' }} className="space-y-0.5 pr-[90px]">
                                                <p className="font-medium">{companyInfo.address}</p>
                                                {(companyInfo.city || companyInfo.province || companyInfo.postal_code) && (
                                                    <p>{[companyInfo.city, companyInfo.province, companyInfo.postal_code].filter(Boolean).join(', ')}</p>
                                                )}
                                                {companyInfo.country && <p>{companyInfo.country}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact Card */}
                        <div
                            className="lg:col-span-2 ux-parent ux-parent--wide ux-parent--void"
                            style={{ animation: isVisible ? 'fadeInUp 0.6s ease-out 0.5s both' : 'none' }}
                        >
                            <div className="ux-card flex flex-col justify-center">
                                <div className="ux-logo" aria-hidden="true">
                                    <span className="ux-circle"></span>
                                    <span className="ux-circle"></span>
                                    <span className="ux-circle"></span>
                                    <span className="ux-circle"></span>
                                    <span className="ux-circle">
                                        <EmailIcon sx={{ fontSize: 24 }} />
                                    </span>
                                </div>
                                <div className="ux-glass"></div>
                                <div className="ux-content w-full flex flex-col sm:flex-row gap-4 sm:gap-8 justify-around p-6 md:p-8">
                                    {companyInfo.email && (
                                        <a href={`mailto:${companyInfo.email}`} className="flex items-center gap-3 group/link z-10">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md group-hover/link:scale-105 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, var(--ux-cta), #c80d0d)' }}>
                                                <EmailIcon sx={{ fontSize: 20 }} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ux-body)' }}>Email Us</p>
                                                <p className="text-sm font-medium transition-colors" style={{ color: 'var(--ux-title)' }}>{companyInfo.email}</p>
                                            </div>
                                        </a>
                                    )}
                                    {companyInfo.phone && (
                                        <a href={`tel:${companyInfo.phone}`} className="flex items-center gap-3 group/link z-10">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md group-hover/link:scale-105 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                                <PhoneIcon sx={{ fontSize: 20 }} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ux-body)' }}>Call Us</p>
                                                <p className="text-sm font-medium transition-colors" style={{ color: 'var(--ux-title)' }}>{companyInfo.phone}</p>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(24px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    /* ─── 3D Card Container Perspective ─── */
                    .ux-parent {
                        width: 100%;
                        height: 100%;
                        perspective: 1000px;
                        perspective-origin: 50% 50%;
                    }

                    .ux-parent--large {
                        min-height: 380px;
                    }

                    .ux-parent--wide {
                        width: 100%;
                    }

                    /* ─── The Card Body (Rotates in 3D) ─── */
                    .ux-card {
                        position: relative;
                        height: 100%;
                        width: 100%;
                        border-radius: 32px;
                        background: var(--ux-grad);
                        transform-style: preserve-3d;
                        transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.55s ease, border-color 0.55s ease;
                        border: 1px solid var(--color-border);
                        box-shadow: 0 10px 30px var(--shadow-color);
                    }

                    .ux-parent:hover .ux-card {
                        transform: rotate3d(1, -1, 0, 12deg);
                        border-color: rgba(255, 45, 45, 0.4);
                        box-shadow: 0 20px 48px var(--shadow-color), 0 0 40px rgba(255, 45, 45, 0.1);
                    }

                    /* ─── Theme Colors mapping ─── */
                    :global(.dark) .ux-parent {
                        --ux-grad: linear-gradient(135deg, #121214 0%, #16161a 100%);
                        --ux-title: #ffffff;
                        --ux-body: rgba(255, 255, 255, 0.7);
                        --ux-tab-text: rgba(255, 255, 255, 0.95);
                        --ux-cta: #ff2d2d;
                        --ux-orbit: rgba(255, 45, 45, 0.06);
                        --ux-fill: #ff2d2d;
                        --glass-edge: rgba(255, 45, 45, 0.25);
                        --shadow-color: rgba(0, 0, 0, 0.6);
                    }

                    :global(.light) .ux-parent,
                    :global(:root:not(.dark)) .ux-parent {
                        --ux-grad: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
                        --ux-title: #0f172a;
                        --ux-body: #4b5563;
                        --ux-tab-text: #1e293b;
                        --ux-cta: #ed1515;
                        --ux-orbit: rgba(237, 21, 21, 0.05);
                        --ux-fill: #ed1515;
                        --glass-edge: rgba(237, 21, 21, 0.2);
                        --shadow-color: rgba(0, 0, 0, 0.08);
                    }

                    /* ─── Specific layout colors variation ─── */
                    :global(.dark) .ux-parent--cut {
                        --ux-grad: linear-gradient(135deg, #16161a 0%, #200d0d 100%);
                    }
                    :global(.dark) .ux-parent--solar {
                        --ux-grad: linear-gradient(135deg, #1c1c22 0%, #121214 100%);
                    }
                    :global(.dark) .ux-parent--prism {
                        --ux-grad: linear-gradient(135deg, #121214 0%, #1a1a24 100%);
                    }
                    :global(.dark) .ux-parent--void {
                        --ux-grad: linear-gradient(135deg, #0d0d10 0%, #16161a 100%);
                    }

                    /* ─── Structural variants ─── */
                    .ux-parent--cut .ux-card {
                        border-radius: 28px;
                        clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px);
                    }
                    .ux-parent--cut .ux-glass {
                        border-radius: 24px !important;
                        clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px);
                    }

                    /* ─── Glass Sheet (Middle Layer) ─── */
                    .ux-glass {
                        transform-style: preserve-3d;
                        position: absolute;
                        inset: 8px;
                        border-radius: 28px;
                        border-top-right-radius: 80px;
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
                        transform: translate3d(0, 0, 25px);
                        border-inline-start: 1px solid var(--glass-edge);
                        border-bottom: 1px solid var(--glass-edge);
                        transition: all 0.5s ease-in-out;
                        pointer-events: none;
                    }

                    :global(.light) .ux-glass,
                    :global(:root:not(.dark)) .ux-glass {
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.4) 100%);
                    }

                    /* ─── Logo orbits (Top Right) ─── */
                    .ux-logo {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 180px;
                        height: 180px;
                        transform-style: preserve-3d;
                        pointer-events: none;
                        z-index: 2;
                    }

                    .ux-circle {
                        display: block;
                        position: absolute;
                        aspect-ratio: 1;
                        border-radius: 50%;
                        background: var(--ux-orbit);
                        box-shadow: rgba(0, 0, 0, 0.03) -8px 8px 20px 0;
                        backdrop-filter: blur(4px);
                        -webkit-backdrop-filter: blur(4px);
                        transition: all 0.55s cubic-bezier(0.22, 1, 0.36, 1);
                    }

                    .ux-circle:nth-child(1) { width: 150px; transform: translate3d(0, 0, 20px); top: 8px; right: 8px; }
                    .ux-circle:nth-child(2) { width: 120px; transform: translate3d(0, 0, 40px); top: 12px; right: 12px; transition-delay: 0.04s; }
                    .ux-circle:nth-child(3) { width: 95px; transform: translate3d(0, 0, 60px); top: 16px; right: 16px; transition-delay: 0.08s; }
                    .ux-circle:nth-child(4) { width: 70px; transform: translate3d(0, 0, 80px); top: 20px; right: 20px; transition-delay: 0.12s; }
                    .ux-circle:nth-child(5) { 
                        width: 48px; 
                        transform: translate3d(0, 0, 100px); 
                        top: 24px; 
                        right: 24px; 
                        display: grid; 
                        place-content: center; 
                        transition-delay: 0.16s;
                        background: var(--ux-fill);
                        color: #ffffff;
                        box-shadow: 0 4px 12px rgba(255, 45, 45, 0.3);
                    }

                    .ux-circle:nth-child(5) :global(svg) {
                        width: 20px;
                        height: 20px;
                        fill: currentColor;
                        color: currentColor;
                    }

                    .ux-parent:hover .ux-circle:nth-child(2) { transform: translate3d(0, 0, 50px); }
                    .ux-parent:hover .ux-circle:nth-child(3) { transform: translate3d(0, 0, 75px); }
                    .ux-parent:hover .ux-circle:nth-child(4) { transform: translate3d(0, 0, 100px); }
                    .ux-parent:hover .ux-circle:nth-child(5) { transform: translate3d(0, 0, 125px); }

                    /* ─── Content ─── */
                    .ux-content {
                        transform: translate3d(0, 0, 26px);
                        position: relative;
                        z-index: 3;
                    }

                    /* Ensure prose typography inside bento cards has high visibility */
                    :global(.prose) {
                        color: var(--ux-tab-text) !important;
                    }
                    :global(.prose p), :global(.prose li) {
                        color: var(--ux-tab-text) !important;
                    }
                    :global(.prose strong) {
                        color: var(--ux-title) !important;
                    }
                    :global(.prose h1), :global(.prose h2), :global(.prose h3), :global(.prose h4) {
                        color: var(--ux-title) !important;
                    }

                    @media (prefers-reduced-motion: reduce) {
                        .ux-card, .ux-circle, .ux-glass {
                            transition: none !important;
                        }
                        .ux-parent:hover .ux-card {
                            transform: none !important;
                        }
                        .ux-parent:hover .ux-circle {
                            transform: translate3d(0, 0, 20px) !important;
                        }
                    }
                `}</style>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION B: "Our Journey" — Interactive Timeline
               ═══════════════════════════════════════════════════════════ */}
            {milestones.length > 0 && (
                <section
                    id="history"
                    className="relative overflow-hidden"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                    {/* Distinct dark background */}
                    <div className="absolute inset-0" style={{ zIndex: 0 }}>
                        {/* Dark mode BG */}
                        <div className="absolute inset-0 hidden dark:block" style={{ background: 'linear-gradient(180deg, #08080a 0%, #0d0d12 30%, #0a0a0e 70%, #08080a 100%)' }} />
                        {/* Light mode BG */}
                        <div className="absolute inset-0 block dark:hidden" style={{ background: 'linear-gradient(180deg, #f8f9fb 0%, #f0f1f5 30%, #ebedf2 70%, #f8f9fb 100%)' }} />
                    </div>

                    {/* Subtle dot pattern */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        backgroundImage: 'radial-gradient(rgba(255, 45, 45, 0.04) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                        zIndex: 1,
                    }} />

                    {/* Top & bottom gradient fade for seamless transition */}
                    <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{
                        background: 'linear-gradient(180deg, var(--color-bg) 0%, transparent 100%)',
                        zIndex: 2,
                    }} />
                    <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{
                        background: 'linear-gradient(0deg, var(--color-bg) 0%, transparent 100%)',
                        zIndex: 2,
                    }} />

                    {/* Ambient glow orbs */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
                        <div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: '20%', left: '-10%', background: 'radial-gradient(circle, rgba(255, 45, 45, 0.04) 0%, transparent 70%)' }} />
                        <div className="absolute w-[400px] h-[400px] rounded-full" style={{ top: '60%', right: '-5%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)' }} />
                    </div>

                    <div className="relative z-10 pt-14 pb-14">
                        {/* Section Header */}
                        <div className="text-center mb-16 px-4">
                            <p className="mono-label mb-3">{'// Our Journey'}</p>
                            <h2 className="section-title m-0 mb-3">History & Milestones</h2>
                            <p className="section-subtitle mb-0 max-w-2xl mx-auto">
                                From our founding to becoming a trusted Oracle partner — every milestone that shaped who we are today.
                            </p>
                        </div>

                        {/* Category Filter Pills */}
                        {availableCategories.length > 1 && (
                            <div className="flex flex-wrap justify-center gap-2 mb-16 px-4">
                                <button
                                    onClick={() => setActiveCategory('all')}
                                    className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        background: activeCategory === 'all' ? '#ff2d2d' : 'rgba(255,255,255,0.05)',
                                        color: activeCategory === 'all' ? '#fff' : 'var(--color-text-secondary)',
                                        border: `1px solid ${activeCategory === 'all' ? '#ff2d2d' : 'var(--color-border)'}`,
                                        boxShadow: activeCategory === 'all' ? '0 0 20px rgba(255,45,45,0.3)' : 'none',
                                    }}
                                >
                                    All
                                </button>
                                {availableCategories.map(cat => {
                                    const cc = categoryConfig[cat] || categoryConfig.achievement;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
                                            style={{
                                                fontFamily: "'Space Grotesk', sans-serif",
                                                background: activeCategory === cat ? cc.color : 'rgba(255,255,255,0.05)',
                                                color: activeCategory === cat ? '#fff' : 'var(--color-text-secondary)',
                                                border: `1px solid ${activeCategory === cat ? cc.color : 'var(--color-border)'}`,
                                                boxShadow: activeCategory === cat ? `0 0 20px ${cc.color}40` : 'none',
                                            }}
                                        >
                                            {cc.icon} {cc.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Timeline */}
                        <div ref={timelineRef} className="timeline-container max-w-5xl mx-auto px-4 relative">
                            {/* Central spine */}
                            <div className="timeline-spine">
                                <div
                                    className="timeline-spine-progress"
                                    style={{ height: `${scrollProgress * 100}%` }}
                                />
                            </div>

                            {/* Timeline items */}
                            <div className="timeline-items">
                                {timelineItems.map((item, i) => {
                                    if (item.type === 'year') {
                                        return <YearMarker key={`year-${item.year}-${i}`} year={item.year} index={item.index} />;
                                    }
                                    return (
                                        <MilestoneCard
                                            key={item.data.id || `ms-${i}`}
                                            milestone={item.data}
                                            index={item.index}
                                        />
                                    );
                                })}
                            </div>

                            {/* End marker */}
                            <div className="timeline-end-marker">
                                <div className="timeline-end-dot" />
                                <p className="text-xs font-bold uppercase tracking-widest mt-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--color-text-secondary)' }}>
                                    And the journey continues...
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline CSS */}
                    <style jsx>{`
                        /* ─── Timeline Container ─── */
                        .timeline-container {
                            position: relative;
                        }

                        /* ─── Spine on the Side ─── */
                        .timeline-spine {
                            position: absolute;
                            left: 0;
                            top: 0;
                            bottom: 0;
                            width: 2px;
                            background: var(--color-border);
                            z-index: 1;
                        }
                        .timeline-spine-progress {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            background: linear-gradient(180deg, #ff2d2d, #ff2d2d80);
                            box-shadow: 0 0 12px rgba(255, 45, 45, 0.4), 0 0 30px rgba(255, 45, 45, 0.15);
                            transition: height 0.1s linear;
                            border-radius: 0 0 2px 2px;
                        }

                        /* ─── Year Marker ─── */
                        .timeline-year-marker {
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            position: relative;
                            z-index: 5;
                            padding: 24px 0 12px 28px;
                        }
                        .timeline-year-badge {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            padding: 6px 20px;
                            border-radius: 999px;
                            font-family: 'Space Grotesk', sans-serif;
                            font-size: 0.85rem;
                            font-weight: 800;
                            letter-spacing: 0.08em;
                            color: #ff2d2d;
                            background: rgba(255, 45, 45, 0.08);
                            border: 1px solid rgba(255, 45, 45, 0.25);
                            box-shadow: 0 0 20px rgba(255, 45, 45, 0.1);
                        }

                        /* ─── Milestone Layout ─── */
                        .timeline-milestone {
                            display: flex;
                            align-items: flex-start;
                            gap: 0;
                            position: relative;
                            padding: 16px 0;
                            z-index: 3;
                        }

                        /* ─── Node Dot ─── */
                        .timeline-node {
                            position: absolute;
                            left: -7px;
                            top: 28px;
                            width: 16px;
                            height: 16px;
                            border-radius: 50%;
                            background: var(--node-color, #ff2d2d);
                            border: 3px solid var(--color-bg, #08080a);
                            box-shadow: 0 0 0 2px var(--node-color, #ff2d2d), 0 0 16px var(--node-color, #ff2d2d);
                            z-index: 4;
                        }

                        /* ─── Card ─── */
                        .timeline-card {
                            position: relative;
                            overflow: hidden;
                            border-radius: 16px;
                            padding: 20px;
                            margin-left: 28px;
                            margin-right: 0;
                            background: rgba(255, 255, 255, 0.03);
                            backdrop-filter: blur(12px);
                            -webkit-backdrop-filter: blur(12px);
                            border: 1px solid var(--color-border);
                            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        }
                        .timeline-card:hover {
                            transform: translateY(-2px);
                            border-color: rgba(255, 45, 45, 0.2);
                            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 0 20px rgba(255, 45, 45, 0.05);
                        }

                        /* Light mode card adjustments */
                        :global(.light) .timeline-card,
                        :global(:root:not(.dark)) .timeline-card {
                            background: rgba(255, 255, 255, 0.7);
                            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
                        }
                        :global(.light) .timeline-card:hover,
                        :global(:root:not(.dark)) .timeline-card:hover {
                            background: rgba(255, 255, 255, 0.85);
                            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 0 20px rgba(255, 45, 45, 0.08);
                        }
                        :global(.light) .timeline-node,
                        :global(:root:not(.dark)) .timeline-node {
                            border-color: #f0f1f5;
                        }

                        /* ─── End Marker ─── */
                        .timeline-end-marker {
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            padding-left: 0;
                            padding-top: 40px;
                            position: relative;
                            z-index: 5;
                        }
                        .timeline-end-dot {
                            position: absolute;
                            left: -5px;
                            width: 12px;
                            height: 12px;
                            border-radius: 50%;
                            background: #ff2d2d;
                            box-shadow: 0 0 20px rgba(255, 45, 45, 0.4);
                            animation: pulse-dot 2s ease-in-out infinite;
                        }

                        @keyframes pulse-dot {
                            0%, 100% { box-shadow: 0 0 12px rgba(255, 45, 45, 0.3); transform: scale(1); }
                            50% { box-shadow: 0 0 24px rgba(255, 45, 45, 0.6); transform: scale(1.2); }
                        }

                        /* ─── Responsive: Mobile ─── */
                        @media (max-width: 640px) {
                            .timeline-spine {
                                display: none;
                            }
                            .timeline-node {
                                display: none;
                            }
                            .timeline-milestone {
                                display: block;
                                padding: 8px 0;
                            }
                            .timeline-card {
                                margin: 0;
                                border-top: 3px solid var(--node-color, #ff2d2d);
                            }
                            .timeline-year-marker {
                                padding-left: 0;
                                justify-content: center;
                            }
                            .timeline-end-marker {
                                align-items: center;
                                padding-left: 0;
                            }
                        }
                    `}</style>
                </section>
            )}
        </>
    );
};

export default AboutSection;
