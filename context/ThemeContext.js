"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark'); // Default to dark during hydration
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    useEffect(() => {
        // Initialize theme from localStorage after mount to avoid hydration mismatch
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && savedTheme !== theme) {
            setTheme(savedTheme);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Apply theme class to document root
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        
        if (isAdmin) {
            root.classList.add('light');
        } else {
            root.classList.add(theme);
            // Save to localStorage (only if not on admin)
            localStorage.setItem('theme', theme);
        }
    }, [theme, isAdmin]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const value = {
        theme,
        toggleTheme,
        isDark: theme === 'dark',
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
