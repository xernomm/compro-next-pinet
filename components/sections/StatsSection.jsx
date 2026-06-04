"use client";

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

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
        <div ref={ref} className="text-5xl md:text-6xl font-bold filter dark:drop-shadow-[0_0_20px_rgba(255,45,45,0.3)]">
            <span 
                className="text-[var(--color-primary)] dark:bg-gradient-to-br dark:from-[var(--color-primary)] dark:via-[var(--color-primary-light)] dark:to-[var(--color-accent)] dark:bg-clip-text dark:text-transparent inline-block"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                {prefix}{count.toLocaleString()}{suffix}
            </span>
        </div>
    );
};

const StatsSection = ({ companyInfo }) => {
    const currentYear = new Date().getFullYear();
    const yearsInBusiness = companyInfo?.established_year
        ? currentYear - companyInfo.established_year
        : 0;

    const stats = [
        {
            value: yearsInBusiness,
            suffix: '+',
            label: 'Years of Excellence',
            icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 2L20 10L28 11L22 17L24 26L16 22L8 26L10 17L4 11L12 10L16 2Z"
                        stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
            ),
        },
        {
            value: 500,
            suffix: '+',
            label: 'Happy Clients',
            icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M6 28C6 22 10 18 16 18C22 18 26 22 26 28" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
            ),
        },
        {
            value: 300,
            suffix: '+',
            label: 'Projects Completed',
            icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="4" y="4" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <path d="M10 16L14 20L22 12" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
            ),
        },
        {
            value: 50,
            suffix: '+',
            label: 'Team Members',
            icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
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
            className="py-24 relative overflow-hidden"
            style={{
                background: 'var(--color-bg-secondary)',
                borderTop: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
            }}
        >
            {/* Grid background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255, 45, 45, 0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 45, 45, 0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Ambient glow orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
                        animationDelay: '1.5s',
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center group"
                            style={{
                                animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
                            }}
                        >
                            {/* Icon */}
                            <div
                                className="mb-5 mx-auto w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                style={{
                                    color: 'var(--color-primary)',
                                    background: 'rgba(255, 45, 45, 0.05)',
                                    border: '1px solid rgba(255, 45, 45, 0.15)',
                                }}
                            >
                                {stat.icon}
                            </div>
                            {/* Value */}
                            <AnimatedCounter
                                end={stat.value}
                                suffix={stat.suffix}
                                duration={2000 + (index * 200)}
                            />
                            {/* Label */}
                            <div
                                className="mt-3 text-sm font-medium"
                                style={{
                                    color: 'var(--color-text-secondary)',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {stat.label}
                            </div>
                            {/* Divider */}
                            <div
                                className="mt-4 mx-auto w-8 h-[1px] transition-all duration-500 group-hover:w-12"
                                style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(255, 45, 45, 0.5), transparent)',
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
