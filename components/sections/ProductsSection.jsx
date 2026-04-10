import React, { useState } from 'react';
import Link from 'next/link';

import { Chip, Tabs, Tab } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getImageUrl } from '../../utils/imageUtils';
import { GridPlaceholder } from '../PlaceholderCard';

const ProductsSection = ({ products }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const activeProducts = products.filter(product => product.is_active);

    if (activeProducts.length === 0) {
        return (
            <section id="products" className="section-container">
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
                                color: 'var(--color-text-secondary)',
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                '&.Mui-selected': {
                                    color: '#dc2626',
                                },
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#dc2626',
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
                    <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="card card-hover-red overflow-hidden cursor-pointer group block"
                        style={{
                            animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                        }}
                    >
                        {/* Image */}
                        <div className="relative h-56 bg-gray-200 dark:bg-dark-800 overflow-hidden">
                            {product.image_url ? (
                                <img
                                    src={getImageUrl(product.image_url)}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
                                    <span className="text-white text-4xl font-bold">
                                        {product.name.charAt(0)}
                                    </span>
                                </div>
                            )}

                            {/* Featured Badge */}
                            {product.is_featured && (
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-semibold shadow-lg">
                                    <StarIcon fontSize="small" />
                                    <span>Featured</span>
                                </div>
                            )}

                            {/* Category Badge */}
                            {product.category && (
                                <div className="absolute bottom-4 left-4">
                                    <Chip
                                        label={product.category}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            fontWeight: 600,
                                            backdropFilter: 'blur(10px)',
                                        }}
                                    />
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                <span className="text-white font-semibold flex items-center gap-2">
                                    View Details <ArrowForwardIcon fontSize="small" />
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {product.name}
                            </h3>
                            {product.short_description && (
                                <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                    {product.short_description}
                                </p>
                            )}
                            {product.price_range && (
                                <p className="text-primary-600 dark:text-primary-400 font-semibold mb-4">
                                    {product.price_range}
                                </p>
                            )}
                            <div className="text-primary-600 dark:text-primary-400 font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                                View Details
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
