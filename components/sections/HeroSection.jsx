import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getImageUrl } from '../../utils/imageUtils';

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
        image_url: null, // Will use default gradient
        button_text: 'Learn More',
        button_link: '#about'
    }];

    const currentHero = displayHeroes[currentSlide];

    return (
        <section id="home" className="relative h-screen w-full overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
                style={{
                    backgroundImage: currentHero.image_url
                        ? `url(${getImageUrl(currentHero.image_url)})`
                        : 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent dark:from-black/80 dark:via-black/60" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-3xl animate-fadeIn">
                        {currentHero.subtitle && (
                            <p className="text-primary-400 dark:text-primary-300 font-semibold mb-4 text-lg animate-slideDown">
                                {currentHero.subtitle}
                            </p>
                        )}
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 animate-slideUp">
                            {currentHero.title}
                        </h1>
                        {currentHero.description && (
                            <p className="text-xl md:text-2xl text-gray-200 dark:text-gray-300 mb-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                                {currentHero.description}
                            </p>
                        )}
                        {currentHero.button_text && currentHero.button_link && (
                            <a
                                href={currentHero.button_link}
                                className="inline-block btn-primary animate-scaleIn"
                                style={{ animationDelay: '0.4s' }}
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
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(220, 38, 38, 0.8)',
                            },
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
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(220, 38, 38, 0.8)',
                            },
                        }}
                    >
                        <ChevronRightIcon fontSize="large" />
                    </IconButton>
                </>
            )}

            {/* Dots Indicator */}
            {activeHeroes.length > 1 && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                    {activeHeroes.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                ? 'bg-primary-600 w-8'
                                : 'bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default HeroSection;
