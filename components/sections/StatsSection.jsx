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
        <div ref={ref} className="text-4xl md:text-5xl font-bold text-gradient">
            {prefix}{count.toLocaleString()}{suffix}
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
            icon: '🏆'
        },
        {
            value: 500,
            suffix: '+',
            label: 'Happy Clients',
            icon: '😊'
        },
        {
            value: 300,
            suffix: '+',
            label: 'Projects Completed',
            icon: '✅'
        },
        {
            value: 50,
            suffix: '+',
            label: 'Team Members',
            icon: '👥'
        }
    ];

    return (
        <section className="py-16 bg-gradient-to-br from-primary-50 to-white dark:from-dark-900 dark:to-dark-950 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-72 h-72 bg-primary-500 rounded-full filter blur-3xl animate-float"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-600 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center transform hover:scale-110 transition-transform duration-300"
                            style={{
                                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                            }}
                        >
                            <div className="mb-4 text-5xl animate-bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                {stat.icon}
                            </div>
                            <AnimatedCounter
                                end={stat.value}
                                suffix={stat.suffix}
                                duration={2000 + (index * 200)}
                            />
                            <div className="mt-2 text-gray-600 dark:text-gray-400 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
