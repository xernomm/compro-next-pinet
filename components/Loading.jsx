"use client";

import React from 'react';

const Loading = ({ fullScreen = false, size = 40 }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-cyber-dark z-50">
                <div className="text-center">
                    {/* Custom animated loader */}
                    <div className="relative mb-6" style={{ width: '60px', height: '60px', margin: '0 auto' }}>
                        {/* Outer ring */}
                        <div
                            className="absolute inset-0 rounded-lg"
                            style={{
                                border: '2px solid transparent',
                                borderTop: '2px solid #ff2d2d',
                                borderRight: '2px solid rgba(255, 255, 255, 0.3)',
                                animation: 'spin 1s linear infinite',
                            }}
                        />
                        {/* Inner ring */}
                        <div
                            className="absolute rounded-lg"
                            style={{
                                top: '8px',
                                left: '8px',
                                right: '8px',
                                bottom: '8px',
                                border: '2px solid transparent',
                                borderBottom: '2px solid #ffffff',
                                borderLeft: '2px solid rgba(255, 45, 45, 0.3)',
                                animation: 'spin 0.8s linear infinite reverse',
                            }}
                        />
                        {/* Center dot */}
                        <div
                            className="absolute"
                            style={{
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '6px',
                                height: '6px',
                                borderRadius: '2px',
                                background: '#ff2d2d',
                                boxShadow: '0 0 10px rgba(255, 45, 45, 0.6)',
                                animation: 'pulse 1.5s ease-in-out infinite',
                            }}
                        />
                    </div>
                    <p
                        className="text-sm"
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        Loading...
                    </p>
                </div>

                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.5); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12">
            <div className="relative" style={{ width: '40px', height: '40px' }}>
                <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                        border: '2px solid transparent',
                        borderTop: '2px solid #ff2d2d',
                        animation: 'spin 1s linear infinite',
                    }}
                />
            </div>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loading;
