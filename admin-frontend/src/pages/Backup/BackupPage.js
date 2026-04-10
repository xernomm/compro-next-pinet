import React, { useState } from 'react';
import { backupAPI } from '../../api/apiService';
import { toast } from 'react-toastify';

const BackupPage = () => {
    const [loading, setLoading] = useState(false);
    const [lastBackup, setLastBackup] = useState(null);

    const handleBackup = async () => {
        try {
            setLoading(true);
            const response = await backupAPI.create();
            setLastBackup(response.data.data);
            toast.success('Backup created successfully!');
        } catch (error) {
            console.error('Backup failed:', error);
            toast.error(error.response?.data?.message || 'Backup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>System Backup</h2>
            </div>

            <div className="content-card">
                <div className="backup-section" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>💾</div>
                    <h3>Database & Media Backup</h3>
                    <p style={{ color: '#666', marginBottom: '30px' }}>
                        Create a full backup of your database and media files.
                        The backup will be stored securely on the server.
                    </p>

                    <div style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        padding: '20px',
                        maxWidth: '500px',
                        margin: '0 auto 30px auto',
                        textAlign: 'left'
                    }}>
                        <h4 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>What will be backed up:</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px' }}>✅</span>
                                <strong>Database:</strong> Complete SQL dump of company_profile
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px' }}>✅</span>
                                <strong>Media Files:</strong> All files in /uploads folder
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={handleBackup}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{
                            padding: '12px 30px',
                            fontSize: '16px',
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Creating Backup...' : 'Backup Now'}
                    </button>

                    {lastBackup && (
                        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', maxWidth: '600px', margin: '30px auto 0' }}>
                            <strong>Backup Successful!</strong>
                            <div style={{ fontSize: '14px', marginTop: '5px' }}>
                                <div>Database: {lastBackup.database}</div>
                                <div>Media: {lastBackup.media}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BackupPage;
