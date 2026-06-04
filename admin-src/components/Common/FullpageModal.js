import React, { useEffect } from 'react';

const FullpageModal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fullpage-modal-overlay">
            <div className="fullpage-modal-container">
                <div className="fullpage-modal-header">
                    <h2>{title}</h2>
                    <button
                        type="button"
                        className="fullpage-modal-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>
                <div className="fullpage-modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FullpageModal;
