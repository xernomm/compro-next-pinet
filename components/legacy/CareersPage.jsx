import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CanvasGridBackground from '@/components/CanvasGridBackground';

import { Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SocialMediaWidget from '@/components/SocialMediaWidget';
import ChatWidget from '@/components/ChatWidget';
import Loading from '@/components/Loading';
import { GridPlaceholder } from '@/components/PlaceholderCard';
import { companyAPI, careerAPI } from '@/api/apiService';

const CareersPage = () => {
    const [loading, setLoading] = useState(true);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [careers, setCareers] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [companyRes, careersRes] = await Promise.all([
                    companyAPI.getInfo().catch(() => ({ data: null })),
                    careerAPI.getAll().catch(() => ({ data: [] })),
                ]);
                setCompanyInfo(companyRes.data);
                setCareers(Array.isArray(careersRes.data) ? careersRes.data : []);
            } catch (err) {
                console.error('Error fetching careers data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <Loading fullScreen />;
    }

    const openJobs = careers.filter(job => job.status === 'open' && job.is_active);
    const departments = ['all', ...new Set(openJobs.map(j => j.department).filter(Boolean))];

    const filteredJobs = selectedDepartment === 'all'
        ? openJobs
        : openJobs.filter(j => j.department === selectedDepartment);

    const featuredJobs = filteredJobs.filter(j => j.is_featured);
    const regularJobs = filteredJobs.filter(j => !j.is_featured);
    const displayJobs = [...featuredJobs, ...regularJobs];

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    const employmentTypeLabels = {
        full_time: 'Full Time',
        part_time: 'Part Time',
        contract: 'Contract',
        internship: 'Internship',
        freelance: 'Freelance',
    };

    const experienceLevelLabels = {
        entry: 'Entry Level',
        junior: 'Junior',
        mid: 'Mid Level',
        senior: 'Senior',
        lead: 'Lead',
        manager: 'Manager',
    };

    return (
        <>
            <Navbar companyInfo={companyInfo} />

            <main className="pt-20 bg-white dark:bg-cyber-dark text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
                {/* Hero Section */}
                <section 
                    className="relative py-24 overflow-hidden grid-bg border-b border-gray-200 dark:border-cyber-border transition-colors duration-300"
                    style={{ background: 'var(--color-bg-secondary)' }}
                >
                    {/* Canvas Grid Background Effect */}
                    <CanvasGridBackground solidColor="#121214" dotColor="#ff2d2d" boxSize={100} opacityClass="opacity-[0.35] dark:opacity-[0.45]" />

                    {/* Gradient Orbs */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 dark:bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-500/10 dark:bg-white/5 rounded-full blur-3xl"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                        <h1 
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6" 
                            style={{ animation: 'slideUp 0.6s ease-out', fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            Join Our Team
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto" style={{ animation: 'slideUp 0.6s ease-out 0.1s both' }}>
                            Build your career with us and make an impact. Explore exciting opportunities and grow with a team that values innovation.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-gray-200/50 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-full font-medium transition-all duration-300 border border-gray-300 dark:border-white/10"
                            style={{ animation: 'slideUp 0.6s ease-out 0.2s both' }}
                        >
                            <ArrowBackIcon fontSize="small" />
                            Back to Home
                        </Link>
                    </div>
                </section>

                {/* Careers Content */}
                <section className="section-container bg-white dark:bg-cyber-dark py-20">
                    {openJobs.length === 0 ? (
                        <div className="text-center">
                            <h2 className="section-title">No Open Positions</h2>
                            <p className="section-subtitle">
                                We don't have any open positions at the moment, but check back soon!
                            </p>
                            <GridPlaceholder count={3} type="career" />
                        </div>
                    ) : (
                        <>
                            {/* Department Filter */}
                            {departments.length > 1 && (
                                <div className="flex flex-wrap justify-center gap-3 mb-12">
                                    {departments.map((dept) => (
                                        <button
                                            key={dept}
                                            onClick={() => setSelectedDepartment(dept)}
                                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 border ${selectedDepartment === dept
                                                ? 'bg-primary-600 border-primary-600 text-white shadow-red-glow'
                                                : 'bg-white border-gray-200 dark:bg-cyber-surface dark:border-cyber-border text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-950/20'
                                                }`}
                                        >
                                            {dept === 'all' ? 'All Departments' : dept}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                                <div className="bg-white dark:bg-cyber-surface border border-gray-100 dark:border-cyber-border rounded-2xl p-6 text-center shadow-lg">
                                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{openJobs.length}</div>
                                    <div className="text-gray-600 dark:text-gray-400">Open Positions</div>
                                </div>
                                <div className="bg-white dark:bg-cyber-surface border border-gray-100 dark:border-cyber-border rounded-2xl p-6 text-center shadow-lg">
                                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{departments.length - 1}</div>
                                    <div className="text-gray-600 dark:text-gray-400">Departments</div>
                                </div>
                                <div className="bg-white dark:bg-cyber-surface border border-gray-100 dark:border-cyber-border rounded-2xl p-6 text-center shadow-lg">
                                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{featuredJobs.length}</div>
                                    <div className="text-gray-600 dark:text-gray-400">Featured Jobs</div>
                                </div>
                                <div className="bg-white dark:bg-cyber-surface border border-gray-100 dark:border-cyber-border rounded-2xl p-6 text-center shadow-lg">
                                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">100%</div>
                                    <div className="text-gray-600 dark:text-gray-400">Growth Focused</div>
                                </div>
                            </div>

                            {/* Jobs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayJobs.map((job, index) => (
                                    <Link
                                        key={job.id}
                                        href={`/careers/${job.slug}`}
                                        className="bg-white dark:bg-cyber-surface border border-gray-100 dark:border-cyber-border rounded-3xl p-6 cursor-pointer group block relative overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                                        style={{
                                            animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                                        }}
                                    >
                                        {/* Featured Badge */}
                                        {job.is_featured && (
                                            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-bl-2xl flex items-center space-x-1 text-sm font-semibold">
                                                <StarIcon fontSize="small" />
                                                <span>Featured</span>
                                            </div>
                                        )}

                                        <h3 
                                            className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors pr-20"
                                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                        >
                                            {job.job_title}
                                        </h3>

                                        <div className="space-y-2 mb-4">
                                            {job.department && (
                                                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                                    <WorkIcon fontSize="small" />
                                                    <span>{job.department}</span>
                                                </div>
                                            )}

                                            {job.location && (
                                                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                                    <LocationOnIcon fontSize="small" />
                                                    <span>{job.location}</span>
                                                </div>
                                            )}

                                            {job.application_deadline && (
                                                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                                    <CalendarTodayIcon fontSize="small" />
                                                    <span>Apply by {formatDate(job.application_deadline)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {job.employment_type && (
                                                <Chip
                                                    label={employmentTypeLabels[job.employment_type] || job.employment_type}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                        color: '#ef4444',
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            )}
                                            {job.experience_level && (
                                                <Chip
                                                    label={experienceLevelLabels[job.experience_level] || job.experience_level}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        borderColor: 'rgba(107, 114, 128, 0.3)',
                                                        color: 'var(--color-text-secondary)',
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {job.salary_range && (
                                            <p className="text-primary-600 dark:text-primary-400 font-semibold mb-4">
                                                {job.salary_range}
                                            </p>
                                        )}

                                        <div className="text-primary-600 dark:text-primary-400 font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                                            View Details
                                            <ArrowForwardIcon fontSize="small" className="ml-2" />
                                        </div>

                                        {/* Hover shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </main>

            <Footer companyInfo={companyInfo} />
            <ScrollToTop />
            <ChatWidget />
            <SocialMediaWidget companyInfo={companyInfo} />
        </>
    );
};

export default CareersPage;
