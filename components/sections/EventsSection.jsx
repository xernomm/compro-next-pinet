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
import { getImageUrl } from '../../utils/imageUtils';
import { format } from 'date-fns';
import { GridPlaceholder } from '../PlaceholderCard';

const EventsSection = ({ events }) => {
    const publishedEvents = events.filter(event => event.is_published);

    if (publishedEvents.length === 0) {
        return (
            <section id="events" className="section-container">
                <h2 className="section-title p-4">Upcoming Events</h2>
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
        seminar: 'from-blue-500 to-indigo-600',
        workshop: 'from-purple-500 to-violet-600',
        conference: 'from-emerald-500 to-teal-600',
        webinar: 'from-cyan-500 to-blue-600',
        training: 'from-amber-500 to-orange-600',
        exhibition: 'from-rose-500 to-red-600',
        other: 'from-gray-500 to-slate-600',
    };

    if (upcomingEvents.length === 0) {
        return (
            <section id="events" className="section-container">
                <h2 className="section-title">Upcoming Events</h2>
                <p className="section-subtitle">
                    No upcoming events at the moment. Check back soon!
                </p>
            </section>
        );
    }

    return (
        <section id="events" className="section-container">
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">
                Join us at our upcoming events and stay connected
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event, index) => (
                    <Link
                        key={event.id}
                        href={`/events/${event.slug}`}
                        className="card overflow-hidden group cursor-pointer block"
                        style={{
                            animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                        }}
                    >
                        {/* Image */}
                        <div className="relative h-48 bg-gray-200 dark:bg-dark-800 overflow-hidden">
                            {event.featured_image ? (
                                <img
                                    src={getImageUrl(event.featured_image)}
                                    alt={event.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${eventTypeColors[event.event_type] || eventTypeColors.other}`}>
                                    <span className="text-white text-4xl font-bold">
                                        {event.title.charAt(0)}
                                    </span>
                                </div>
                            )}

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {event.is_featured && (
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-semibold shadow-lg">
                                    <StarIcon fontSize="small" />
                                    <span>Featured</span>
                                </div>
                            )}

                            {event.is_online && (
                                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-semibold">
                                    <VideocamIcon fontSize="small" />
                                    <span>Online</span>
                                </div>
                            )}

                            {event.event_type && (
                                <div className="absolute bottom-4 left-4">
                                    <Chip
                                        label={event.event_type}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            fontWeight: 600,
                                            textTransform: 'capitalize',
                                            backdropFilter: 'blur(10px)',
                                        }}
                                    />
                                </div>
                            )}

                            {/* Hover CTA */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm px-4 py-2 rounded-full text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    View Event <ArrowForwardIcon fontSize="small" />
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                {event.title}
                            </h3>

                            <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                                {event.start_date && (
                                    <div className="flex items-center space-x-2">
                                        <CalendarTodayIcon fontSize="small" />
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
                                        <AccessTimeIcon fontSize="small" />
                                        <span>
                                            {formatTime(event.start_time)}
                                            {event.end_time && <> - {formatTime(event.end_time)}</>}
                                        </span>
                                    </div>
                                )}

                                {!event.is_online && (event.location || event.venue) && (
                                    <div className="flex items-center space-x-2">
                                        <LocationOnIcon fontSize="small" />
                                        <span className="line-clamp-1">{event.venue || event.location}</span>
                                    </div>
                                )}

                                {event.max_participants && (
                                    <div className="flex items-center space-x-2">
                                        <PeopleIcon fontSize="small" />
                                        <span>Max {event.max_participants} participants</span>
                                    </div>
                                )}
                            </div>

                            <div className="text-primary-600 dark:text-primary-400 font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                                View Details
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default EventsSection;
