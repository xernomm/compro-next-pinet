import React, { useState, useEffect } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const toggleVisibility = () => {
            // Calculate scroll progress
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;

            setScrollProgress(scrolled);
            setIsVisible(window.pageYOffset > 300);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {/* Scroll Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-dark-800 z-50">
                <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-700 transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Scroll to Top Button */}
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-40 group"
                    style={{
                        animation: 'bounceIn 0.6s ease-out'
                    }}
                    aria-label="Scroll to top"
                >
                    <div className="relative">
                        {/* Progress Circle */}
                        <svg className="w-14 h-14 transform -rotate-90">
                            <circle
                                cx="28"
                                cy="28"
                                r="24"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                className="text-gray-300 dark:text-gray-700"
                            />
                            <circle
                                cx="28"
                                cy="28"
                                r="24"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 24}`}
                                strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
                                className="text-primary-600 dark:text-primary-400 transition-all duration-300"
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* Button Content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center shadow-lg group-hover:bg-primary-700 dark:group-hover:bg-primary-600 transition-all duration-300 group-hover:scale-110 animate-pulse-glow">
                                <KeyboardArrowUpIcon />
                            </div>
                        </div>
                    </div>
                </button>
            )}
        </>
    );
};

export default ScrollToTop;
