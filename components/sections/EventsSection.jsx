"use client";

import React from 'react';
import Link from 'next/link';
import { Chip } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import VideocamIcon from '@mui/icons-material/Videocam';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getImageUrl } from '@/utils/imageUtils';
import { format } from 'date-fns';
import { GridPlaceholder } from '../PlaceholderCard';

const EventsSection = ({ events }) => {
    const publishedEvents = events.filter(event => event.is_published);

    if (publishedEvents.length === 0) {
        return (
            <section id="events" className="section-container">
                <p className="mono-label text-center mb-3">{'// Join Us'}</p>
                <h2 className="section-title">Upcoming Events</h2>
                <p className="section-subtitle">
                    Join us at our upcoming events and conferences
                </p>
                <GridPlaceholder count={3} type="event" />
            </section>
        );
    }

    const upcomingEvents = publishedEvents.filter(event => {
        if (!event.start_date) return false;
        return new Date(event.start_date) >= new Date();
    });

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString;
    };

    const eventTypeColors = {
        seminar: '#6366f1',
        workshop: '#8b5cf6',
        conference: '#10b981',
        webinar: '#ffffff',
        training: '#f59e0b',
        exhibition: '#ff2d2d',
        other: '#64748b',
    };

    if (upcomingEvents.length === 0) {
        return (
            <section id="events" className="section-container">
                <p className="mono-label text-center mb-3">{'// Join Us'}</p>
                <h2 className="section-title">Upcoming Events</h2>
                <p className="section-subtitle">
                    No upcoming events at the moment. Check back soon!
                </p>
            </section>
        );
    }

    return (
        <section id="events" className="section-container">
            <p className="mono-label text-center mb-3">{'// Join Us'}</p>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">
                Join us at our upcoming events and stay connected
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event, index) => {
                    const typeColor = eventTypeColors[event.event_type] || eventTypeColors.other;
                    return (
                        <Link key={event.id}
                            href={`/events/${event.slug}`}
                            className="group block relative overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-2 glass-card glass-highlight"
                            style={{
                                animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                            }}
                        >
                            {/* Top accent */}
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10"
                                style={{ background: `linear-gradient(90deg, ${typeColor}, #ffffff)` }}
                            />

                            {/* Image */}
                            <div className="relative h-48 overflow-hidden" style={{ background: 'var(--color-bg-tertiary)' }}>
                                {event.featured_image ? (
                                    <img
                                        src={getImageUrl(event.featured_image)}
                                        alt={event.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center"
                                        style={{ background: `linear-gradient(135deg, ${typeColor}, ${typeColor}80)` }}
                                    >
                                        <span className="text-white text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                            {event.title.charAt(0)}
                                        </span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {event.is_featured && (
                                    <div
                                        className="absolute top-4 right-4 px-3 py-1 rounded-md flex items-center space-x-1 text-xs font-semibold shadow-lg z-10"
                                        style={{
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            letterSpacing: '0.06em',
                                            textTransform: 'uppercase',
                                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                            color: 'white',
                                        }}
                                    >
                                        <StarIcon sx={{ fontSize: 14 }} />
                                        <span>Featured</span>
                                    </div>
                                )}

                                {event.is_online && (
                                    <div
                                        className="absolute top-4 left-4 px-3 py-1 rounded-md flex items-center space-x-1 text-xs font-semibold z-10"
                                        style={{
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            letterSpacing: '0.06em',
                                            textTransform: 'uppercase',
                                            background: 'rgba(22, 22, 26, 0.8)',
                                            color: '#ffffff',
                                            border: '1px solid rgba(255, 45, 45, 0.3)',
                                            backdropFilter: 'blur(10px)',
                                        }}
                                    >
                                        <VideocamIcon sx={{ fontSize: 14 }} />
                                        <span>Online</span>
                                    </div>
                                )}

                                {event.event_type && (
                                    <div className="absolute bottom-4 left-4 z-10">
                                        <Chip
                                            label={event.event_type}
                                            size="small"
                                            sx={{
                                                fontFamily: "'Space Grotesk', sans-serif",
                                                fontSize: '0.65rem',
                                                letterSpacing: '0.05em',
                                                textTransform: 'uppercase',
                                                backgroundColor: 'rgba(10, 10, 15, 0.8)',
                                                color: typeColor,
                                                fontWeight: 600,
                                                backdropFilter: 'blur(10px)',
                                                border: `1px solid ${typeColor}30`,
                                            }}
                                        />
                                    </div>
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
                                        View Event <ArrowForwardIcon fontSize="small" />
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3
                                    className="text-lg font-bold mb-3 group-hover:text-primary-500 transition-colors line-clamp-2"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    {event.title}
                                </h3>

                                <div className="space-y-2 mb-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                    {event.start_date && (
                                        <div className="flex items-center space-x-2">
                                            <CalendarTodayIcon sx={{ fontSize: 14 }} />
                                            <span>
                                                {formatDate(event.start_date)}
                                                {event.end_date && event.end_date !== event.start_date && (
                                                    <> - {formatDate(event.end_date)}</>
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {(event.start_time || event.end_time) && (
                                        <div className="flex items-center space-x-2">
                                            <AccessTimeIcon sx={{ fontSize: 14 }} />
                                            <span>
                                                {formatTime(event.start_time)}
                                                {event.end_time && <> - {formatTime(event.end_time)}</>}
                                            </span>
                                        </div>
                                    )}

                                    {!event.is_online && (event.location || event.venue) && (
                                        <div className="flex items-center space-x-2">
                                            <LocationOnIcon sx={{ fontSize: 14 }} />
                                            <span className="line-clamp-1">{event.venue || event.location}</span>
                                        </div>
                                    )}

                                    {event.max_participants && (
                                        <div className="flex items-center space-x-2">
                                            <PeopleIcon sx={{ fontSize: 14 }} />
                                            <span>Max {event.max_participants} participants</span>
                                        </div>
                                    )}
                                </div>

                                <div
                                    className="font-semibold flex items-center group-hover:translate-x-2 transition-transform text-sm"
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase',
                                        color: 'var(--color-primary)',
                                    }}
                                >
                                    View Details
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default EventsSection;
