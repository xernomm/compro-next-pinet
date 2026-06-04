"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Chip, Tabs, Tab } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getImageUrl } from '@/utils/imageUtils';
import { GridPlaceholder } from '../PlaceholderCard';

const ProductsSection = ({ products }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const activeProducts = products.filter(product => product.is_active);

    if (activeProducts.length === 0) {
        return (
            <section id="products" className="section-container">
                <p className="mono-label text-center mb-3">{'// Our Solutions'}</p>
                <h2 className="section-title">Our Products</h2>
                <p className="section-subtitle">
                    Innovative solutions designed to drive your success
                </p>
                <GridPlaceholder count={3} type="default" />
            </section>
        );
    }

    // Get unique categories
    const categories = ['all', ...new Set(activeProducts.map(p => p.category).filter(Boolean))];

    const filteredProducts = selectedCategory === 'all'
        ? activeProducts
        : activeProducts.filter(p => p.category === selectedCategory);

    const featuredProducts = filteredProducts.filter(p => p.is_featured);
    const regularProducts = filteredProducts.filter(p => !p.is_featured);
    const displayProducts = [...featuredProducts, ...regularProducts];

    return (
        <section id="products" className="section-container">
            <p className="mono-label text-center mb-3">{'// Our Solutions'}</p>
            <h2 className="section-title">Our Products</h2>
            <p className="section-subtitle">
                Innovative solutions designed to drive your success
            </p>

            {/* Category Filter */}
            {categories.length > 1 && (
                <div className="flex justify-center mb-12">
                    <Tabs
                        value={selectedCategory}
                        onChange={(e, newValue) => setSelectedCategory(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTab-root': {
                                fontFamily: "'Space Grotesk', sans-serif",
                                color: 'var(--color-text-secondary)',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                fontSize: '0.8rem',
                                '&.Mui-selected': {
                                    color: 'var(--color-primary)',
                                },
                            },
                            '& .MuiTabs-indicator': {
                                background: 'linear-gradient(90deg, #ff2d2d, #ffffff)',
                                height: '2px',
                            },
                        }}
                    >
                        {categories.map((category) => (
                            <Tab
                                key={category}
                                label={category === 'all' ? 'All Products' : category}
                                value={category}
                            />
                        ))}
                    </Tabs>
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayProducts.map((product, index) => (
                    <Link key={product.id}
                        href={`/products/${product.slug}`}
                        className="group block relative overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-2 glass-card glass-highlight"
                        style={{
                            animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                        }}
                    >
                        {/* Top accent line */}
                        <div
                            className="absolute top-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-600 origin-left z-10"
                            style={{ background: 'linear-gradient(90deg, #ff2d2d, #ffffff)' }}
                        />

                        {/* Image */}
                        <div className="relative h-56 overflow-hidden" style={{ background: 'var(--color-bg-tertiary)' }}>
                            {product.image_url ? (
                                <img
                                    src={getImageUrl(product.image_url)}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #ff2d2d, #c80d0d)' }}
                                >
                                    <span className="text-white text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        {product.name.charAt(0)}
                                    </span>
                                </div>
                            )}

                            {/* Featured Badge */}
                            {product.is_featured && (
                                <div
                                    className="absolute top-4 right-4 px-3 py-1 rounded-md flex items-center space-x-1 text-xs font-semibold shadow-lg z-10"
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                        color: 'white',
                                    }}
                                >
                                    <StarIcon sx={{ fontSize: 14 }} />
                                    <span>Featured</span>
                                </div>
                            )}

                            {/* Category Badge */}
                            {product.category && (
                                <div className="absolute bottom-4 left-4 z-10">
                                    <Chip
                                        label={product.category}
                                        size="small"
                                        sx={{
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontSize: '0.7rem',
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase',
                                            backgroundColor: 'rgba(22, 22, 26, 0.8)',
                                            color: '#ffffff',
                                            fontWeight: 600,
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 45, 45, 0.3)',
                                        }}
                                    />
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                <span className="text-white font-semibold flex items-center gap-2 text-sm"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.05em', textTransform: 'uppercase' }}
                                >
                                    View Details <ArrowForwardIcon fontSize="small" />
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h3
                                className="text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                {product.name}
                            </h3>
                            {product.short_description && (
                                <p className="line-clamp-2 mb-4" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                    {product.short_description}
                                </p>
                            )}
                            {product.price_range && (
                                <p className="font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
                                    {product.price_range}
                                </p>
                            )}
                            <div
                                className="font-semibold flex items-center group-hover:translate-x-2 transition-transform text-sm"
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    color: 'var(--color-primary)',
                                }}
                            >
                                View Details
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default ProductsSection;
