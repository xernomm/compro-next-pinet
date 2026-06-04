"use client";

import React, { useState, useEffect, useRef } from 'react';
import BusinessIcon from '@mui/icons-material/Business';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import HandshakeIcon from '@mui/icons-material/Handshake';

const AboutSection = ({ companyInfo }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({
                            ...prev,
                            [entry.target.dataset.widget]: true,
                        }));
                    }
                });
            },
            { threshold: 0.2 }
        );

        const widgets = document.querySelectorAll('[data-widget]');
        widgets.forEach((widget) => observer.observe(widget));

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
            accentColor: '#ffffff',
        },
        {
            id: 'mission',
            label: 'Mission',
            icon: <TrackChangesIcon />,
            content: companyInfo.mission,
            accentColor: '#10b981',
        },
    ].filter(tab => tab.content);

    const statsData = [
        {
            id: 'years',
            value: companyInfo.established_year ? new Date().getFullYear() - companyInfo.established_year : null,
            label: 'Years of Excellence',
            suffix: '+',
            icon: <EmojiEventsIcon sx={{ fontSize: 28 }} />,
        },
        {
            id: 'established',
            value: companyInfo.established_year,
            label: 'Established',
            prefix: 'Est. ',
            icon: <GroupsIcon sx={{ fontSize: 28 }} />,
        },
        {
            id: 'commitment',
            value: 100,
            label: 'Commitment',
            suffix: '%',
            icon: <HandshakeIcon sx={{ fontSize: 28 }} />,
        },
    ].filter(stat => stat.value !== null);

    const AnimatedCounter = ({ value, prefix = '', suffix = '' }) => {
        const [count, setCount] = useState(0);
        const countRef = useRef(null);

        useEffect(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        let start = 0;
                        const end = parseInt(value);
                        const duration = 2000;
                        const increment = end / (duration / 16);

                        const timer = setInterval(() => {
                            start += increment;
                            if (start >= end) {
                                setCount(end);
                                clearInterval(timer);
                            } else {
                                setCount(Math.floor(start));
                            }
                        }, 16);
                    }
                },
                { threshold: 0.5 }
            );

            if (countRef.current) {
                observer.observe(countRef.current);
            }

            return () => observer.disconnect();
        }, [value]);

        return (
            <span ref={countRef}>
                {prefix}{count}{suffix}
            </span>
        );
    };

    return (
        <section id="about" className="py-20 md:py-28 relative overflow-hidden grid-bg" ref={sectionRef}
            style={{ background: 'var(--color-bg-secondary)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-4">
                    <p className="mono-label mb-3">{'// Who We Are'}</p>
                    <h2 className="section-title m-0 mb-2">About {companyInfo.company_name}</h2>
                    {companyInfo.tagline && (
                        <p className="section-subtitle mb-12">{companyInfo.tagline}</p>
                    )}
                </div>

                {/* Stats Row */}
                {statsData.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-14">
                        {statsData.map((stat, index) => (
                            <div
                                key={stat.id}
                                data-widget={`stat-${stat.id}`}
                                className={`
                                    relative group overflow-hidden rounded-xl p-6 md:p-8
                                    transform transition-all duration-500
                                    hover:scale-[1.02] hover:-translate-y-1
                                    ${isVisible[`stat-${stat.id}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                                `}
                                style={{
                                    transitionDelay: `${index * 100}ms`,
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                {/* Top accent line */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                                    style={{ background: 'linear-gradient(90deg, #ff2d2d, #ffffff)' }}
                                 />
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(255, 45, 45, 0.1), rgba(255, 255, 255, 0.05))',
                                            color: 'var(--color-primary)',
                                        }}
                                    >
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <div className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                            <AnimatedCounter
                                                value={stat.value}
                                                prefix={stat.prefix || ''}
                                                suffix={stat.suffix || ''}
                                            />
                                        </div>
                                        <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                            {stat.label}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tabbed Content Section */}
                {tabData.length > 0 && (
                    <div
                        data-widget="tabs"
                        className={`
                            rounded-xl overflow-hidden mb-14 transition-all duration-700
                            ${isVisible['tabs'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                        `}
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        {/* Tab Headers */}
                        <div className="flex flex-wrap" style={{ borderBottom: '1px solid var(--color-border)' }}>
                            {tabData.map((tab, index) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(index)}
                                    className="flex-1 min-w-[120px] px-4 md:px-6 py-4 md:py-5 flex items-center justify-center gap-2 transition-all duration-300 relative"
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontSize: '0.85rem',
                                        fontWeight: activeTab === index ? 600 : 400,
                                        letterSpacing: '0.06em',
                                        textTransform: 'uppercase',
                                        color: activeTab === index ? tab.accentColor : 'var(--color-text-secondary)',
                                    }}
                                >
                                    <span style={{
                                        transition: 'transform 0.3s',
                                        transform: activeTab === index ? 'scale(1.1)' : 'scale(1)',
                                    }}>
                                        {tab.icon}
                                    </span>
                                    <span className="hidden sm:inline">{tab.label}</span>

                                    {/* Active indicator */}
                                    {activeTab === index && (
                                        <div
                                            className="absolute bottom-0 left-0 right-0 h-[2px]"
                                            style={{
                                                background: tab.accentColor,
                                                boxShadow: `0 0 10px ${tab.accentColor}40`,
                                            }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 md:p-10">
                            {tabData.map((tab, index) => (
                                <div
                                    key={tab.id}
                                    className={`transition-all duration-500 ${
                                        activeTab === index
                                            ? 'opacity-100 translate-x-0'
                                            : 'opacity-0 absolute -translate-x-8 pointer-events-none'
                                    }`}
                                >
                                    {activeTab === index && (
                                        <>
                                            <div className="flex items-center gap-4 mb-6">
                                                <div
                                                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg"
                                                    style={{ background: tab.accentColor }}
                                                >
                                                    {tab.icon}
                                                </div>
                                                <h3
                                                    className="text-2xl font-bold"
                                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                                >
                                                    {tab.label}
                                                </h3>
                                            </div>
                                            <div
                                                className="prose prose-lg dark:prose-invert max-w-none leading-relaxed"
                                                style={{ color: 'var(--color-text-secondary)' }}
                                                dangerouslySetInnerHTML={{ __html: tab.content }}
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {companyInfo.address && (
                        <div
                            data-widget="location"
                            className={`
                                relative overflow-hidden rounded-xl p-6 md:p-8
                                transform transition-all duration-700
                                ${isVisible['location'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
                            `}
                            style={{
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className="flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center text-white shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #ff2d2d, #ed1515)' }}
                                >
                                    <LocationOnIcon sx={{ fontSize: 28 }} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        Our Location
                                    </h3>
                                    <div style={{ color: 'var(--color-text-secondary)' }} className="space-y-1">
                                        <p className="font-medium">{companyInfo.address}</p>
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

                    <div
                        data-widget="contact"
                        className={`
                            relative overflow-hidden rounded-xl p-6 md:p-8
                            transform transition-all duration-700
                            ${isVisible['contact'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
                        `}
                        style={{
                            transitionDelay: '100ms',
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <h3 className="font-bold text-lg mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Get In Touch
                        </h3>
                        <div className="space-y-4">
                            {companyInfo.email && (
                                <a
                                    href={`mailto:${companyInfo.email}`}
                                    className="flex items-center gap-4 group"
                                >
                                    <div
                                        className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300"
                                        style={{ background: 'linear-gradient(135deg, #ed1515, #c80d0d)' }}
                                    >
                                        <EmailIcon />
                                    </div>
                                    <div>
                                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Email</p>
                                        <p className="font-medium group-hover:text-primary-500 transition-colors">
                                            {companyInfo.email}
                                        </p>
                                    </div>
                                </a>
                            )}
                            {companyInfo.phone && (
                                <a
                                    href={`tel:${companyInfo.phone}`}
                                    className="flex items-center gap-4 group"
                                >
                                    <div
                                        className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300"
                                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                                    >
                                        <PhoneIcon />
                                    </div>
                                    <div>
                                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Phone</p>
                                        <p className="font-medium group-hover:text-primary-500 transition-colors">
                                            {companyInfo.phone}
                                        </p>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
