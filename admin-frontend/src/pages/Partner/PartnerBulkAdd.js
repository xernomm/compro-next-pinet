import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { partnerAPI } from '../../api/apiService';
import { toast } from 'react-toastify';

const PartnerBulkAdd = () => {
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const [parsedData, setParsedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    const parseInput = (text) => {
        const lines = text.split('\n').filter(line => line.trim());
        const parsed = lines.map((line, index) => {
            const parts = line.split(',').map(p => p.trim());
            const name = parts[0] || '';
            const website_url = parts[1] || '';
            const partnership_type = parts[2] || '';

            // Generate slug from name
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            return {
                index: index + 1,
                name,
                slug,
                website_url,
                partnership_type,
                is_active: true,
                isValid: name.length > 0
            };
        });
        return parsed;
    };

    const handleTextChange = (e) => {
        const text = e.target.value;
        setInputText(text);
        setParsedData(parseInput(text));
    };

    const handleSubmit = async () => {
        const validItems = parsedData.filter(item => item.isValid);
        if (validItems.length === 0) {
            toast.error('No valid items to add');
            return;
        }

        setLoading(true);
        setProgress({ current: 0, total: validItems.length });

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < validItems.length; i++) {
            const item = validItems[i];
            try {
                const formData = new FormData();
                formData.append('name', item.name);
                formData.append('slug', item.slug);
                formData.append('website_url', item.website_url);
                formData.append('partnership_type', item.partnership_type);
                formData.append('is_active', 'true');

                await partnerAPI.create(formData);
                successCount++;
            } catch (error) {
                console.error(`Error adding ${item.name}:`, error);
                failCount++;
            }
            setProgress({ current: i + 1, total: validItems.length });
        }

        setLoading(false);

        if (successCount > 0) {
            toast.success(`Successfully added ${successCount} partner(s)`);
        }
        if (failCount > 0) {
            toast.error(`Failed to add ${failCount} partner(s)`);
        }

        if (successCount > 0) {
            navigate('/dashboard/partners');
        }
    };

    const validCount = parsedData.filter(item => item.isValid).length;
    const invalidCount = parsedData.filter(item => !item.isValid).length;

    return (
        <div className="page-container">
            <div className="form-page-header">
                <button
                    type="button"
                    className="btn btn-secondary btn-back"
                    onClick={() => navigate('/dashboard/partners')}
                >
                    ← Back
                </button>
                <h2>Bulk Add Partners</h2>
            </div>

            <div className="content-card bulk-add-container">
                <div className="bulk-add-instructions">
                    <h4>📋 Instructions</h4>
                    <p>Paste your partner data below. Each line represents one partner.</p>
                    <p>Format: <code>Name, Website URL, Partnership Type</code></p>
                    <p><strong>Valid Partnership Types:</strong> technology, strategic, vendor, solution, other</p>
                    <p>Example:</p>
                    <code>
                        Microsoft, https://microsoft.com, technology<br />
                        AWS, https://aws.amazon.com, strategic<br />
                        Google, https://google.com, vendor
                    </code>
                </div>

                <div className="form-group">
                    <label>Paste Partner Data</label>
                    <textarea
                        className="bulk-add-textarea"
                        value={inputText}
                        onChange={handleTextChange}
                        placeholder="Name, Website URL, Partnership Type&#10;Microsoft, https://microsoft.com, technology&#10;AWS, https://aws.amazon.com, strategic"
                        disabled={loading}
                    ></textarea>
                </div>

                {parsedData.length > 0 && (
                    <div className="bulk-add-preview">
                        <h4>Preview ({parsedData.length} items)</h4>

                        <div className="bulk-add-stats">
                            <div className="bulk-add-stat">
                                <span className="bulk-add-stat-value">{validCount}</span>
                                <span className="bulk-add-stat-label">Valid</span>
                            </div>
                            <div className="bulk-add-stat">
                                <span className="bulk-add-stat-value" style={{ color: invalidCount > 0 ? '#e74c3c' : undefined }}>
                                    {invalidCount}
                                </span>
                                <span className="bulk-add-stat-label">Invalid</span>
                            </div>
                        </div>

                        <div className="table-container" style={{ marginTop: '20px' }}>
                            <table className="preview-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Slug</th>
                                        <th>Website</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsedData.map((item) => (
                                        <tr key={item.index} className={!item.isValid ? 'row-error' : ''}>
                                            <td>{item.index}</td>
                                            <td>{item.name || <em style={{ color: '#999' }}>Empty</em>}</td>
                                            <td>{item.slug || '-'}</td>
                                            <td>{item.website_url || '-'}</td>
                                            <td>{item.partnership_type || '-'}</td>
                                            <td>
                                                {item.isValid ? (
                                                    <span className="status-badge status-active">Valid</span>
                                                ) : (
                                                    <span className="status-badge status-inactive">Invalid</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {loading && (
                    <div style={{ marginTop: '20px', padding: '20px', background: '#f0f7ff', borderRadius: '8px' }}>
                        <p style={{ margin: '0 0 10px 0' }}>
                            Adding partners... {progress.current}/{progress.total}
                        </p>
                        <div style={{
                            background: '#ddd',
                            borderRadius: '4px',
                            height: '8px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                background: '#667eea',
                                height: '100%',
                                width: `${(progress.current / progress.total) * 100}%`,
                                transition: 'width 0.3s'
                            }}></div>
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/dashboard/partners')}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={loading || validCount === 0}
                    >
                        {loading ? `Adding... (${progress.current}/${progress.total})` : `Add ${validCount} Partner(s)`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PartnerBulkAdd;
