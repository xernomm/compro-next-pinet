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
            color: 'from-red-500 to-rose-600',
        },
        {
            id: 'history',
            label: 'History',
            icon: <HistoryIcon />,
            content: companyInfo.history,
            color: 'from-amber-500 to-orange-600',
        },
        {
            id: 'vision',
            label: 'Vision',
            icon: <VisibilityIcon />,
            content: companyInfo.vision,
            color: 'from-blue-500 to-indigo-600',
        },
        {
            id: 'mission',
            label: 'Mission',
            icon: <TrackChangesIcon />,
            content: companyInfo.mission,
            color: 'from-emerald-500 to-teal-600',
        },
    ].filter(tab => tab.content);

    const statsData = [
        {
            id: 'years',
            value: companyInfo.established_year ? new Date().getFullYear() - companyInfo.established_year : null,
            label: 'Years of Excellence',
            suffix: '+',
            icon: <EmojiEventsIcon sx={{ fontSize: 28 }} />,
            gradient: 'from-red-500 to-rose-600',
        },
        {
            id: 'established',
            value: companyInfo.established_year,
            label: 'Established',
            prefix: 'Est. ',
            icon: <GroupsIcon sx={{ fontSize: 28 }} />,
            gradient: 'from-orange-500 to-amber-600',
        },
        {
            id: 'commitment',
            value: 100,
            label: 'Commitment',
            suffix: '%',
            icon: <HandshakeIcon sx={{ fontSize: 28 }} />,
            gradient: 'from-emerald-500 to-teal-600',
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
        <section id="about" className="section-container bg-gray-50 dark:bg-dark-900 relative overflow-hidden" ref={sectionRef}>
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-500/10 to-rose-500/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="text-center">
                    <h2 style={{ height: "60px" }} className="section-title m-0">About {companyInfo.company_name}</h2>
                    {companyInfo.tagline && (
                        <p className="section-subtitle">{companyInfo.tagline}</p>
                    )}
                </div>

                {/* Stats Row */}
                {statsData.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-12">
                        {statsData.map((stat, index) => (
                            <div
                                key={stat.id}
                                data-widget={`stat-${stat.id}`}
                                className={`
                                    relative group overflow-hidden
                                    bg-white dark:bg-dark-800 rounded-2xl p-6 md:p-8
                                    border border-gray-200 dark:border-dark-700
                                    transform transition-all duration-500
                                    hover:scale-[1.02] hover:-translate-y-1
                                    ${isVisible[`stat-${stat.id}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                                `}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`
                                        flex-shrink-0 w-14 h-14 rounded-xl
                                        bg-gradient-to-br ${stat.gradient} text-white
                                        flex items-center justify-center
                                        shadow-lg
                                    `}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                            <AnimatedCounter
                                                value={stat.value}
                                                prefix={stat.prefix || ''}
                                                suffix={stat.suffix || ''}
                                            />
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
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
                            bg-white dark:bg-dark-800 rounded-3xl overflow-hidden shadow-xl
                            border border-gray-200 dark:border-dark-700
                            mb-12 transition-all duration-700
                            ${isVisible['tabs'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                        `}
                    >
                        {/* Tab Headers */}
                        <div className="flex flex-wrap border-b border-gray-200 dark:border-dark-700">
                            {tabData.map((tab, index) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(index)}
                                    className={`
                                        flex-1 min-w-[120px] px-4 md:px-6 py-4 md:py-5
                                        flex items-center justify-center gap-2
                                        font-semibold text-sm md:text-base
                                        transition-all duration-300 relative
                                        ${activeTab === index
                                            ? 'text-primary-600 dark:text-primary-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }
                                    `}
                                >
                                    <span className={`transition-transform duration-300 ${activeTab === index ? 'scale-110' : ''}`}>
                                        {tab.icon}
                                    </span>
                                    <span className="hidden sm:inline">{tab.label}</span>

                                    {/* Active indicator */}
                                    {activeTab === index && (
                                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tab.color}`}></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 md:p-10">
                            {tabData.map((tab, index) => (
                                <div
                                    key={tab.id}
                                    className={`
                                        transition-all duration-500
                                        ${activeTab === index
                                            ? 'opacity-100 translate-x-0'
                                            : 'opacity-0 absolute -translate-x-8 pointer-events-none'
                                        }
                                    `}
                                >
                                    {activeTab === index && (
                                        <>
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tab.color} text-white flex items-center justify-center shadow-lg`}>
                                                    {tab.icon}
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {tab.label}
                                                </h3>
                                            </div>
                                            <div
                                                className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed"
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
                                relative overflow-hidden rounded-2xl p-6 md:p-8
                                bg-white dark:bg-dark-800
                                border border-gray-200 dark:border-dark-700
                                transform transition-all duration-700 hover:shadow-lg
                                ${isVisible['location'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
                            `}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
                                    <LocationOnIcon sx={{ fontSize: 28 }} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3">
                                        Our Location
                                    </h3>
                                    <div className="text-gray-600 dark:text-gray-400 space-y-1">
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
                            relative overflow-hidden rounded-2xl p-6 md:p-8
                            bg-white dark:bg-dark-800
                            border border-gray-200 dark:border-dark-700
                            transform transition-all duration-700 hover:shadow-lg
                            ${isVisible['contact'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
                        `}
                        style={{ transitionDelay: '100ms' }}
                    >
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-6">
                            Get In Touch
                        </h3>
                        <div className="space-y-4">
                            {companyInfo.email && (
                                <a
                                    href={`mailto:${companyInfo.email}`}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <EmailIcon />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">Email</p>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <PhoneIcon />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">Phone</p>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
