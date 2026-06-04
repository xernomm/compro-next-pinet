"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getImageUrl } from '@/utils/imageUtils';
import { format } from 'date-fns';
import { GridPlaceholder } from '../PlaceholderCard';

const NewsSection = ({ news }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const publishedNews = news.filter(item => item.is_published);
    const categories = ['all', ...new Set(publishedNews.map(n => n.category).filter(Boolean))];

    const filteredNews = selectedCategory === 'all'
        ? publishedNews
        : publishedNews.filter(n => n.category === selectedCategory);

    const featuredNews = filteredNews.filter(n => n.is_featured);
    const regularNews = filteredNews.filter(n => !n.is_featured);
    const displayNews = [...featuredNews, ...regularNews].slice(0, 6);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    if (publishedNews.length === 0) {
        return (
            <section id="news" className="py-20 md:py-28 relative" style={{ background: 'var(--color-bg-secondary)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="mono-label text-center mb-3">{'// Stay Updated'}</p>
                    <h2 className="section-title">Latest News</h2>
                    <p className="section-subtitle">
                        Stay updated with our latest announcements and insights
                    </p>
                    <GridPlaceholder count={3} type="news" />
                </div>
            </section>
        );
    }

    return (
        <section id="news" className="py-20 md:py-28 relative grid-bg" style={{ background: 'var(--color-bg-secondary)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <p className="mono-label text-center mb-3">{'// Stay Updated'}</p>
                <h2 className="section-title">Latest News</h2>
                <p className="section-subtitle">
                    Stay updated with our latest announcements and insights
                </p>

                {/* Category Filter */}
                {categories.length > 1 && (
                    <div className="flex justify-center mb-12 flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className="px-6 py-2 text-sm font-semibold transition-all duration-300"
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    borderRadius: '6px',
                                    background: selectedCategory === category
                                        ? 'linear-gradient(135deg, #ed1515, #ff2d2d)'
                                        : 'var(--color-surface)',
                                    color: selectedCategory === category ? 'white' : 'var(--color-text-secondary)',
                                    border: selectedCategory === category
                                        ? 'none'
                                        : '1px solid var(--color-border)',
                                    boxShadow: selectedCategory === category
                                        ? '0 0 20px rgba(255, 45, 45, 0.3)'
                                        : 'none',
                                    transform: selectedCategory === category ? 'scale(1.05)' : 'scale(1)',
                                }}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                )}

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayNews.map((item, index) => (
                        <Link key={item.id}
                            href={`/news/${item.slug}`}
                            className="group block relative overflow-hidden rounded-xl h-full flex flex-col transition-all duration-500 hover:-translate-y-2 glass-card glass-highlight"
                            style={{
                                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                            }}
                        >
                            {/* Top accent */}
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10"
                                style={{ background: 'linear-gradient(90deg, #ff2d2d, #ffffff)' }}
                            />

                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={getImageUrl(item.featured_image)}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {item.category && (
                                    <span
                                        className="absolute top-4 right-4 text-xs px-3 py-1 shadow-lg z-10"
                                        style={{
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            letterSpacing: '0.06em',
                                            textTransform: 'uppercase',
                                            background: 'rgba(22, 22, 26, 0.8)',
                                            color: '#ffffff',
                                            border: '1px solid rgba(255, 45, 45, 0.3)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '4px',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {item.category}
                                    </span>
                                )}
                                {item.is_featured && (
                                    <span
                                        className="absolute top-4 left-4 p-1.5 rounded-md shadow-lg z-10"
                                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                                    >
                                        <StarIcon sx={{ fontSize: 14, color: 'white' }} />
                                    </span>
                                )}

                                {/* Hover CTA */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span
                                        className="backdrop-blur-sm px-4 py-2 font-semibold flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                        style={{
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontSize: '0.75rem',
                                            letterSpacing: '0.08em',
                                            textTransform: 'uppercase',
                                            background: 'rgba(22, 22, 26, 0.8)',
                                            color: 'var(--color-primary)',
                                            border: '1px solid rgba(255, 45, 45, 0.3)',
                                            borderRadius: '6px',
                                        }}
                                    >
                                        Read Article <ArrowForwardIcon fontSize="small" />
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="flex items-center text-xs mb-3 space-x-4" style={{ color: 'var(--color-text-secondary)' }}>
                                    <span className="flex items-center">
                                        <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                        {formatDate(item.published_date)}
                                    </span>
                                    {item.author && (
                                        <span className="flex items-center">
                                            <PersonIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                            {item.author}
                                        </span>
                                    )}
                                </div>
                                <h3
                                    className="text-lg font-bold mb-3 group-hover:text-primary-500 transition-colors line-clamp-2"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    {item.title}
                                </h3>
                                <p className="mb-4 line-clamp-3 flex-grow text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                    {item.excerpt}
                                </p>
                                <span
                                    className="font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center"
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase',
                                        color: 'var(--color-primary)',
                                    }}
                                >
                                    Read More →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
