"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import { getImageUrl } from '@/utils/imageUtils';

const Navbar = ({ companyInfo }) => {
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const location = { pathname, hash: '' };
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    // Check if we're on the home page
    const isHomePage = location.pathname === '/';

    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'services', label: 'Services' },
        { id: 'values', label: 'Values' },
        { id: 'products', label: 'Products' },
        { id: 'partners', label: 'Partners' },
        { id: 'clients', label: 'Clients' },
        { id: 'news', label: 'News' },
        { id: 'events', label: 'Events' },
        { id: 'careers', label: 'Careers', isPage: true, path: '/careers' },
        { id: 'contact', label: 'Contact' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            // Only update active section on home page
            if (isHomePage) {
                const sections = navItems.map(item => item.id);
                for (const sectionId of sections) {
                    const element = document.getElementById(sectionId);
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        if (rect.top <= 100 && rect.bottom >= 100) {
                            setActiveSection(sectionId);
                            break;
                        }
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHomePage]);

    // Reset active section when not on home page
    useEffect(() => {
        if (!isHomePage) {
            setActiveSection('');
        }
    }, [isHomePage]);

    const handleNavClick = (item) => {
        setMobileOpen(false);

        // If it's a separate page, navigate to it
        if (item.isPage) {
            router.push(item.path);
            return;
        }

        const sectionId = item.id;

        if (isHomePage) {
            // On home page - scroll to section
            const element = document.getElementById(sectionId);
            if (element) {
                const offset = 80; // Navbar height
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        } else {
            // On detail page - navigate to home with hash
            router.push(`/#${sectionId}`);
        }
    };

    const handleLogoClick = () => {
        if (isHomePage) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            router.push('/');
        }
        setMobileOpen(false);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const isActive = (item) => {
        return (item.isPage && location.pathname === item.path) ||
            (activeSection === item.id && isHomePage && !item.isPage);
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'backdrop-blur-xl shadow-lg'
                    : 'bg-transparent'
                    }`}
                style={{
                    backgroundColor: isScrolled
                        ? (theme === 'dark' ? 'rgba(10, 10, 15, 0.85)' : 'rgba(255, 255, 255, 0.9)')
                        : 'transparent',
                    borderBottom: isScrolled
                        ? (theme === 'dark' ? '1px solid rgba(255, 45, 45, 0.15)' : '1px solid rgba(0,0,0,0.06)')
                        : '1px solid transparent',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div
                            className="flex items-center cursor-pointer flex-shrink-0"
                            onClick={handleLogoClick}
                            style={{ width: '10%', maxWidth: '180px', minWidth: '110px' }}
                        >
                            {companyInfo?.logo_url ? (
                                <img
                                    src={getImageUrl(companyInfo.logo_url)}
                                    alt={companyInfo.company_name}
                                    className="w-full h-auto object-contain"
                                />
                            ) : (
                                <span
                                    className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    {companyInfo?.company_name || 'Company'}
                                </span>
                            )}
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-0.5">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item)}
                                    className="relative px-3 py-2 transition-all duration-300 group"
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontSize: '0.8rem',
                                        fontWeight: isActive(item) ? 600 : 500,
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        color: isActive(item)
                                            ? 'var(--color-primary)'
                                            : (theme === 'dark' ? '#94a3b8' : '#475569'),
                                    }}
                                >
                                    {item.label}
                                    {/* Active underline glow */}
                                    <span
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] transition-all duration-300"
                                        style={{
                                            width: isActive(item) ? '80%' : '0%',
                                            background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
                                            boxShadow: isActive(item) ? '0 0 10px rgba(255, 45, 45, 0.5)' : 'none',
                                        }}
                                    />
                                    {/* Hover underline */}
                                    {!isActive(item) && (
                                        <span
                                            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-[60%] transition-all duration-300"
                                            style={{
                                                background: 'var(--color-primary)',
                                                opacity: 0.5,
                                            }}
                                        />
                                    )}
                                </button>
                            ))}

                            {/* Theme Toggle */}
                            <IconButton
                                onClick={toggleTheme}
                                sx={{
                                    ml: 2,
                                    color: theme === 'dark' ? '#ffffff' : '#ed1515',
                                    border: '1px solid',
                                    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(237, 21, 21, 0.2)',
                                    borderRadius: '8px',
                                    padding: '6px',
                                    '&:hover': {
                                        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(237, 21, 21, 0.5)',
                                        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(237, 21, 21, 0.05)',
                                    },
                                }}
                            >
                                {theme === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                            </IconButton>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center space-x-1 sm:space-x-2">
                            <IconButton
                                onClick={toggleTheme}
                                size="small"
                                sx={{
                                    color: theme === 'dark' ? '#ffffff' : '#ed1515',
                                }}
                            >
                                {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                            <IconButton
                                onClick={handleDrawerToggle}
                                size="small"
                                sx={{
                                    color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 300,
                        backgroundColor: theme === 'dark' ? '#0a0a0f' : '#ffffff',
                        borderLeft: theme === 'dark' ? '1px solid rgba(255, 45, 45, 0.15)' : '1px solid #e2e8f0',
                    },
                }}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-8">
                        <span
                            className="text-xl font-bold text-gradient"
                            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.05em', textTransform: 'uppercase' }}
                        >
                            Menu
                        </span>
                        <IconButton onClick={handleDrawerToggle}>
                            <CloseIcon sx={{ color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
                        </IconButton>
                    </div>

                    {/* Show Home button when on detail pages */}
                    {!isHomePage && (
                        <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,45,45,0.15)' : '#e2e8f0'}` }}>
                            <button
                                onClick={handleLogoClick}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300"
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    fontSize: '0.85rem',
                                    background: theme === 'dark' ? 'rgba(255,45,45,0.1)' : 'rgba(237,21,21,0.05)',
                                    color: 'var(--color-primary)',
                                }}
                            >
                                <HomeIcon />
                                Back to Home
                            </button>
                        </div>
                    )}

                    <List>
                        {navItems.map((item) => (
                            <ListItem
                                button
                                key={item.id}
                                onClick={() => handleNavClick(item)}
                                sx={{
                                    borderRadius: '8px',
                                    mb: 0.5,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    backgroundColor: isActive(item)
                                        ? (theme === 'dark' ? 'rgba(255, 45, 45, 0.1)' : 'rgba(237, 21, 21, 0.05)')
                                        : 'transparent',
                                    borderLeft: isActive(item) ? '3px solid var(--color-primary)' : '3px solid transparent',
                                    '&:hover': {
                                        backgroundColor: theme === 'dark' ? 'rgba(255, 45, 45, 0.08)' : 'rgba(237, 21, 21, 0.04)',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={item.label}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontSize: '0.85rem',
                                            letterSpacing: '0.08em',
                                            textTransform: 'uppercase',
                                            color: isActive(item)
                                                ? 'var(--color-primary)'
                                                : (theme === 'dark' ? '#94a3b8' : '#475569'),
                                            fontWeight: isActive(item) ? 600 : 400,
                                        },
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
        </>
    );
};

export default Navbar;
