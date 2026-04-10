import React from 'react';
import { CircularProgress } from '@mui/material';

const Loading = ({ fullScreen = false, size = 40 }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-dark-950 z-50">
                <div className="text-center">
                    <CircularProgress
                        size={size}
                        sx={{ color: '#dc2626' }}
                    />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12">
            <CircularProgress
                size={size}
                sx={{ color: '#dc2626' }}
            />
        </div>
    );
};

export default Loading;
