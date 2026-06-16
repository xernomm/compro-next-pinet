import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CanvasGridBackground from '@/components/CanvasGridBackground';
import { useParams, useRouter } from 'next/navigation';
import { Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import CategoryIcon from '@mui/icons-material/Category';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { productAPI } from '@/api/apiService';
import { getImageUrl, parseJSON } from '@/utils/imageUtils';
import Loading from '@/components/Loading';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

const ProductDetail = ({ companyInfo, currentSlug }) => {
    const { slug: paramSlug } = useParams();
    const router = useRouter();
    const slug = currentSlug || paramSlug;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await productAPI.getBySlug(slug);
                setProduct(response.data);

                // Fetch related products
                if (response.data?.category) {
                    const allProducts = await productAPI.getAll();
                    const related = allProducts.data
                        .filter(p => p.category === response.data.category && p.slug !== slug && p.is_active)
                        .slice(0, 3);
                    setRelatedProducts(related);
                }
            } catch (err) {
                setError('Product not found');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    if (loading) return <Loading fullScreen />;

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-cyber-dark text-gray-900 dark:text-gray-100">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Product not found</p>
                    <button onClick={() => router.push('/')} className="btn-primary">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const gallery = parseJSON(product.gallery, []);
    const allImages = product.image_url ? [product.image_url, ...gallery] : gallery;
    const features = parseJSON(product.features, []);
    const benefits = parseJSON(product.benefits, []);
    const specifications = parseJSON(product.specifications, {});

    return (
        <div className="min-h-screen bg-white dark:bg-cyber-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar companyInfo={companyInfo} />

            {/* Hero Section with Grid */}
            <div 
                className="relative pt-24 pb-32 overflow-hidden grid-bg border-b border-gray-200 dark:border-cyber-border transition-colors duration-300"
                style={{ background: 'var(--color-bg-secondary)' }}
            >
                {/* Canvas Grid Background Effect */}
                <CanvasGridBackground solidColor="#121214" dotColor="#ff2d2d" boxSize={180} opacityClass="opacity-[0.35] dark:opacity-[0.45]" />

                {/* Gradient Orbs */}
                <div className="absolute top-20 right-20 w-96 h-96 bg-primary-500/10 dark:bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-20 w-64 h-64 bg-primary-500/10 dark:bg-white/5 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    {/* Back Button */}
                    <Link
                        href="/#products"
                        className="inline-flex items-center text-gray-600 dark:text-white/80 hover:text-primary-600 dark:hover:text-white mb-8 transition-colors group"
                    >
                        <ArrowBackIcon className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Products
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Product Info */}
                        <div className="text-gray-900 dark:text-white">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                {product.category && (
                                    <Chip
                                        icon={<CategoryIcon sx={{ color: '#ef4444 !important', fontSize: 16 }} />}
                                        label={product.category}
                                        sx={{
                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444',
                                            fontWeight: 600,
                                        }}
                                    />
                                )}
                                {product.is_featured && (
                                    <Chip
                                        icon={<StarIcon sx={{ color: '#fbbf24 !important', fontSize: 16 }} />}
                                        label="Featured"
                                        sx={{
                                            backgroundColor: 'rgba(251, 191, 36, 0.1)',
                                            color: '#fbbf24',
                                            fontWeight: 600,
                                        }}
                                    />
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {product.name}
                            </h1>

                            {product.short_description && (
                                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-2xl">
                                    {product.short_description}
                                </p>
                            )}

                            {product.price_range && (
                                <div className="inline-block bg-gray-150 dark:bg-cyber-surface border border-gray-250 dark:border-cyber-border rounded-2xl px-6 py-4 mb-8">
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">Starting from</span>
                                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                        {product.price_range}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-4">
                                {product.brochure_url && (
                                    <a
                                        href={getImageUrl(product.brochure_url)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-6 py-3 bg-gray-250/50 hover:bg-gray-250 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white font-semibold rounded-xl transition-all backdrop-blur-lg border border-gray-300 dark:border-white/10 shadow-lg"
                                    >
                                        <DownloadIcon className="mr-2" />
                                        Download Brochure
                                    </a>
                                )}
                                <Link
                                    href="/#contact"
                                    className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all backdrop-blur-lg border border-primary-600/30 shadow-lg hover:scale-105"
                                >
                                    Request Quote
                                </Link>
                            </div>
                        </div>

                        {/* Product Image Gallery */}
                        <div className="relative">
                            <div className="relative bg-white dark:bg-cyber-surface border border-gray-100 dark:border-cyber-border rounded-3xl p-4 shadow-2xl">
                                {/* Main Image */}
                                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-cyber-dark">
                                    {allImages.length > 0 ? (
                                        <img
                                            src={getImageUrl(allImages[activeImage])}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-4"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
                                            <span className="text-white text-8xl font-bold">
                                                {product.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                {allImages.length > 1 && (
                                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                        {allImages.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveImage(idx)}
                                                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx
                                                    ? 'border-primary-500 ring-2 ring-primary-500/50'
                                                    : 'border-transparent hover:border-gray-300 dark:hover:border-cyber-border'
                                                    }`}
                                            >
                                                <img
                                                    src={getImageUrl(img)}
                                                    alt={`${product.name} ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        {product.description && (
                            <div className="bg-white dark:bg-cyber-surface rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-cyber-border">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                    <div className="w-1 h-8 bg-primary-500 rounded-full mr-4"></div>
                                    About This Product
                                </h2>
                                <div
                                    className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>
                        )}

                        {/* Features & Benefits Grid */}
                        {(features.length > 0 || benefits.length > 0) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {features.length > 0 && (
                                    <div className="bg-white dark:bg-cyber-surface rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-cyber-border">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mr-3">
                                                <CheckCircleIcon className="text-blue-500" />
                                            </div>
                                            Key Features
                                        </h3>
                                        <ul className="space-y-4">
                                            {features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start group">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 group-hover:scale-150 transition-transform"></div>
                                                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {benefits.length > 0 && (
                                    <div className="bg-white dark:bg-cyber-surface rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-cyber-border">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mr-3">
                                                <StarIcon className="text-green-500" />
                                            </div>
                                            Benefits
                                        </h3>
                                        <ul className="space-y-4">
                                            {benefits.map((benefit, idx) => (
                                                <li key={idx} className="flex items-start group">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 group-hover:scale-150 transition-transform"></div>
                                                    <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Video */}
                        {product.video_url && (
                            <div className="bg-white dark:bg-cyber-surface rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-cyber-border">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center mr-3">
                                        <PlayArrowIcon className="text-primary-500" />
                                    </div>
                                    Product Video
                                </h3>
                                <div className="aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-cyber-border">
                                    {product.video_url.startsWith('/') || product.video_url.includes('/uploads/') ? (
                                        <video
                                            src={getImageUrl(product.video_url)}
                                            controls
                                            className="w-full h-full object-contain bg-black"
                                        />
                                    ) : (
                                        <iframe
                                            src={product.video_url}
                                            title={`${product.name} video`}
                                            className="w-full h-full"
                                            allowFullScreen
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Specifications */}
                        {Object.keys(specifications).length > 0 && (
                            <div className="bg-white dark:bg-cyber-surface rounded-3xl p-8 shadow-xl sticky top-24 border border-gray-100 dark:border-cyber-border">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                    Specifications
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(specifications).map(([key, value], idx) => (
                                        <div
                                            key={idx}
                                            className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-cyber-border last:border-0"
                                        >
                                            <span className="text-gray-500 dark:text-gray-400 text-sm">{key}</span>
                                            <span className="font-medium text-gray-900 dark:text-white text-right">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Target Segment */}
                        {product.target_segment && (
                            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 text-white shadow-xl border border-primary-600/30">
                                <h3 className="text-lg font-bold mb-3">Ideal For</h3>
                                <p className="text-white/90">{product.target_segment}</p>
                            </div>
                        )}

                        {/* CTA Card */}
                        <div className="bg-white dark:bg-cyber-surface rounded-3xl p-8 shadow-xl text-center border border-gray-100 dark:border-cyber-border">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Interested in this product?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Contact us for pricing and availability
                            </p>
                            <Link
                                href="/#contact"
                                className="block w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-center transition-all hover:scale-105 border border-primary-600/30"
                            >
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Related Products
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedProducts.map((relProduct) => (
                                <Link
                                    key={relProduct.id}
                                    href={`/products/${relProduct.slug}`}
                                    className="group bg-white dark:bg-cyber-surface rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100 dark:border-cyber-border"
                                >
                                    <div className="aspect-video bg-gray-100 dark:bg-cyber-dark overflow-hidden border-b border-gray-100 dark:border-cyber-border">
                                        {relProduct.image_url ? (
                                            <img
                                                src={getImageUrl(relProduct.image_url)}
                                                alt={relProduct.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-700">
                                                <span className="text-white text-4xl font-bold">
                                                    {relProduct.name.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {relProduct.name}
                                        </h3>
                                        {relProduct.short_description && (
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                                                {relProduct.short_description}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer companyInfo={companyInfo} />
            <ChatWidget />
        </div>
    );
};

export default ProductDetail;
