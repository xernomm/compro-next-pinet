import React from 'react';
import { useNavigate } from 'react-router-dom';

const FormPage = ({ title, backPath, children, onSubmit, loading, submitText = 'Save' }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (backPath) {
            navigate(backPath);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="page-container">
            <div className="form-page-header">
                <button
                    type="button"
                    className="btn btn-secondary btn-back"
                    onClick={handleBack}
                >
                    ← Back
                </button>
                <h2>{title}</h2>
            </div>

            <div className="content-card form-page-content">
                <form onSubmit={onSubmit}>
                    {children}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleBack}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormPage;
