import React, { useState } from 'react';
import { backupAPI } from '../../api/apiService';
import { toast } from 'react-toastify';

const BackupPage = () => {
    const [loading, setLoading] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);
    const [syncStatus, setSyncStatus] = useState(''); // idle, syncing, success, error
    const [syncProgress, setSyncProgress] = useState(0);
    const [lastBackup, setLastBackup] = useState(null);
    const [lastSync, setLastSync] = useState(null);

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

    const handleSyncUploads = async () => {
        try {
            setSyncLoading(true);
            setSyncStatus('syncing');
            setSyncProgress(0);
            setSyncStatus('Preparing sync...');

            // Simulate progress for better UX
            const progressInterval = setInterval(() => {
                setSyncProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + 10;
                });
            }, 200);

            const response = await backupAPI.syncUploads();

            clearInterval(progressInterval);
            setSyncProgress(100);
            setSyncStatus('success');
            setLastSync(response.data.message);
            toast.success('Uploads sync completed successfully!');

            // Reset status after 3 seconds
            setTimeout(() => {
                setSyncStatus('');
                setSyncProgress(0);
            }, 3000);

        } catch (error) {
            console.error('Upload sync failed:', error);
            setSyncStatus('error');
            setSyncProgress(0);
            toast.error(error.response?.data?.message || 'Upload sync failed');

            // Reset status after 5 seconds for errors
            setTimeout(() => {
                setSyncStatus('');
            }, 5000);
        } finally {
            setSyncLoading(false);
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

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
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

                        <button
                            onClick={handleSyncUploads}
                            disabled={syncLoading}
                            className={`btn ${syncStatus === 'success' ? 'btn-success' : syncStatus === 'error' ? 'btn-danger' : 'btn-secondary'}`}
                            style={{
                                padding: '12px 30px',
                                fontSize: '16px',
                                opacity: syncLoading ? 0.7 : 1,
                                cursor: syncLoading ? 'not-allowed' : 'pointer',
                                position: 'relative',
                                minWidth: '140px'
                            }}
                        >
                            {syncLoading ? (
                                <>
                                    <span style={{ opacity: 0.7 }}>Syncing...</span>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        height: '3px',
                                        backgroundColor: '#007bff',
                                        width: `${syncProgress}%`,
                                        transition: 'width 0.3s ease'
                                    }}></div>
                                </>
                            ) : syncStatus === 'success' ? (
                                '✓ Synced'
                            ) : syncStatus === 'error' ? (
                                '✗ Failed'
                            ) : (
                                'Sync Uploads'
                            )}
                        </button>
                    </div>

                    {/* Status Messages */}
                    {syncStatus && (
                        <div style={{
                            marginTop: '15px',
                            padding: '10px 15px',
                            borderRadius: '4px',
                            maxWidth: '400px',
                            margin: '15px auto 0',
                            fontSize: '14px',
                            textAlign: 'center',
                            backgroundColor: syncStatus === 'success' ? '#d4edda' :
                                           syncStatus === 'error' ? '#f8d7da' :
                                           syncStatus === 'syncing' ? '#cce5ff' : '#fff3cd',
                            color: syncStatus === 'success' ? '#155724' :
                                  syncStatus === 'error' ? '#721c24' :
                                  syncStatus === 'syncing' ? '#084298' : '#856404',
                            border: `1px solid ${syncStatus === 'success' ? '#c3e6cb' :
                                               syncStatus === 'error' ? '#f5c6cb' :
                                               syncStatus === 'syncing' ? '#b3d7ff' : '#ffeaa7'}`
                        }}>
                            {syncStatus === 'syncing' && (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <div className="spinner-border spinner-border-sm" role="status"></div>
                                        <span>{syncStatus}</span>
                                    </div>
                                    <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                                        {syncProgress}% complete
                                    </div>
                                </>
                            )}
                            {syncStatus === 'success' && (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <span>✅</span>
                                        <span>Sync completed successfully!</span>
                                    </div>
                                </>
                            )}
                            {syncStatus === 'error' && (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <span>❌</span>
                                        <span>Sync failed. Please try again.</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {lastSync && !syncStatus && (
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#cce5ff', color: '#084298', borderRadius: '4px', maxWidth: '600px', margin: '20px auto 0' }}>
                            <strong>Uploads Sync Completed</strong>
                            <div style={{ fontSize: '14px', marginTop: '5px' }}>{lastSync}</div>
                        </div>
                    )}

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
