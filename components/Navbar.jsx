import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import { getImageUrl } from '../utils/imageUtils';

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
        { id: 'contact', label: 'Contact Us' },
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

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 dark:bg-dark-900/95 backdrop-blur-md shadow-lg'
                    : 'bg-transparent'
                    }`}
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
                                <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                                    {companyInfo?.company_name || 'Company'}
                                </span>
                            )}
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${(item.isPage && location.pathname === item.path) ||
                                        (activeSection === item.id && isHomePage && !item.isPage)
                                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}

                            {/* Theme Toggle */}
                            <IconButton
                                onClick={toggleTheme}
                                sx={{
                                    ml: 2,
                                    color: theme === 'dark' ? '#fbbf24' : '#dc2626',
                                }}
                            >
                                {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center space-x-1 sm:space-x-2">
                            <IconButton
                                onClick={toggleTheme}
                                size="small"
                                sx={{
                                    color: theme === 'dark' ? '#fbbf24' : '#dc2626',
                                }}
                            >
                                {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                            <IconButton
                                onClick={handleDrawerToggle}
                                size="small"
                                sx={{
                                    color: theme === 'dark' ? '#f9fafb' : '#111827',
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
                        width: 280,
                        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
                    },
                }}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                            Menu
                        </span>
                        <IconButton onClick={handleDrawerToggle}>
                            <CloseIcon sx={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }} />
                        </IconButton>
                    </div>

                    {/* Show Home button when on detail pages */}
                    {!isHomePage && (
                        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-dark-700">
                            <button
                                onClick={handleLogoClick}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold"
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
                                    mb: 1,
                                    backgroundColor:
                                        (item.isPage && location.pathname === item.path) ||
                                            (activeSection === item.id && isHomePage && !item.isPage)
                                            ? (theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)')
                                            : 'transparent',
                                    '&:hover': {
                                        backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(220, 38, 38, 0.2)',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={item.label}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            color:
                                                (item.isPage && location.pathname === item.path) ||
                                                    (activeSection === item.id && isHomePage && !item.isPage)
                                                    ? (theme === 'dark' ? '#ef4444' : '#dc2626')
                                                    : (theme === 'dark' ? '#f9fafb' : '#111827'),
                                            fontWeight:
                                                (item.isPage && location.pathname === item.path) ||
                                                    (activeSection === item.id && isHomePage && !item.isPage)
                                                    ? 600 : 400,
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
