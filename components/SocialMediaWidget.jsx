import React, { useState } from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';

const SocialMediaWidget = ({ companyInfo }) => {
    const [isOpen, setIsOpen] = useState(false);

    const socialLinks = [
        { icon: FacebookIcon, url: companyInfo?.facebook_url, label: 'Facebook', color: '#1877F2' },
        { icon: TwitterIcon, url: companyInfo?.twitter_url, label: 'Twitter', color: '#1DA1F2' },
        { icon: InstagramIcon, url: companyInfo?.instagram_url, label: 'Instagram', color: '#E4405F' },
        { icon: LinkedInIcon, url: companyInfo?.linkedin_url, label: 'LinkedIn', color: '#0A66C2' },
        { icon: YouTubeIcon, url: companyInfo?.youtube_url, label: 'YouTube', color: '#FF0000' },
    ].filter(link => link.url);

    if (socialLinks.length === 0) return null;

    return (
        <div className="fixed left-8 bottom-8 z-40">
            {/* Social Links */}
            {isOpen && (
                <div className="mb-4 space-y-3">
                    {socialLinks.map((social, index) => {
                        const Icon = social.icon;
                        return (
                            <a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-dark-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
                                style={{
                                    animation: `slideInLeft 0.3s ease-out ${index * 0.1}s both`
                                }}
                                aria-label={social.label}
                            >
                                <Icon
                                    sx={{
                                        color: social.color,
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'rotate(360deg)'
                                        }
                                    }}
                                />
                            </a>
                        );
                    })}
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center animate-pulse-glow"
                aria-label="Toggle social media"
            >
                {isOpen ? (
                    <CloseIcon className="transform rotate-0 transition-transform duration-300" />
                ) : (
                    <ShareIcon className="transform rotate-0 transition-transform duration-300 hover:rotate-180" />
                )}
            </button>
        </div>
    );
};

export default SocialMediaWidget;
