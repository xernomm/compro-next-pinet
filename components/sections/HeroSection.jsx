"use client";

import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getImageUrl } from '@/utils/imageUtils';

const HeroSection = ({ heroes }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const activeHeroes = heroes.filter(hero => hero.is_active);

    useEffect(() => {
        if (activeHeroes.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeHeroes.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [activeHeroes.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % activeHeroes.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + activeHeroes.length) % activeHeroes.length);
    };

    // Default hero if no active heroes
    const displayHeroes = activeHeroes.length > 0 ? activeHeroes : [{
        id: 'default',
        title: 'Welcome to Our Company',
        subtitle: 'We provide the best solutions for your business',
        description: 'Leading the way in innovation and excellence.',
        image_url: null,
        button_text: 'Learn More',
        button_link: '#about'
    }];

    const currentHero = displayHeroes[currentSlide];

    return (
        <section id="home" className="relative h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
                style={{
                    backgroundImage: currentHero.image_url
                        ? `url(${getImageUrl(currentHero.image_url)})`
                        : 'linear-gradient(135deg, #0a0a0f 0%, #1a0505 40%, #0a0a0f 100%)',
                }}
            >
                {/* Dramatic gradient overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.5) 100%)',
                    }}
                />
            </div>

            {/* Animated grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255, 45, 45, 0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 45, 45, 0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                }}
            />

            {/* Accent diagonal line */}
            <div
                className="absolute pointer-events-none hidden md:block"
                style={{
                    top: '10%',
                    right: '15%',
                    width: '1px',
                    height: '300px',
                    background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    transform: 'rotate(20deg)',
                }}
            />
            <div
                className="absolute pointer-events-none hidden md:block"
                style={{
                    top: '20%',
                    right: '12%',
                    width: '1px',
                    height: '200px',
                    background: 'linear-gradient(180deg, transparent, rgba(255, 45, 45, 0.3), transparent)',
                    transform: 'rotate(20deg)',
                }}
            />

            {/* Bottom gradient fade */}
            <div
                className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                style={{
                    background: 'linear-gradient(to top, var(--color-bg) 0%, transparent 100%)',
                }}
            />

            {/* Content */}
            <div className="relative h-full flex items-center z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-3xl">
                        {currentHero.subtitle && (
                            <p
                                key={`sub-${currentSlide}`}
                                className="mb-5 text-sm animate-slideDown"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: '#ff2d2d',
                                    textShadow: '0 0 20px rgba(255, 45, 45, 0.3)',
                                }}
                            >
                                {'// '}{currentHero.subtitle}
                            </p>
                        )}
                        <h1
                            key={`title-${currentSlide}`}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 flex flex-wrap"
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                textTransform: 'uppercase',
                                letterSpacing: '0.02em',
                                lineHeight: '1.05',
                                textShadow: '0 0 40px rgba(255, 45, 45, 0.2)',
                            }}
                        >
                            {currentHero.title.split(' ').map((word, index) => (
                                <span
                                    key={index}
                                    className="inline-block mr-[0.25em] last:mr-0 overflow-hidden"
                                >
                                    <span
                                        className="inline-block animate-text-reveal"
                                        style={{
                                            animationDelay: `${index * 0.12}s`,
                                            animationFillMode: 'both',
                                        }}
                                    >
                                        {word}
                                    </span>
                                </span>
                            ))}
                        </h1>
                        {currentHero.description && (
                            <p
                                key={`desc-${currentSlide}`}
                                className="text-lg md:text-xl text-gray-300 mb-10 animate-slideUp max-w-2xl"
                                style={{ 
                                    animationDelay: `${currentHero.title.split(' ').length * 0.12 + 0.1}s`,
                                    animationFillMode: 'both',
                                    lineHeight: '1.7' 
                                }}
                            >
                                {currentHero.description}
                            </p>
                        )}
                        {currentHero.button_text && currentHero.button_link && (
                            <a
                                key={`btn-${currentSlide}`}
                                href={currentHero.button_link}
                                className="inline-block btn-primary animate-scaleIn"
                                style={{ 
                                    animationDelay: `${currentHero.title.split(' ').length * 0.12 + 0.3}s`,
                                    animationFillMode: 'both' 
                                }}
                            >
                                {currentHero.button_text}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            {activeHeroes.length > 1 && (
                <>
                    <IconButton
                        onClick={prevSlide}
                        sx={{
                            position: 'absolute',
                            left: { xs: 16, md: 32 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 45, 45, 0.6)',
                                borderColor: 'rgba(255, 45, 45, 0.8)',
                                boxShadow: '0 0 20px rgba(255, 45, 45, 0.3)',
                            },
                            transition: 'all 0.3s',
                            zIndex: 20,
                        }}
                    >
                        <ChevronLeftIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                        onClick={nextSlide}
                        sx={{
                            position: 'absolute',
                            right: { xs: 16, md: 32 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 45, 45, 0.6)',
                                borderColor: 'rgba(255, 45, 45, 0.8)',
                                boxShadow: '0 0 20px rgba(255, 45, 45, 0.3)',
                            },
                            transition: 'all 0.3s',
                            zIndex: 20,
                        }}
                    >
                        <ChevronRightIcon fontSize="large" />
                    </IconButton>
                </>
            )}

            {/* Slide Indicator — Horizontal Lines */}
            {activeHeroes.length > 1 && (
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                    {activeHeroes.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className="transition-all duration-500"
                            style={{
                                width: index === currentSlide ? '48px' : '24px',
                                height: '3px',
                                borderRadius: '2px',
                                background: index === currentSlide
                                    ? 'linear-gradient(90deg, #ff2d2d, #ffffff)'
                                    : 'rgba(255, 255, 255, 0.25)',
                                boxShadow: index === currentSlide
                                    ? '0 0 10px rgba(255, 45, 45, 0.5)'
                                    : 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default HeroSection;
