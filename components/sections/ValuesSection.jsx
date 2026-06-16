"use client";

import React, { useRef, useEffect, useState } from 'react';
import { getImageUrl } from '@/utils/imageUtils';
import CanvasGridBackground from '@/components/CanvasGridBackground';

const ValuesSection = ({ values }) => {
    const activeValues = values.filter(value => value.is_active);
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
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

    if (activeValues.length === 0) return null;

    // Build the acronym from first letters
    const acronym = activeValues.map(v => v.title.charAt(0).toUpperCase()).join('');

    return (
        <section
            id="values"
            ref={sectionRef}
            className="py-10 md:py-14 relative overflow-hidden"
            style={{
                borderTop: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
            }}
        >
            {/* Video Background */}
            <CanvasGridBackground bgSelector="#universal-bg-image" solidColor="transparent" dotColor="#ff2d2d" boxSize={100} blur={3} darken={0.4} />

            {/* Grid background */}
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

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 10 }}>
                <p className="mono-label text-center mb-3">{'// Our Principles'}</p>
                <h2 className="section-title mb-2">Our Values</h2>
                <p className="section-subtitle mb-6" style={{ color: 'var(--color-text)' }}>
                    The principles that guide everything we do
                </p>

                {/* Acronym badge */}
                <div className="flex justify-center mb-14">
                    <div
                        className="inline-flex items-center gap-1 px-5 py-2 rounded-full"
                        style={{
                            background: 'rgba(255, 45, 45, 0.08)',
                            border: '1px solid rgba(255, 45, 45, 0.2)',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        {acronym.split('').map((letter, i) => (
                            <span
                                key={i}
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: '1.5rem',
                                    fontWeight: 800,
                                    color: '#ff2d2d',
                                    textShadow: '0 0 20px rgba(255, 45, 45, 0.4)',
                                    letterSpacing: '0.15em',
                                    animation: isVisible ? `fadeInUp 0.4s ease-out ${i * 0.1}s both` : 'none',
                                }}
                            >
                                {letter}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Values list — vertical acronym layout */}
                <div className="relative">
                    {/* Vertical glowing connector line */}
                    <div
                        className="absolute left-[2.75rem] md:left-[3.75rem] top-0 bottom-0 w-[2px] hidden sm:block"
                        style={{
                            background: isVisible
                                ? 'linear-gradient(180deg, rgba(255, 45, 45, 0.6) 0%, rgba(255, 45, 45, 0.15) 50%, rgba(255, 45, 45, 0.6) 100%)'
                                : 'transparent',
                            boxShadow: isVisible ? '0 0 8px rgba(255, 45, 45, 0.3)' : 'none',
                            transition: 'all 1s ease-out',
                        }}
                    />

                    <div className="flex flex-col gap-4 md:gap-5">
                        {activeValues.map((value, index) => {
                            const letter = value.title.charAt(0).toUpperCase();

                            return (
                                <div
                                    key={value.id}
                                    className="group relative flex items-stretch gap-4 md:gap-6"
                                    style={{
                                        animation: isVisible ? `fadeInUp 0.6s ease-out ${index * 0.12}s both` : 'none',
                                    }}
                                >
                                    {/* Giant letter */}
                                    <div className="relative flex-shrink-0 flex items-center justify-center w-[5.5rem] md:w-[7.5rem]">
                                        {/* Glow behind letter */}
                                        <div
                                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{
                                                background: 'radial-gradient(circle, rgba(255, 45, 45, 0.12) 0%, transparent 70%)',
                                            }}
                                        />
                                        {/* The letter itself */}
                                        <span
                                            className="relative select-none transition-all duration-500 group-hover:scale-110"
                                            style={{
                                                fontFamily: "'Space Grotesk', sans-serif",
                                                fontSize: 'clamp(3rem, 6vw, 5rem)',
                                                fontWeight: 900,
                                                lineHeight: 1,
                                                background: 'linear-gradient(135deg, #ff2d2d 0%, #ff6b6b 50%, #ff2d2d 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                                filter: 'drop-shadow(0 0 15px rgba(255, 45, 45, 0.35))',
                                            }}
                                        >
                                            {letter}
                                        </span>

                                        {/* Connector dot on the vertical line */}
                                        <div
                                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full hidden sm:block transition-all duration-300"
                                            style={{
                                                background: '#ff2d2d',
                                                boxShadow: '0 0 10px rgba(255, 45, 45, 0.5), 0 0 20px rgba(255, 45, 45, 0.2)',
                                                border: '2px solid rgba(255, 45, 45, 0.3)',
                                            }}
                                        />
                                    </div>

                                    {/* Content card */}
                                    <div
                                        className="flex-1 group relative overflow-hidden rounded-2xl glass-card transition-all duration-500 group-hover:translate-x-1"
                                        style={{ minHeight: '100px' }}
                                    >
                                        {/* Top accent line on hover */}
                                        <div
                                            className="absolute top-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                                            style={{
                                                background: 'linear-gradient(90deg, #ff2d2d, transparent)',
                                                zIndex: 5,
                                            }}
                                        />

                                        {/* Background image if available */}
                                        {value.image_url && (
                                            <div className="absolute inset-0" style={{ zIndex: 0 }}>
                                                <img
                                                    src={getImageUrl(value.image_url)}
                                                    alt={value.title}
                                                    className="w-full h-full object-cover opacity-[0.06] dark:opacity-[0.08] group-hover:opacity-[0.12] dark:group-hover:opacity-[0.15] transition-opacity duration-500"
                                                />
                                            </div>
                                        )}

                                        {/* Card inner content */}
                                        <div className="relative p-5 md:p-6 flex items-center gap-4 md:gap-5" style={{ zIndex: 4 }}>
                                            {/* Icon badge */}
                                            {value.icon ? (
                                                <div
                                                    className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                                                    style={{
                                                        background: 'rgba(255, 45, 45, 0.08)',
                                                        border: '1px solid rgba(255, 45, 45, 0.15)',
                                                        backdropFilter: 'blur(8px)',
                                                    }}
                                                >
                                                    <i className={`${value.icon} text-xl md:text-2xl`} style={{ color: '#ff2d2d' }} />
                                                </div>
                                            ) : value.image_url ? (
                                                <div
                                                    className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300"
                                                    style={{ border: '2px solid rgba(255, 45, 45, 0.15)' }}
                                                >
                                                    <img
                                                        src={getImageUrl(value.image_url)}
                                                        alt={value.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : null}

                                            {/* Text content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-baseline gap-2 mb-1">
                                                    <h3
                                                        className="text-lg md:text-xl font-bold group-hover:text-primary-500 transition-colors"
                                                        style={{
                                                            fontFamily: "'Space Grotesk', sans-serif",
                                                        }}
                                                    >
                                                        {value.title}
                                                    </h3>
                                                    {/* Small mono index */}
                                                    <span
                                                        className="hidden sm:inline text-xs opacity-30"
                                                        style={{
                                                            fontFamily: "'JetBrains Mono', monospace",
                                                            color: '#ff2d2d',
                                                        }}
                                                    >
                                                        {String(index + 1).padStart(2, '0')}
                                                    </span>
                                                </div>

                                                {/* Red gradient divider */}
                                                <div
                                                    className="mb-2 h-[1px] w-10 group-hover:w-16 transition-all duration-500"
                                                    style={{
                                                        background: 'linear-gradient(90deg, #ff2d2d, rgba(255, 255, 255, 0.2))',
                                                    }}
                                                />

                                                {value.description && (
                                                    <p
                                                        className="text-sm md:text-base leading-relaxed line-clamp-3"
                                                        style={{ color: 'var(--color-text-secondary)' }}
                                                    >
                                                        {value.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Keyframe for fadeInUp */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
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

export default ValuesSection;
