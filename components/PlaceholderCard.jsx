import React from 'react';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';

const PlaceholderCard = ({ type = 'default', title, description }) => {
    const getIcon = () => {
        switch (type) {
            case 'image':
                return <ImageIcon sx={{ fontSize: 80 }} />;
            case 'news':
                return <ArticleIcon sx={{ fontSize: 80 }} />;
            case 'event':
                return <EventIcon sx={{ fontSize: 80 }} />;
            case 'career':
                return <WorkIcon sx={{ fontSize: 80 }} />;
            case 'partner':
                return <BusinessIcon sx={{ fontSize: 80 }} />;
            case 'client':
                return <GroupsIcon sx={{ fontSize: 80 }} />;
            default:
                return <ImageIcon sx={{ fontSize: 80 }} />;
        }
    };

    return (
        <div className="card p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="text-gray-300 dark:text-gray-700 animate-pulse">
                    {getIcon()}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-500 mb-2">
                        {title || 'No Data Available'}
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-600">
                        {description || 'Content will appear here once added'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const ImagePlaceholder = ({ width = '100%', height = '200px', text = 'Image' }) => {
    return (
        <div
            className="bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center animate-pulse"
            style={{ width, height }}
        >
            <div className="text-center">
                <ImageIcon sx={{ fontSize: 60, color: 'var(--color-text-secondary)' }} />
                <p className="text-sm text-gray-500 dark:text-gray-600 mt-2">{text}</p>
            </div>
        </div>
    );
};

export const TextPlaceholder = ({ lines = 3, className = '' }) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {[...Array(lines)].map((_, i) => (
                <div
                    key={i}
                    className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
                    style={{ width: i === lines - 1 ? '70%' : '100%' }}
                />
            ))}
        </div>
    );
};

export const GridPlaceholder = ({ count = 3, type = 'default' }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(count)].map((_, i) => (
                <PlaceholderCard
                    key={i}
                    type={type}
                    title={`Sample ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`}
                    description="This is placeholder content"
                />
            ))}
        </div>
    );
};

export default PlaceholderCard;
